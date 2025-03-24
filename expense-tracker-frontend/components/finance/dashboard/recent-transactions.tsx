"use client"

import { useMemo } from "react"
import { format } from "date-fns"
import { ArrowDown, ArrowUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { Expense, Income } from "@/components/finance-dashboard"

interface RecentTransactionsProps {
  expenses: Expense[]
  incomes: Income[]
}

type Transaction = {
  id: string
  type: "expense" | "income"
  description: string
  amount: number
  category: string
  date: Date
}

export function RecentTransactions({ expenses, incomes }: RecentTransactionsProps) {
  // Combine and sort transactions
  const recentTransactions = useMemo(() => {
    const expenseTransactions: Transaction[] = expenses.map((expense) => ({
      id: expense.id,
      type: "expense",
      description: expense.description,
      amount: expense.amount,
      category: expense.category,
      date: expense.date,
    }))

    const incomeTransactions: Transaction[] = incomes.map((income) => ({
      id: income.id,
      type: "income",
      description: income.source,
      amount: income.amount,
      category: income.category,
      date: income.date,
    }))

    return [...expenseTransactions, ...incomeTransactions]
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 5)
  }, [expenses, incomes])

  if (recentTransactions.length === 0) {
    return (
      <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">No transactions yet</p>
          <p className="text-xs text-muted-foreground mt-1">Add an expense or income to get started</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {recentTransactions.map((transaction) => (
        <div key={transaction.id} className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-full ${
                transaction.type === "income" ? "bg-green-100" : "bg-red-100"
              }`}
            >
              {transaction.type === "income" ? (
                <ArrowUp className="h-5 w-5 text-green-600" />
              ) : (
                <ArrowDown className="h-5 w-5 text-red-600" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium">{transaction.description}</p>
              <p className="text-xs text-muted-foreground">{format(transaction.date, "MMM d, yyyy")}</p>
            </div>
          </div>
          <div className="text-right">
            <p className={`text-sm font-medium ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}>
              {transaction.type === "income" ? "+" : "-"}${transaction.amount.toFixed(2)}
            </p>
            <Badge variant="outline" className="text-xs">
              {transaction.category}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  )
}

