# OreVision

Multimodal mineral ore classification with a Next.js dashboard and FastAPI inference service.

## Repository layout

- `frontend/` - Next.js 14 App Router application deployed to Vercel.
- `backend/` - FastAPI service, database layer, and Hugging Face orchestration deployed to Render.
- `backend/render.yaml` - Render Blueprint for the backend service.

## Local development

Run each service from its own directory:

### Backend
```
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

The dashboard runs at `http://localhost:3000` and calls the backend at `http://localhost:8000`.

## Deployment

### Vercel

Create a Vercel project from this repository and set **Root Directory** to `frontend`. Add:

```text
NEXT_PUBLIC_BACKEND_URL=https://<your-render-service>.onrender.com
```

Vercel detects the existing Next.js build and start settings automatically.

### Render

Use `backend/render.yaml` as the Render Blueprint, or create a Python web service with:

```text
Root Directory: backend
Build Command: pip install -r requirements.txt
Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
Health Check Path: /api/health
```

Set `ALLOWED_ORIGINS` to the exact Vercel URL and configure the Hugging Face endpoint variables listed in `backend/.env.example`. Set `DATABASE_URL` to a managed PostgreSQL connection string for production; Render's local filesystem is ephemeral, so the default SQLite database is for development only.
  cards and results page.

