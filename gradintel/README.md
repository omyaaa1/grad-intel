# GradIntel

GradIntel is a simple full-stack study-abroad planner.

- `backend/` = FastAPI service reading `main_data.csv` directly
- `gradintel/` = Next.js frontend (dashboard, map, chat, universities)

## Run

1. Start backend (from repo root):

```bash
cd backend
uvicorn app:app --reload --port 8000
```

2. Start frontend (new terminal):

```bash
cd gradintel
npm install
npm run dev
```

Open `http://localhost:3000`.

## Notes

- Frontend calls backend at `http://127.0.0.1:8000` by default.
- Override API URL with `NEXT_PUBLIC_API_BASE`.
- Profile data is saved in browser local storage and reused across pages.
