"use client"

import { fetchPrediction } from "@/lib/api"
import { getStoredProfile } from "@/lib/profile"
import type { MapPoint } from "@/lib/types"
import dynamic from "next/dynamic"
import Link from "next/link"
import { useEffect, useState } from "react"

const MapCanvas = dynamic(() => import("./MapCanvas"), { ssr: false })

export default function MapPage() {
  const [points, setPoints] = useState<MapPoint[]>([])
  const [status, setStatus] = useState("Loading map analysis...")

  useEffect(() => {
    fetchPrediction(getStoredProfile())
      .then((result) => {
        setPoints(result.mapData)
        setStatus("")
      })
      .catch(() => setStatus("Could not load map data. Check backend server on port 8000."))
  }, [])

  return (
    <main className="app-shell" style={{ padding: "24px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gap: "14px" }}>
        <header className="card" style={{ padding: "14px", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
          <h1 style={{ margin: 0, fontSize: "24px" }}>Global Opportunity Map</h1>
          <div style={{ display: "flex", gap: "8px" }}>
            <Link href="/dashboard" className="btn-ghost">Dashboard</Link>
            <Link href="/universities" className="btn-ghost">Universities</Link>
          </div>
        </header>
        <section className="card" style={{ padding: "14px" }}>
          {status ? <p>{status}</p> : <MapCanvas points={points} />}
        </section>
      </div>
    </main>
  )
}
