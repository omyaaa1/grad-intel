import "./globals.css"

export const metadata = {
  title: "GradIntel",
  description: "AI Career & Study Abroad Planner",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
