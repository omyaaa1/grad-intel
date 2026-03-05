"use client"

import type { MapPoint } from "@/lib/types"
import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet"
import "leaflet/dist/leaflet.css"

function getColor(score: number): string {
  if (score >= 75) return "#16a34a"
  if (score >= 60) return "#ca8a04"
  return "#dc2626"
}

export default function MapCanvas({ points }: { points: MapPoint[] }) {
  return (
    <MapContainer center={[20, 0]} zoom={2} style={{ height: "68vh", width: "100%", borderRadius: "12px" }}>
      <TileLayer attribution="Map data OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {points.map((point) => (
        <CircleMarker
          key={point.country}
          center={[point.lat, point.lng]}
          radius={10 + point.avgScore / 12}
          pathOptions={{
            color: getColor(point.avgScore),
            fillColor: getColor(point.avgScore),
            fillOpacity: 0.45,
            weight: 2,
          }}
        >
          <Popup>
            <strong>{point.country}</strong>
            <br />
            Profile score: {point.avgScore}%
            <br />
            Acceptance: {point.acceptanceRate}%
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  )
}
