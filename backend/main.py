import os
import json
import asyncio
from datetime import datetime
from typing import Dict, Any, List, Optional
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select

from db import init_db, get_session
from models import (
    SensorReading,
    ClassificationRecord,
    ModalityResult,
    CompositeResult,
    ModalityStatus,
    SystemStatusResponse,
)
from inference import run_modality_inference, get_endpoint_url

load_dotenv()

VALID_MODALITIES = {"rgb", "microscopic", "infrared", "acoustic", "capacitive"}


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(
    title="OreVision Backend API",
    description="Multimodal Mineral Ore Classification Orchestration Backend",
    version="1.0.0",
    lifespan=lifespan,
)

# ── CORS ──────────────────────────────────────────────────────────────────────
raw_origins = os.getenv("ALLOWED_ORIGINS", "")
allowed_origins = [
    origin.strip().rstrip("/")
    for origin in raw_origins.split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Health ────────────────────────────────────────────────────────────────────
@app.get("/api/health")
def health_check():
    return {"status": "ok"}

import subprocess
@app.get("/api/connection-status")
def connection_status():
    pi_ip = os.getenv("PI_IP_ADDRESS")
    pi_connected = False
    if pi_ip:
        try:
            res = subprocess.run(
                ["ping", "-c", "1", "-W", "1", pi_ip],
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL
            )
            pi_connected = (res.returncode == 0)
        except Exception:
            pass
    return {"backend": True, "pi": pi_connected}



# ── Status ────────────────────────────────────────────────────────────────────
@app.get("/api/status", response_model=SystemStatusResponse)
def get_system_status(session: Session = Depends(get_session)):
    modality_statuses: List[ModalityStatus] = []
    online_count = 0

    for mod in sorted(list(VALID_MODALITIES)):
        endpoint_url = get_endpoint_url(mod)
        is_configured = bool(endpoint_url)

        # Get latest sensor reading timestamp
        statement = (
            select(SensorReading)
            .where(SensorReading.modality == mod)
            .order_by(SensorReading.received_at.desc())
            .limit(1)
        )
        latest_reading = session.exec(statement).first()
        last_time = latest_reading.received_at if latest_reading else None

        if is_configured and last_time is not None:
            status_flag = "online"
            online_count += 1
        elif is_configured:
            status_flag = "no_data"
        else:
            status_flag = "unconfigured"

        modality_statuses.append(
            ModalityStatus(
                modality=mod,
                last_reading_at=last_time,
                endpoint_configured=is_configured,
                status=status_flag,
            )
        )

    total_models = len(VALID_MODALITIES)
    readiness_pct = (online_count / total_models) * 100.0

    return SystemStatusResponse(
        readiness_percentage=round(readiness_pct, 1),
        online_models=online_count,
        total_models=total_models,
        modalities=modality_statuses,
    )


# ── Sensor Ingestion ──────────────────────────────────────────────────────────
@app.post("/api/sensors/{modality}")
def push_sensor_reading(
    modality: str,
    payload: Dict[str, Any],
    session: Session = Depends(get_session),
):
    """
    Hardware/IoT edge nodes push raw sensor readings here.
    
    TODO per modality expected real payload shape:
    - rgb: {"image_base64": "...", "resolution": [1920, 1080], "camera_id": "cam_01"}
    - microscopic: {"image_base64": "...", "magnification": "500x"}
    - infrared: {"spectrum_wavelengths": [...], "reflectance_values": [...]}
    - acoustic: {"waveform_samples": [...], "sampling_rate_hz": 44100}
    - capacitive: {"dielectric_constant": 4.5, "permittivity": [...]}
    """
    modality_lower = modality.lower()
    if modality_lower not in VALID_MODALITIES:
        raise HTTPException(
            status_code=404,
            detail=f"Invalid modality '{modality}'. Must be one of: {', '.join(sorted(list(VALID_MODALITIES)))}"
        )

    reading = SensorReading(
        modality=modality_lower,
        payload=json.dumps(payload),
        received_at=datetime.utcnow(),
    )
    session.add(reading)
    session.commit()
    session.refresh(reading)

    return {
        "status": "ok",
        "id": reading.id,
        "modality": modality_lower,
        "received_at": reading.received_at.isoformat(),
    }


# ── Inference / Classification ────────────────────────────────────────────────
@app.get("/api/classify/full", response_model=CompositeResult)
async def run_full_classification(session: Session = Depends(get_session)):
    """
    Runs inference for all 5 modalities concurrently using httpx + asyncio.gather,
    picks the winner based on highest confidence, and returns CompositeResult.
    """
    modalities_list = sorted(list(VALID_MODALITIES))

    async def fetch_one(mod: str) -> Optional[ModalityResult]:
        statement = (
            select(SensorReading)
            .where(SensorReading.modality == mod)
            .order_by(SensorReading.received_at.desc())
            .limit(1)
        )
        latest_reading = session.exec(statement).first()
        if not latest_reading:
            return None

        try:
            payload = json.loads(latest_reading.payload)
            return await run_modality_inference(mod, payload)
        except Exception:
            return None

    results_raw = await asyncio.gather(*[fetch_one(m) for m in modalities_list])
    results: List[ModalityResult] = [r for r in results_raw if r is not None]

    if not results:
        raise HTTPException(
            status_code=404,
            detail="No sensor data or active endpoints available for any modality. Push sensor data to /api/sensors/{modality} first."
        )

    # Winner is the modality with highest confidence score
    winner_result = max(results, key=lambda r: r.confidence)

    # Store classification records
    for res in results:
        record = ClassificationRecord(
            modality=res.modality,
            predicted_class=res.predicted_class,
            confidence=res.confidence,
            full_result_json=res.model_dump_json(),
        )
        session.add(record)
    session.commit()

    return CompositeResult(winner=winner_result.modality, results=results)


@app.get("/api/classify/{modality}", response_model=ModalityResult)
async def classify_single_modality(
    modality: str,
    session: Session = Depends(get_session),
):
    modality_lower = modality.lower()
    if modality_lower not in VALID_MODALITIES:
        raise HTTPException(
            status_code=404,
            detail=f"Invalid modality '{modality}'. Must be one of: {', '.join(sorted(list(VALID_MODALITIES)))}"
        )

    statement = (
        select(SensorReading)
        .where(SensorReading.modality == modality_lower)
        .order_by(SensorReading.received_at.desc())
        .limit(1)
    )
    latest_reading = session.exec(statement).first()
    if not latest_reading:
        raise HTTPException(
            status_code=404,
            detail=f"No sensor data received for modality '{modality_lower}'. Push data to /api/sensors/{modality_lower} first."
        )

    payload = json.loads(latest_reading.payload)
    result = await run_modality_inference(modality_lower, payload)

    # Save classification record
    record = ClassificationRecord(
        modality=result.modality,
        predicted_class=result.predicted_class,
        confidence=result.confidence,
        full_result_json=result.model_dump_json(),
    )
    session.add(record)
    session.commit()

    return result


# ── History ───────────────────────────────────────────────────────────────────
@app.get("/api/history")
def get_all_history(
    limit: int = Query(20, ge=1, le=100),
    session: Session = Depends(get_session),
):
    statement = (
        select(ClassificationRecord)
        .order_by(ClassificationRecord.created_at.desc())
        .limit(limit)
    )
    records = session.exec(statement).all()
    return [
        {
            "id": r.id,
            "modality": r.modality,
            "predicted_class": r.predicted_class,
            "confidence": r.confidence,
            "created_at": r.created_at.isoformat(),
            "result": json.loads(r.full_result_json),
        }
        for r in records
    ]


@app.get("/api/history/{modality}")
def get_modality_history(
    modality: str,
    limit: int = Query(20, ge=1, le=100),
    session: Session = Depends(get_session),
):
    modality_lower = modality.lower()
    statement = (
        select(ClassificationRecord)
        .where(ClassificationRecord.modality == modality_lower)
        .order_by(ClassificationRecord.created_at.desc())
        .limit(limit)
    )
    records = session.exec(statement).all()
    return [
        {
            "id": r.id,
            "modality": r.modality,
            "predicted_class": r.predicted_class,
            "confidence": r.confidence,
            "created_at": r.created_at.isoformat(),
            "result": json.loads(r.full_result_json),
        }
        for r in records
    ]
