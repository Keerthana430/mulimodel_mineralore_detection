# OreVision Backend API

FastAPI backend service for OreVision multimodal mineral ore classification. Orchestrates hardware/IoT sensor data ingestion, Hugging Face model inference calls, SQLite data persistence, and status aggregation for the Next.js frontend.

---

## 🚀 Setup & Execution

The Render deployment uses `backend/` as its root directory and starts with:

```bash
uvicorn main:app --host 0.0.0.0 --port $PORT
```

### 1. Create Virtual Environment
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux / macOS
python3 -m venv venv
source venv/bin/activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Environment Variables
Copy `.env.example` to `.env` and fill in your deployed Hugging Face space/inference endpoint URLs and API token:
```bash
cp .env.example .env
```

For production, set `ALLOWED_ORIGINS` to the Vercel frontend URL and use a managed PostgreSQL `DATABASE_URL`. SQLite data on Render is lost when the service is redeployed.

### 4. Run Development Server
```bash
uvicorn main:app --reload --port 8000
```
The API will be available at `http://localhost:8000`. Interactive OpenAPI documentation is at `http://localhost:8000/docs`.

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health check |
| `GET` | `/api/status` | System readiness & per-modality online status |
| `POST` | `/api/sensors/{modality}` | Ingest raw hardware/IoT sensor reading (`rgb`, `microscopic`, `infrared`, `acoustic`, `capacitive`) |
| `GET` | `/api/classify/{modality}` | Run inference for a single modality on latest sensor reading |
| `GET` | `/api/classify/full` | Run concurrent inference across all 5 modalities & surface winning prediction |
| `GET` | `/api/history` | Classification record history across all modalities |
| `GET` | `/api/history/{modality}` | Classification record history for specific modality |

---

## 💻 Example cURL Commands

### 1. Push Sensor Reading (Hardware / IoT Edge Node)
```bash
curl -X POST "http://localhost:8000/api/sensors/rgb" \
     -H "Content-Type: application/json" \
     -d '{"sample_id": "ore_102", "image_url": "https://example.com/sample.jpg"}'
```

### 2. Run Single Modality Classification
```bash
curl -X GET "http://localhost:8000/api/classify/rgb"
```

### 3. Run Full Fused Multimodal Classification
```bash
curl -X GET "http://localhost:8000/api/classify/full"
```

### 4. Check System Readiness
```bash
curl -X GET "http://localhost:8000/api/status"
```
