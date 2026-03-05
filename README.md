# GradIntel

GradIntel is a full-stack study-abroad planner.

- Frontend (Next.js): `gradintel/`
- Backend (FastAPI): `backend/`

## Live Links

- App: https://gradintel.vercel.app
- API: https://backend-five-chi-29.vercel.app

## Local Development

### 1) Run backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app:app --reload --port 8000
```

### 2) Run frontend

```bash
cd gradintel
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment Variable (Frontend)

Set this if you want to override API URL:

```bash
NEXT_PUBLIC_API_BASE=https://backend-five-chi-29.vercel.app
```

## Main Features

- Profile-based prediction and scoring
- University shortlist from full dataset
- AI chat using your saved profile
- Global map analysis by country


##Star this as 5 otherwise u gay.
