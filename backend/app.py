from __future__ import annotations

from fastapi import Body, FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

try:
    from .ml_engine import build_prediction, generate_chat_reply, get_metadata, list_universities
except ImportError:
    from ml_engine import build_prediction, generate_chat_reply, get_metadata, list_universities

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class StudentProfile(BaseModel):
    name: str | None = None
    cgpa: float | None = Field(default=None, ge=0, le=10)
    ielts: float | None = Field(default=None, ge=0, le=9)
    budget: float | None = Field(default=None, ge=0)
    country: str | None = None
    course: str | None = None


class ChatRequest(BaseModel):
    message: str
    student: StudentProfile | None = None


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/metadata")
def metadata() -> dict[str, list[str]]:
    return get_metadata()


@app.post("/predict")
def predict(student: StudentProfile | None = Body(default=None)) -> dict:
    payload = student.model_dump(exclude_none=True) if student else None
    return build_prediction(payload)


@app.get("/universities")
def universities(
    search: str = Query(default=""),
    min_score: int = Query(default=0, ge=0, le=100),
    limit: int = Query(default=200, ge=1, le=1000),
    name: str | None = None,
    cgpa: float | None = Query(default=None, ge=0, le=10),
    ielts: float | None = Query(default=None, ge=0, le=9),
    budget: float | None = Query(default=None, ge=0),
    country: str | None = None,
    course: str | None = None,
) -> dict:
    payload = {
        "name": name,
        "cgpa": cgpa,
        "ielts": ielts,
        "budget": budget,
        "country": country,
        "course": course,
    }
    payload = {key: value for key, value in payload.items() if value is not None}
    return list_universities(payload=payload, search=search, min_score=min_score, limit=limit)


@app.post("/chat")
def chat_ai(req: ChatRequest) -> dict[str, str]:
    student_payload = req.student.model_dump(exclude_none=True) if req.student else None
    return {"reply": generate_chat_reply(req.message, student_payload)}
