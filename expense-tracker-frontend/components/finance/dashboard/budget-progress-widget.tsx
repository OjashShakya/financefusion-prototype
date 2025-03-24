"use client"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import type { Budget } from "@/components/finance-dashboard"

interface BudgetProgressWidgetProps {
  budgets: Budget[]
  setActiveView: (view: string) => void
}

export function BudgetProgressWidget({ budgets, setActiveView }: BudgetProgressWidgetProps) {
  // Sort budgets by percentage spent
  const sortedBudgets = [...budgets]
    .map((budget) => ({
      ...budget,
      percentage: (budget.spent / budget.amount) * 100,
    }))
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 3)

  if (budgets.length === 0) {
    return (
      <div className="flex h-[200px] flex-col items-center justify-center rounded-md border border-dashed">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">No budgets set up yet</p>
          <Button className="mt-2" variant="outline" onClick={() => setActiveView("budgeting")}>
            Create a Budget
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {sortedBudgets.map((budget) => {
        const percentage = (budget.spent / budget.amount) * 100
        const remaining = budget.amount - budget.spent

        return (
          <div key={budget.id} className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-medium">{budget.category}</span>
                <span className="text-xs text-muted-foreground">
                  ${budget.spent.toFixed(2)} of ${budget.amount.toFixed(2)}
                </span>
              </div>
              <span
                className={`text-xs font-medium ${
                  percentage > 90 ? "text-destructive" : percentage > 75 ? "text-amber-500" : "text-green-500"
                }`}
              >
                {percentage.toFixed(0)}%
              </span>
            </div>
            <Progress
              value={percentage}
              className={`h-2 ${
                percentage > 90 ? "bg-destructive/20 [&>div]:bg-destructive" : 
                percentage > 75 ? "bg-amber-500/20 [&>div]:bg-amber-500" : 
                "bg-green-500/20 [&>div]:bg-green-500"
              }`}
            />
          </div>
        )
      })}

      {budgets.length > 3 && (
        <p className="text-xs text-muted-foreground text-center">+{budgets.length - 3} more budgets</p>
      )}

      <Button variant="outline" className="w-full mt-2" onClick={() => setActiveView("budgeting")}>
        View All Budgets
      </Button>
    </div>
  )
}

