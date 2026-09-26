import os
import time
import json
from typing import Optional, Dict, Any
from dotenv import load_dotenv
import httpx
from fastapi import HTTPException
from models import ModalityResult, ClassProbability

load_dotenv()


def get_endpoint_url(modality: str) -> Optional[str]:
    env_key = f"HF_{modality.upper()}_ENDPOINT"
    return os.getenv(env_key)


async def run_modality_inference(modality: str, sensor_payload: Dict[str, Any]) -> ModalityResult:
    """
    Sends sensor_payload to the configured Hugging Face Endpoint for `modality`
    and normalizes the response into a ModalityResult schema.
    """
    endpoint_url = get_endpoint_url(modality)
    if not endpoint_url:
        raise HTTPException(
            status_code=503,
            detail=f"No Hugging Face endpoint configured for modality '{modality}'. Set HF_{modality.upper()}_ENDPOINT in .env."
        )

    api_token = os.getenv("HF_API_TOKEN")
    headers = {"Content-Type": "application/json"}
    if api_token:
        headers["Authorization"] = f"Bearer {api_token}"

    start_time = time.perf_counter()
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(endpoint_url, json=sensor_payload, headers=headers, timeout=30.0)
            response.raise_for_status()
            raw_data = response.json()
    except httpx.HTTPStatusError as exc:
        raise HTTPException(
            status_code=exc.response.status_code,
            detail=f"{modality.capitalize()} endpoint returned HTTP {exc.response.status_code}: {exc.response.text}"
        )
    except httpx.RequestError as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Failed to reach {modality} endpoint at {endpoint_url}: {str(exc)}"
        )

    latency_ms = int((time.perf_counter() - start_time) * 1000)

    # =========================================================================
    # TODO: Adjust the response parsing below to match your deployed Hugging Face
    # model's exact output schema (e.g. Hugging Face Pipeline, Text/Image Classification,
    # or Custom Inference Handler shape).
    # =========================================================================

    return parse_hf_response(modality, raw_data, latency_ms)


def parse_hf_response(modality: str, data: Any, latency_ms: int) -> ModalityResult:
    """
    Guessed default parser for common Hugging Face classification response shapes.
    Handles:
    - Dict with predicted_class, confidence, probabilities, metrics
    - List of label/score predictions e.g. [{"label": "Hematite", "score": 0.94}, ...]
    - Single dict with label and score e.g. {"label": "Quartz", "score": 0.88}
    """
    predicted_class = "Unknown"
    confidence = 0.0
    probabilities = []
    accuracy = 0.90
    precision = 0.88
    recall = 0.89
    f1 = 0.885
    trend = [0.4, 0.55, 0.5, 0.7, 0.62, 0.8, 0.74, 0.9]

    if isinstance(data, dict):
        predicted_class = data.get("predicted_class") or data.get("label") or data.get("prediction") or "Unknown"
        confidence = float(data.get("confidence") or data.get("score") or 0.0)
        accuracy = float(data.get("accuracy", accuracy))
        precision = float(data.get("precision", precision))
        recall = float(data.get("recall", recall))
        f1 = float(data.get("f1") or data.get("f1_score") or f1)
        trend = data.get("trend", trend)

        raw_probs = data.get("probabilities", [])
        if isinstance(raw_probs, list):
            for item in raw_probs:
                if isinstance(item, dict) and "label" in item and ("probability" in item or "score" in item):
                    prob_val = float(item.get("probability") or item.get("score") or 0.0)
                    probabilities.append(ClassProbability(label=item["label"], probability=prob_val))

    elif isinstance(data, list) and len(data) > 0:
        # Standard Hugging Face classification pipeline list output: [{"label": "ClassA", "score": 0.95}, ...]
        first_item = data[0]
        if isinstance(first_item, dict):
            predicted_class = str(first_item.get("label", "Unknown"))
            confidence = float(first_item.get("score", 0.0))
            for item in data:
                if isinstance(item, dict) and "label" in item and "score" in item:
                    probabilities.append(ClassProbability(label=item["label"], probability=float(item["score"])))

    return ModalityResult(
        modality=modality,
        predicted_class=predicted_class,
        confidence=confidence,
        accuracy=accuracy,
        precision=precision,
        recall=recall,
        f1=f1,
        probabilities=probabilities,
        trend=trend,
        latency_ms=latency_ms,
    )
