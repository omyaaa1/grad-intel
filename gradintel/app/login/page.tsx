import Link from "next/link"

export default function LoginPage() {
  return (
    <main className="app-shell" style={{ padding: "24px" }}>
      <div style={{ maxWidth: "960px", margin: "0 auto", display: "grid", gap: "16px" }}>
        <h1 style={{ marginBottom: 0 }}>Access Portal</h1>
        <p style={{ marginTop: 0, color: "var(--muted)" }}>Choose where you want to start.</p>
        <section style={{ display: "grid", gap: "14px", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))" }}>
          <article className="card" style={{ padding: "18px" }}>
            <h2 style={{ marginTop: 0, fontSize: "20px" }}>Student Console</h2>
            <p style={{ color: "var(--muted)" }}>Fill profile and generate your university plan.</p>
            <Link className="btn-primary" href="/plan" style={{ display: "inline-block" }}>
              Enter Student
            </Link>
          </article>
          <article className="card" style={{ padding: "18px" }}>
            <h2 style={{ marginTop: 0, fontSize: "20px" }}>Dashboard</h2>
            <p style={{ color: "var(--muted)" }}>Jump directly to latest insights.</p>
            <Link className="btn-ghost" href="/dashboard" style={{ display: "inline-block" }}>
              Open Dashboard
            </Link>
          </article>
        </section>
      </div>
    </main>
  )
}
