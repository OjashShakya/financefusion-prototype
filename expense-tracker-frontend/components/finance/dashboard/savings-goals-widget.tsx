"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import type { SavingsGoal } from "@/components/finance-dashboard"

interface SavingsGoalsWidgetProps {
  goals: SavingsGoal[]
  updateSavingsGoal: (id: string, amount: number) => void
  setActiveView: (view: string) => void
}

export function SavingsGoalsWidget({ goals, updateSavingsGoal, setActiveView }: SavingsGoalsWidgetProps) {
  const [contributions, setContributions] = useState<Record<string, string>>({})
  const { toast } = useToast()

  const handleContribution = (goalId: string) => {
    const amount = contributions[goalId]
    if (!amount) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to contribute",
        variant: "destructive",
      })
      return
    }

    const goal = goals.find((g) => g.id === goalId)
    if (!goal) return

    const contributionAmount = Number.parseFloat(amount)
    if (isNaN(contributionAmount) || contributionAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid positive amount",
        variant: "destructive",
      })
      return
    }

    const newAmount = goal.currentAmount + contributionAmount
    if (newAmount > goal.targetAmount) {
      toast({
        title: "Amount Exceeds Goal",
        description: `Maximum contribution allowed is $${(goal.targetAmount - goal.currentAmount).toFixed(2)}`,
        variant: "destructive",
      })
      return
    }

    updateSavingsGoal(goalId, contributionAmount)

    // Clear input
    setContributions({
      ...contributions,
      [goalId]: "",
    })

    toast({
      title: "Contribution Added",
      description: `Added $${contributionAmount.toFixed(2)} to ${goal.name}`,
    })
  }

  if (goals.length === 0) {
    return (
      <div className="flex h-[200px] flex-col items-center justify-center rounded-md border border-dashed">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">No savings goals set up yet</p>
          <Button className="mt-2" variant="outline" onClick={() => setActiveView("savings")}>
            Create a Savings Goal
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {goals.map((goal) => {
        const percentage = (goal.currentAmount / goal.targetAmount) * 100
        const remaining = goal.targetAmount - goal.currentAmount
        const targetDate = format(goal.targetDate, "MMM d, yyyy")

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
            <Progress 
              value={percentage} 
              className="h-2" 
              style={{ 
                "--progress-background": `${goal.color}20`,
                "--progress-foreground": goal.color,
              } as React.CSSProperties}
            />
            <div className="flex items-center gap-2 pt-1">
              <Input
                type="number"
                placeholder="Amount"
                className="h-8"
                value={contributions[goal.id] || ""}
                onChange={(e) =>
                  setContributions({
                    ...contributions,
                    [goal.id]: e.target.value,
                  })
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleContribution(goal.id)
                  }
                }}
              />
              <Button 
                size="sm" 
                onClick={() => handleContribution(goal.id)}
                disabled={!contributions[goal.id] || Number(contributions[goal.id]) <= 0}
              >
                Add
              </Button>
            </div>
          </div>
        )
      })}

      <Button variant="outline" className="w-full" onClick={() => setActiveView("savings")}>
        View All Goals
      </Button>
    </div>
  )
}

