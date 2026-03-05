"use client"

import { fetchUniversities } from "@/lib/api"
import { getStoredProfile } from "@/lib/profile"
import type { University } from "@/lib/types"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"

export default function UniversitiesPage() {
  const [rows, setRows] = useState<University[]>([])
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState("Loading universities...")

  useEffect(() => {
    fetchUniversities(getStoredProfile())
      .then((res) => {
        setRows(res.universities)
        setStatus("")
      })
      .catch(() => setStatus("Could not load universities. Check backend server on port 8000."))
  }, [])

  const filtered = useMemo(() => {
    const text = query.trim().toLowerCase()
    if (!text) {
      return rows
    }
    return rows.filter(
      (row) => row.university.toLowerCase().includes(text) || row.city.toLowerCase().includes(text)
    )
  }, [rows, query])

  return (
    <main className="app-shell" style={{ padding: "24px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gap: "14px" }}>
        <header className="card" style={{ padding: "14px", display: "flex", justifyContent: "space-between", gap: "8px", flexWrap: "wrap" }}>
          <h1 style={{ margin: 0, fontSize: "24px" }}>University Matches</h1>
          <div style={{ display: "flex", gap: "8px" }}>
            <Link href="/dashboard" className="btn-ghost">Dashboard</Link>
            <Link href="/plan" className="btn-ghost">Edit Profile</Link>
          </div>
        </header>

        <section className="card" style={{ padding: "14px" }}>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
            <input
              className="field-input"
              style={{ maxWidth: "340px" }}
              placeholder="Search university or city"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <span style={{ color: "var(--muted)", fontSize: "14px" }}>{filtered.length} results</span>
          </div>
          {status ? <p>{status}</p> : null}
          {!status ? (
            <div className="table-wrap" style={{ marginTop: "12px" }}>
              <table>
                <thead>
                  <tr>
                    <th>University</th>
                    <th>City</th>
                    <th>Score</th>
                    <th>Total Cost</th>
                    <th>Acceptance</th>
                    <th>ROI</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u) => (
                    <tr key={`${u.university}-${u.city}`}>
                      <td>{u.university}</td>
                      <td>{u.city}</td>
                      <td>{u.score}%</td>
                      <td>${Math.round(u.totalCostUsd).toLocaleString()}</td>
                      <td>{u.acceptanceRate.toFixed(1)}%</td>
                      <td>{u.roi.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </section>
      </div>
    </main>
  )
}
