import Image from "next/image"
import Link from "next/link"

export default function Home() {
  return (
    <main className="app-shell" style={{ padding: "28px" }}>
      <div
        style={{
          maxWidth: "1060px",
          margin: "0 auto",
          display: "grid",
          gap: "24px",
        }}
      >
        <header
          className="card"
          style={{
            padding: "18px 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Image src="/gradintel-logo.png" alt="GradIntel" width={34} height={34} />
            <strong style={{ fontSize: "18px" }}>GradIntel</strong>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <Link href="/auth-login" className="btn-ghost">
              Login
            </Link>
            <Link href="/plan" className="btn-primary">
              Start Plan
            </Link>
          </div>
        </header>

        <section
          className="card"
          style={{
            padding: "40px 28px",
            background: "#1f1f1f",
            color: "var(--text)",
          }}
        >
          <h1 style={{ fontSize: "42px", margin: 0, lineHeight: 1.1 }}>
            Study abroad planning that is simple, data-first, and fast.
          </h1>
          <p style={{ fontSize: "18px", maxWidth: "720px", marginTop: "14px", opacity: 0.95 }}>
            Build your profile once, then get ranked universities, readiness insights, and a global
            opportunity map generated from the full dataset.
          </p>
          <div style={{ marginTop: "24px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Link href="/plan" className="btn-primary">
              Build My Plan
            </Link>
            <Link href="/dashboard" className="btn-ghost">
              Open Dashboard
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
