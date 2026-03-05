from __future__ import annotations

from collections import defaultdict
from csv import DictReader
from pathlib import Path
from statistics import mean
from typing import Any

DATA_FILE = Path(__file__).with_name("main_data.csv")

DEFAULT_STUDENT: dict[str, Any] = {
    "name": "Rahul Sharma",
    "cgpa": 8.2,
    "ielts": 6.5,
    "budget": 40000,
    "country": "USA",
    "course": "Computer Science",
}

NUMERIC_FIELDS = {
    "Latitude",
    "Longitude",
    "MinCGPA",
    "MinIELTS",
    "GRE",
    "TuitionUSD",
    "LivingCostUSD",
    "AvgSalaryUSD",
    "AcceptanceRate",
    "JobMarketScore",
    "ROI",
    "VisaDifficulty",
    "SelectionDifficulty",
}


def _to_number(value: str) -> float:
    try:
        return float(value)
    except (TypeError, ValueError):
        return 0.0


def _load_dataset() -> list[dict[str, Any]]:
    rows: list[dict[str, Any]] = []
    with DATA_FILE.open("r", encoding="utf-8-sig", newline="") as csv_file:
        reader = DictReader(csv_file)
        for row in reader:
            parsed = dict(row)
            for key in NUMERIC_FIELDS:
                parsed[key] = _to_number(row.get(key, "0"))
            rows.append(parsed)
    return rows


DATASET = _load_dataset()


def _clean_text(value: Any) -> str:
    return str(value or "").strip()


def _student_from_payload(payload: dict[str, Any] | None) -> dict[str, Any]:
    payload = payload or {}
    student = dict(DEFAULT_STUDENT)

    for key in ("name", "country", "course"):
        if _clean_text(payload.get(key)):
            student[key] = _clean_text(payload[key])

    for key in ("cgpa", "ielts", "budget"):
        if payload.get(key) not in (None, ""):
            student[key] = _to_number(payload[key])

    return student


def _profile_match(row: dict[str, Any], student: dict[str, Any]) -> bool:
    country_ok = row["Country"].lower() == student["country"].lower()
    course_ok = row["Course"].lower() == student["course"].lower()
    return country_ok and course_ok


def _score_university(row: dict[str, Any], student: dict[str, Any]) -> int:
    cgpa_ratio = min(student["cgpa"] / max(row["MinCGPA"], 0.1), 1.3)
    ielts_ratio = min(student["ielts"] / max(row["MinIELTS"], 0.1), 1.3)
    total_cost = row["TuitionUSD"] + row["LivingCostUSD"]
    budget_ratio = min(student["budget"] / max(total_cost, 1.0), 1.3)
    acceptance_ratio = row["AcceptanceRate"] / 100.0

    weighted = (
        (cgpa_ratio / 1.3) * 35
        + (ielts_ratio / 1.3) * 25
        + (budget_ratio / 1.3) * 20
        + acceptance_ratio * 20
    )
    return int(round(max(0.0, min(weighted, 100.0))))


def _serialize_row(row: dict[str, Any], score: int) -> dict[str, Any]:
    total_cost = row["TuitionUSD"] + row["LivingCostUSD"]
    return {
        "tier": row["Tier"],
        "country": row["Country"],
        "city": row["City"],
        "university": row["University"],
        "course": row["Course"],
        "score": score,
        "minCgpa": row["MinCGPA"],
        "minIelts": row["MinIELTS"],
        "gre": row["GRE"],
        "tuitionUsd": row["TuitionUSD"],
        "livingCostUsd": row["LivingCostUSD"],
        "totalCostUsd": total_cost,
        "avgSalaryUsd": row["AvgSalaryUSD"],
        "acceptanceRate": row["AcceptanceRate"],
        "jobMarketScore": row["JobMarketScore"],
        "roi": row["ROI"],
        "visaDifficulty": row["VisaDifficulty"],
        "latitude": row["Latitude"],
        "longitude": row["Longitude"],
    }


def _roi_label(avg_roi: float) -> str:
    if avg_roi >= 1.3:
        return "High"
    if avg_roi >= 1.0:
        return "Medium"
    return "Low"


def _visa_label(avg_visa_difficulty: float) -> str:
    if avg_visa_difficulty <= 3:
        return "Low"
    if avg_visa_difficulty <= 6:
        return "Medium"
    return "High"


