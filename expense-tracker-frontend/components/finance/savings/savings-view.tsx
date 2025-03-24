"use client"

import { SavingsGoals } from "./savings-goals"
import type { SavingsGoal } from "@/components/finance-dashboard"

interface SavingsViewProps {
  goals: SavingsGoal[]
  onAdd: (goal: Omit<SavingsGoal, "id">) => void
  onUpdate: (id: string, amount: number) => void
  onDelete: (id: string) => void
}

export function SavingsView({ goals, onAdd, onUpdate, onDelete }: SavingsViewProps) {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Savings Goals</h1>
        <p className="text-muted-foreground">Set and track your savings goals</p>
      </div>

      <SavingsGoals goals={goals} onAdd={onAdd} onUpdate={onUpdate} onDelete={onDelete} />
    </div>
  )
}

