"use client"

import { FinanceDashboard } from "@/components/finance-dashboard"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function Home() {
  return (
    <ProtectedRoute>
      <main>
        <FinanceDashboard />
      </main>
    </ProtectedRoute>
  )
}