def _recommended_actions(student: dict[str, Any], ranked: list[dict[str, Any]]) -> list[str]:
    actions: list[str] = []
    top = ranked[:10]
    if not top:
        return [
            "No exact matches found for this country and course.",
            "Try a neighboring country or a related course specialization.",
        ]

    avg_min_ielts = mean(item["minIelts"] for item in top)
    avg_min_cgpa = mean(item["minCgpa"] for item in top)
    avg_cost = mean(item["totalCostUsd"] for item in top)

    if student["ielts"] < avg_min_ielts:
        actions.append(f"Raise IELTS by about {round(avg_min_ielts - student['ielts'], 1)} band.")
    if student["cgpa"] < avg_min_cgpa:
        actions.append(f"Improve CGPA profile by about {round(avg_min_cgpa - student['cgpa'], 1)} points.")
    if student["budget"] < avg_cost:
        actions.append("Shortlist scholarships and assistantships to close budget gap.")
    if not actions:
        actions.append("Your profile is competitive for the shortlisted programs.")
    actions.append("Apply to a balanced mix of safe, target, and ambitious universities.")
    return actions


def _map_data(student: dict[str, Any]) -> list[dict[str, Any]]:
    by_country: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for row in DATASET:
        if row["Course"].lower() == student["course"].lower():
            by_country[row["Country"]].append(row)

    if not by_country:
        for row in DATASET:
            by_country[row["Country"]].append(row)

    points: list[dict[str, Any]] = []
    for country, rows in by_country.items():
        scores = [_score_university(row, student) for row in rows]
        points.append(
            {
                "country": country,
                "lat": round(mean(row["Latitude"] for row in rows), 4),
                "lng": round(mean(row["Longitude"] for row in rows), 4),
                "avgScore": int(round(mean(scores))),
                "acceptanceRate": round(mean(row["AcceptanceRate"] for row in rows), 1),
            }
        )
    points.sort(key=lambda item: item["avgScore"], reverse=True)
    return points


def _ranked_matches(student: dict[str, Any]) -> list[dict[str, Any]]:
    matched_rows = [row for row in DATASET if _profile_match(row, student)]
    ranked = [_serialize_row(row, _score_university(row, student)) for row in matched_rows]
    ranked.sort(key=lambda item: (item["score"], item["acceptanceRate"]), reverse=True)
    return ranked


def build_prediction(payload: dict[str, Any] | None = None) -> dict[str, Any]:
    student = _student_from_payload(payload)
    ranked = _ranked_matches(student)
    top = ranked[:12]

    admission_chance = int(round(mean(item["score"] for item in top))) if top else 0
    avg_roi = mean(item["roi"] for item in top) if top else 0.0
    avg_visa = mean(item["visaDifficulty"] for item in top) if top else 6.0

    return {
        "student": student,
        "suggestions": _recommended_actions(student, ranked),
        "universities": top,
        "allMatches": ranked,
        "insights": {
            "admissionChance": f"{admission_chance}%",
            "roi": _roi_label(avg_roi),
            "visaDifficulty": _visa_label(avg_visa),
        },
        "mapData": _map_data(student),
        "totalMatches": len(ranked),
    }


def list_universities(
    payload: dict[str, Any] | None = None,
    search: str = "",
    min_score: int = 0,
    limit: int = 200,
) -> dict[str, Any]:
    result = build_prediction(payload)
    universities = result["allMatches"]

    search_text = _clean_text(search).lower()
    if search_text:
        universities = [
            row
            for row in universities
            if search_text in row["university"].lower()
            or search_text in row["city"].lower()
        ]

    universities = [row for row in universities if row["score"] >= min_score]
    universities = universities[: max(1, min(limit, 1000))]

    return {
        "student": result["student"],
        "count": len(universities),
        "universities": universities,
    }


def get_metadata() -> dict[str, list[str]]:
    countries = sorted({row["Country"] for row in DATASET})
    courses = sorted({row["Course"] for row in DATASET})
    return {"countries": countries, "courses": courses}


def generate_chat_reply(message: str, payload: dict[str, Any] | None = None) -> str:
    text = _clean_text(message).lower()
    student = _student_from_payload(payload)
    result = build_prediction(student)
    top = result["universities"][:3]
    top_names = ", ".join(item["university"] for item in top) if top else "no direct matches yet"

    if "ielts" in text:
        return f"Your current IELTS is {student['ielts']}. Most top matches need around {round(mean(item['minIelts'] for item in top), 1) if top else 7.0}."
    if "country" in text:
        best = result["mapData"][0]["country"] if result["mapData"] else student["country"]
        return f"Best country by your profile score is {best}. Current target country is {student['country']}."
    if "visa" in text:
        return f"Visa difficulty trend for your shortlist is {result['insights']['visaDifficulty']}."
    if "roi" in text:
        return f"ROI outlook for your shortlist is {result['insights']['roi']}."
    if "university" in text or "college" in text:
        return f"Top options for you: {top_names}."

    return (
        "Ask me about IELTS, country, visa, ROI, or university suggestions. "
        f"Based on your profile, leading options are {top_names}."
    )
