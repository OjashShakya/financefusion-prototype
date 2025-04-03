"use client"

import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import type { SavingsGoal } from "@/types/finance"

interface SavingsGoalsListProps {
  goals: SavingsGoal[]
}

export function SavingsGoalsList({ goals }: SavingsGoalsListProps) {
  if (goals.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-sm text-muted-foreground">No savings goals set up yet</p>
        <Button 
          variant="outline" 
          className="mt-2" 
          onClick={() => window.location.href = "/savings"}
        >
          Create Savings Goal
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {goals.map((goal) => {
        const percentage = (goal.currentAmount / goal.targetAmount) * 100
        const remaining = goal.targetAmount - goal.currentAmount
        const targetDate = format(new Date(goal.deadline), "MMM d, yyyy")

        return (
          <div key={goal.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">{goal.name}</h4>
                <p className="text-xs text-muted-foreground">
                  Target: ${goal.targetAmount.toFixed(2)} by {targetDate}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">${goal.currentAmount.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">${remaining.toFixed(2)} remaining</p>
              </div>
            </div>
            <Progress value={percentage} className="h-2" />
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="Amount"
                className="h-8"
                onChange={(e) => {
                  const input = e.target as HTMLInputElement
                  const amount = parseFloat(input.value)
                  if (!isNaN(amount) && amount > 0) {
                    // TODO: Implement updateSavingsGoal function
                    input.value = ""
                  }
                }}
              />
              <Button
                size="sm"
                onClick={() => {
                  const input = document.querySelector(`input[placeholder="Amount"]`) as HTMLInputElement
                  if (input) {
                    const amount = parseFloat(input.value)
                    if (!isNaN(amount) && amount > 0) {
                      // TODO: Implement updateSavingsGoal function
                      input.value = ""
                    }
                  }
                }}
              >
                Add
              </Button>
            </div>
          </div>
        )
      })}
    </div>
  )
} 