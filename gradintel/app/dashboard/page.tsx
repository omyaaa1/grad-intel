"use client"

import { fetchPrediction } from "@/lib/api"
import { getStoredProfile } from "@/lib/profile"
import type { Prediction } from "@/lib/types"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function DashboardPage() {
  const [data, setData] = useState<Prediction | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    const profile = getStoredProfile()
    fetchPrediction(profile)
      .then(setData)
      .catch(() => setError("Could not load prediction. Start backend on port 8000."))
  }, [])

  if (error) {
    return (
      <main className="app-shell" style={{ padding: "24px" }}>
        <p>{error}</p>
      </main>
    )
  }

  if (!data) {
    return (
      <main className="app-shell" style={{ padding: "24px" }}>
        <p>Loading dashboard...</p>
      </main>
    )
  }

  return (
    <main className="app-shell" style={{ padding: "24px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gap: "14px" }}>
        <header className="card" style={{ padding: "14px", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
          <strong>GradIntel Dashboard</strong>
          <nav style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <Link href="/plan" className="btn-ghost">Profile</Link>
            <Link href="/universities" className="btn-ghost">Universities</Link>
            <Link href="/map" className="btn-ghost">Map</Link>
            <Link href="/chat" className="btn-primary">AI Chat</Link>
          </nav>
        </header>

        <section style={{ display: "grid", gap: "12px", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))" }}>
          <article className="card" style={{ padding: "14px" }}>
            <h3 style={{ marginTop: 0 }}>Student</h3>
            <p style={{ margin: "4px 0" }}>{data.student.name}</p>
            <p style={{ margin: "4px 0" }}>{data.student.country} - {data.student.course}</p>
            <p style={{ margin: "4px 0" }}>CGPA {data.student.cgpa} | IELTS {data.student.ielts}</p>
            <p style={{ margin: "4px 0" }}>Budget ${data.student.budget.toLocaleString()}</p>
          </article>
          <article className="card" style={{ padding: "14px" }}>
            <h3 style={{ marginTop: 0 }}>Insights</h3>
            <p style={{ margin: "4px 0" }}>Admission chance: {data.insights.admissionChance}</p>
            <p style={{ margin: "4px 0" }}>ROI: {data.insights.roi}</p>
            <p style={{ margin: "4px 0" }}>Visa difficulty: {data.insights.visaDifficulty}</p>
            <p style={{ margin: "4px 0" }}>Matching records: {data.totalMatches}</p>
          </article>
          <article className="card" style={{ padding: "14px" }}>
            <h3 style={{ marginTop: 0 }}>Recommended Actions</h3>
            {data.suggestions.map((item) => (
              <p key={item} style={{ margin: "6px 0" }}>{item}</p>
            ))}
          </article>
        </section>

        <section className="card" style={{ padding: "14px" }}>
          <h3 style={{ marginTop: 0 }}>Top Universities</h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>University</th>
                  <th>City</th>
                  <th>Score</th>
                  <th>Total Cost</th>
                  <th>ROI</th>
                </tr>
              </thead>
              <tbody>
                {data.universities.map((u) => (
                  <tr key={u.university}>
                    <td>{u.university}</td>
                    <td>{u.city}</td>
                    <td>{u.score}%</td>
                    <td>${Math.round(u.totalCostUsd).toLocaleString()}</td>
                    <td>{u.roi.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  )
}
