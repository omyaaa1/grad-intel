"use client"

import { sendChatMessage } from "@/lib/api"
import { getStoredProfile } from "@/lib/profile"
import Link from "next/link"
import { useState } from "react"

type ChatItem = { from: "ai" | "user"; text: string }

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatItem[]>([
    {
      from: "ai",
      text: "Ask about IELTS, ROI, visa, country, or universities. I will use your saved profile.",
    },
  ])
  const [input, setInput] = useState("")
  const [busy, setBusy] = useState(false)

  async function sendMessage() {
    const text = input.trim()
    if (!text || busy) return

    setInput("")
    setBusy(true)
    setMessages((prev) => [...prev, { from: "user", text }])

    try {
      const result = await sendChatMessage(text, getStoredProfile())
      setMessages((prev) => [...prev, { from: "ai", text: result.reply }])
    } catch {
      setMessages((prev) => [...prev, { from: "ai", text: "Backend is not reachable right now." }])
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="app-shell" style={{ padding: "24px" }}>
      <div style={{ maxWidth: "960px", margin: "0 auto", display: "grid", gap: "14px" }}>
        <header className="card" style={{ padding: "14px", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
          <h1 style={{ margin: 0, fontSize: "24px" }}>GradIntel AI Chat</h1>
          <Link href="/dashboard" className="btn-ghost">Back to Dashboard</Link>
        </header>
        <section className="card" style={{ padding: "14px" }}>
          <div style={{ minHeight: "50vh", maxHeight: "55vh", overflowY: "auto", padding: "4px" }}>
            {messages.map((message, index) => (
              <div key={index} style={{ textAlign: message.from === "user" ? "right" : "left", marginBottom: "10px" }}>
                <span
                  style={{
                    display: "inline-block",
                    maxWidth: "82%",
                    padding: "10px 12px",
                    borderRadius: "10px",
                    background: message.from === "user" ? "#ff0000" : "#2a2a2a",
                    color: "white",
                  }}
                >
                  {message.text}
                </span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <input
              className="field-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage()
                }
              }}
            />
            <button className="btn-primary" onClick={sendMessage} disabled={busy}>
              {busy ? "Sending..." : "Send"}
            </button>
          </div>
        </section>
      </div>
    </main>
  )
}
