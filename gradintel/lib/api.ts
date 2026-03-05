import type { Prediction, StudentProfile, University } from "@/lib/types"

const API_BASE =
  (process.env.NEXT_PUBLIC_API_BASE || "https://backend-five-chi-29.vercel.app").trim()

type MetadataResponse = {
  countries: string[]
  courses: string[]
}

type UniversitiesResponse = {
  student: StudentProfile
  count: number
  universities: University[]
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, init)
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`)
  }
  return (await res.json()) as T
}

export function fetchMetadata(): Promise<MetadataResponse> {
  return apiFetch<MetadataResponse>("/metadata")
}

export function fetchPrediction(profile: StudentProfile): Promise<Prediction> {
  return apiFetch<Prediction>("/predict", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profile),
  })
}

export function fetchUniversities(profile: StudentProfile): Promise<UniversitiesResponse> {
  const params = new URLSearchParams({
    name: profile.name,
    country: profile.country,
    course: profile.course,
    cgpa: String(profile.cgpa),
    ielts: String(profile.ielts),
    budget: String(profile.budget),
    limit: "1000",
  })
  return apiFetch<UniversitiesResponse>(`/universities?${params.toString()}`)
}

export function sendChatMessage(message: string, student: StudentProfile): Promise<{ reply: string }> {
  return apiFetch<{ reply: string }>("/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, student }),
  })
}
