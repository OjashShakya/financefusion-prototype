"use client"

import { useState } from "react"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import type { Budget } from "@/components/finance-dashboard"

interface BudgetListProps {
  budgets: Budget[]
  onDelete: (id: string) => void
}

export function BudgetList({ budgets, onDelete }: BudgetListProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredBudgets = budgets
    .filter((budget) => budget.category.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      const aPercentage = (a.spent / a.amount) * 100
      const bPercentage = (b.spent / b.amount) * 100
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
            const percentage = (budget.spent / budget.amount) * 100
            const remaining = budget.amount - budget.spent

            return (
              <Card key={budget.id}>
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
                        ${budget.spent.toFixed(2)} of ${budget.amount.toFixed(2)}
                      </span>
                      <Badge variant={percentage > 90 ? "destructive" : percentage > 75 ? "outline" : "secondary"}>
                        {percentage.toFixed(0)}%
                      </Badge>
                    </div>
                    <Progress
                      value={percentage}
                      className={`h-2 ${
                        percentage > 90 ? "bg-destructive/20" : percentage > 75 ? "bg-amber-500/20" : "bg-green-500/20"
                      }`}
                      indicatorClassName={`${
                        percentage > 90 ? "bg-destructive" : percentage > 75 ? "bg-amber-500" : "bg-green-500"
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

