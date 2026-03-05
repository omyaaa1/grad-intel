"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export default function AuthLoginPage() {
  const router = useRouter()
  const [userId, setUserId] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()

    if (!userId.trim() || !password.trim()) {
      setError("Enter user ID and password.")
      return
    }

    localStorage.setItem("gradintel.loggedIn", "true")
    router.push("/plan")
  }

  return (
    <main className="app-shell" style={{ display: "grid", placeItems: "center", padding: "24px" }}>
      <section className="card" style={{ width: "100%", maxWidth: "420px", padding: "24px" }}>
        <h1 style={{ marginTop: 0 }}>GradIntel Login</h1>
        <p style={{ marginTop: 0, color: "var(--muted)" }}>Use any credentials to continue locally.</p>
        <form onSubmit={handleLogin} style={{ display: "grid", gap: "12px" }}>
          <div>
            <label className="field-label">User ID</label>
            <input
              className="field-input"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="student123"
            />
          </div>
          <div>
            <label className="field-label">Password</label>
            <input
              className="field-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
            />
          </div>
          {error ? <p style={{ margin: 0, color: "#b91c1c", fontSize: "13px" }}>{error}</p> : null}
          <button type="submit" className="btn-primary">
            Continue
          </button>
        </form>
      </section>
    </main>
  )
}
