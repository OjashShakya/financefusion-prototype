"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { AlertCircle } from "lucide-react"
import type { Budget, Expense } from "@/types/finance"

interface BudgetProgressProps {
  budgets: Budget[]
  expenses: Expense[]
  setActiveView: (view: string) => void
}

export function BudgetProgress({ budgets, expenses, setActiveView }: BudgetProgressProps) {
  const { toast } = useToast();

  const handleShowBudgetStatus = (budget: Budget) => {
    const spent = expenses
      .filter(expense => expense.category === budget.category)
      .reduce((sum, expense) => sum + (expense.amount || 0), 0);
    
    const percentage = (spent / budget.amount) * 100;
    const remaining = budget.amount - spent;

    if (percentage >= 100) {
      toast({
        title: "Budget Exceeded",
        description: `You have exceeded your ${budget.category} budget by Rs. ${Math.abs(remaining).toFixed(2)}.`,
        variant: "destructive",
        duration: 3000,
      });
    }
    else {
      toast({
        title: "Budget Status",
        description: `Your ${budget.category} budget is at ${percentage.toFixed(0)}%. Rs. ${remaining.toFixed(2)} remaining.`,
        variant: "success",
        duration: 3000,
      });
    }
  };

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
        const isExceeded = percentage >= 100;

        return (
          <div key={budget.id} className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-medium">{budget.category}</span>
                <span className="text-xs text-muted-foreground">
                  Rs. {spent.toFixed(2)} of Rs. {budget.amount.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-6 w-6 ${isExceeded ? 'text-destructive hover:text-destructive/80' : 'text-green-500 hover:text-green-600'}`}
                  onClick={() => handleShowBudgetStatus(budget)}
                >
                  <AlertCircle className="h-4 w-4" />
                  <span className="sr-only">Show budget status</span>
                </Button>
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