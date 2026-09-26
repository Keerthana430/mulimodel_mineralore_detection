from datetime import datetime
from typing import Optional, List, Any
from pydantic import BaseModel
from sqlmodel import SQLModel, Field


# ── Pydantic Schemas (mirroring frontend shapes) ──────────────────────────────

class ClassProbability(BaseModel):
    label: str
    probability: float


class ModalityResult(BaseModel):
    modality: str
    predicted_class: str
    confidence: float
    accuracy: float
    precision: float
    recall: float
    f1: float
    probabilities: List[ClassProbability] = []
    trend: List[float] = []
    latency_ms: int


class CompositeResult(BaseModel):
    winner: str
    results: List[ModalityResult]


class ModalityStatus(BaseModel):
    modality: str
    last_reading_at: Optional[datetime] = None
    endpoint_configured: bool
    status: str  # "online" | "no_data" | "unconfigured"


class SystemStatusResponse(BaseModel):
    readiness_percentage: float
    online_models: int
    total_models: int
    modalities: List[ModalityStatus]


# ── SQLModel Tables ───────────────────────────────────────────────────────────

class SensorReading(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    modality: str = Field(index=True)
    payload: str  # JSON-encoded raw hardware reading
    received_at: datetime = Field(default_factory=datetime.utcnow)


class ClassificationRecord(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    modality: str = Field(index=True)
    predicted_class: str
    confidence: float
    full_result_json: str  # JSON-encoded ModalityResult
    created_at: datetime = Field(default_factory=datetime.utcnow)
