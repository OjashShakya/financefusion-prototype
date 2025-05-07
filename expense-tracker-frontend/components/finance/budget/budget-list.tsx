"use client"

import { useState } from "react"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import type { Budget, Expense } from "@/types/finance"

interface BudgetListProps {
  budgets: Budget[]
  expenses: Expense[]
  onDelete: (id: string) => void
}

export function BudgetList({ budgets, expenses, onDelete }: BudgetListProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredBudgets = budgets
    .filter((budget) => budget.category.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      const aSpent = expenses
        .filter(expense => expense.category === a.category)
        .reduce((sum, expense) => sum + (expense.amount || 0), 0)
      const bSpent = expenses
        .filter(expense => expense.category === b.category)
        .reduce((sum, expense) => sum + (expense.amount || 0), 0)
      const aPercentage = (aSpent / a.amount) * 100
      const bPercentage = (bSpent / b.amount) * 100
      return bPercentage - aPercentage
    })

  return (
    <div className="space-y-4">
      <div className="relative">
        <Input placeholder="Search budgets..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>

      {filteredBudgets.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredBudgets.map((budget) => {
            const spent = expenses
              .filter(expense => expense.category === budget.category)
              .reduce((sum, expense) => sum + (expense.amount || 0), 0)
            const percentage = spent > budget.amount 
              ? -((spent - budget.amount) / budget.amount) * 100 
              : (spent / budget.amount) * 100
            const remaining = budget.amount - spent

            return (
              <Card key={budget.id} className="bg-[#f9f9f9] dark:bg-[#131313] border-[#e2e8f0] dark:border-[#4e4e4e]">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{budget.category}</CardTitle>
                      <CardDescription>
                        {budget.period.charAt(0).toUpperCase() + budget.period.slice(1)} budget
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(budget.id)}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        ${spent.toFixed(2)} of ${budget.amount.toFixed(2)}
                      </span>
                      <Badge variant={percentage < 0 || percentage > 90 ? "destructive" : percentage > 75 ? "outline" : "secondary"}>
                        {percentage.toFixed(0)}%
                      </Badge>
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
                    <p className="text-xs text-muted-foreground">${remaining.toFixed(2)} remaining</p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">No budgets found</p>
            {searchTerm && <p className="text-xs text-muted-foreground mt-1">Try adjusting your search</p>}
          </div>
        </div>
      )}
    </div>
  )
}

