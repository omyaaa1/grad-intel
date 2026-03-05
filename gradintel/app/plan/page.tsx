"use client"

import { fetchMetadata } from "@/lib/api"
import { getStoredProfile, setStoredProfile } from "@/lib/profile"
import type { StudentProfile } from "@/lib/types"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function PlanPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<StudentProfile>(() => getStoredProfile())
  const [countries, setCountries] = useState<string[]>([])
  const [courses, setCourses] = useState<string[]>([])
  const [status, setStatus] = useState("")

  useEffect(() => {
    fetchMetadata()
      .then((meta) => {
        setCountries(meta.countries)
        setCourses(meta.courses)
      })
      .catch(() => {
        setStatus("Backend not reachable. You can still fill values manually.")
      })
  }, [])

  function update<K extends keyof StudentProfile>(key: K, value: StudentProfile[K]) {
    setProfile((prev) => ({ ...prev, [key]: value }))
  }

  function handleGenerate() {
    setStoredProfile(profile)
    router.push("/dashboard")
  }

  return (
    <main className="app-shell" style={{ padding: "24px" }}>
      <div style={{ maxWidth: "920px", margin: "0 auto", display: "grid", gap: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px" }}>
          <h1 style={{ margin: 0 }}>Student Profile Intake</h1>
          <Link href="/" className="btn-ghost">
            Home
          </Link>
        </div>
        <section className="card" style={{ padding: "20px" }}>
          <p style={{ marginTop: 0, color: "var(--muted)" }}>
            Fill this once. Dashboard, map, chat, and universities will all use this profile.
          </p>
          {status ? <p style={{ marginTop: 0, color: "#92400e", fontSize: "14px" }}>{status}</p> : null}
          <div style={{ display: "grid", gap: "12px", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))" }}>
            <div>
              <label className="field-label">Name</label>
              <input
                className="field-input"
                value={profile.name}
                onChange={(e) => update("name", e.target.value)}
              />
            </div>
            <div>
              <label className="field-label">Country</label>
              {countries.length > 0 ? (
                <select
                  className="field-select"
                  value={profile.country}
                  onChange={(e) => update("country", e.target.value)}
                >
                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  className="field-input"
                  value={profile.country}
                  onChange={(e) => update("country", e.target.value)}
                />
              )}
            </div>
            <div>
              <label className="field-label">Course</label>
              {courses.length > 0 ? (
                <select
                  className="field-select"
                  value={profile.course}
                  onChange={(e) => update("course", e.target.value)}
                >
                  {courses.map((course) => (
                    <option key={course} value={course}>
                      {course}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  className="field-input"
                  value={profile.course}
                  onChange={(e) => update("course", e.target.value)}
                />
              )}
            </div>
            <div>
              <label className="field-label">CGPA (0-10)</label>
              <input
                className="field-input"
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={profile.cgpa}
                onChange={(e) => update("cgpa", Number(e.target.value))}
              />
            </div>
            <div>
              <label className="field-label">IELTS (0-9)</label>
              <input
                className="field-input"
                type="number"
                step="0.1"
                min="0"
                max="9"
                value={profile.ielts}
                onChange={(e) => update("ielts", Number(e.target.value))}
              />
            </div>
            <div>
              <label className="field-label">Budget (USD)</label>
              <input
                className="field-input"
                type="number"
                min="0"
                value={profile.budget}
                onChange={(e) => update("budget", Number(e.target.value))}
              />
            </div>
          </div>
          <div style={{ marginTop: "14px", display: "flex", gap: "10px" }}>
            <button className="btn-primary" onClick={handleGenerate}>
              Generate My Plan
            </button>
            <Link href="/dashboard" className="btn-ghost">
              Open Dashboard
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
