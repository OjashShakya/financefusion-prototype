"use client"

import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import type { Budget, Expense } from "@/types/finance"

interface BudgetProgressProps {
  budgets: Budget[]
  expenses: Expense[]
  setActiveView: (view: string) => void
}

export function BudgetProgress({ budgets, expenses, setActiveView }: BudgetProgressProps) {
  if (budgets.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-sm text-muted-foreground">No budgets set up yet</p>
        <Button 
          variant="outline" 
          className="mt-2" 
          onClick={() => setActiveView("budgeting")}
        >
          Create Budget
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {budgets.map((budget) => {
        const spent = expenses
          .filter(expense => expense.category === budget.category)
          .reduce((sum, expense) => sum + (expense.amount || 0), 0)
        
        const percentage = spent > budget.amount 
          ? -((spent - budget.amount) / budget.amount) * 100 
          : (spent / budget.amount) * 100
        const remaining = budget.amount - spent

        return (
          <div key={budget.id} className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-medium">{budget.category}</span>
                <span className="text-xs text-muted-foreground">
                  ${spent.toFixed(2)} of ${budget.amount.toFixed(2)}
                </span>
              </div>
              <span
                className={`text-xs font-medium ${
                  percentage < 0 || percentage > 90
                    ? "text-destructive"
                    : percentage > 75
                      ? "text-amber-500"
                      : "text-green-500"
                }`}
              >
                {percentage.toFixed(0)}%
              </span>
            </div>
            <Progress
              value={Math.abs(percentage)}
              className={`h-2 ${
                percentage < 0
                  ? "!bg-red-500"
                  : percentage > 90
                    ? "!bg-red-100"
                    : percentage > 75
                      ? "!bg-amber-500/20"
                      : "!bg-[#e8f5e9]"
              }`}
              indicatorClassName={`${
                percentage < 0
                  ? "!bg-black"
                  : percentage > 90
                    ? "!bg-red-500"
                    : percentage > 75
                      ? "!bg-amber-500"
                      : "!bg-[#27ae60]"
              }`}
            />
          </div>
        )
      })}
    </div>
  )
} 