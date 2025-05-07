"use client"

import { ArrowDown, ArrowUp, PiggyBank } from "lucide-react"
import type { Expense, Income, SavingsTransaction } from "@/types/finance"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

interface RecentTransactionsProps {
  expenses: Expense[]
  incomes: Income[]
  savingsTransactions: SavingsTransaction[]
}

export function RecentTransactions({ expenses, incomes, savingsTransactions }: RecentTransactionsProps) {
  // Combine and sort transactions by date
  const transactions = [
    ...expenses.map((expense) => ({
      ...expense,
      type: "expense" as const,
      amount: Number(expense.amount),
      title: expense.description,
    })),
    ...incomes.map((income) => ({
      ...income,
      type: "income" as const,
      amount: Number(income.amount),
      title: income.description,
    })),
    ...savingsTransactions.map((saving) => ({
      ...saving,
      type: "savings" as const,
      amount: Number(saving.amount),
      title: `Saved to ${saving.goalName}`,
    })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime())

  // Take only the most recent 4 transactions
  const recentTransactions = transactions.slice(0, 4)

  return (
    <div className="space-y-4">
      {recentTransactions.map((transaction) => (
        <div
          key={transaction.id}
          className="flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className={`rounded-full p-2 ${
              transaction.type === "income" 
                ? "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400" 
                : transaction.type === "savings"
                ? "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                : "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400"
            }`}>
              {transaction.type === "income" ? (
                <ArrowUp className="h-4 w-4" />
              ) : transaction.type === "savings" ? (
                <PiggyBank className="h-4 w-4" />
              ) : (
                <ArrowDown className="h-4 w-4" />
              )}
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">{transaction.title}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {format(transaction.date, "MMM dd, yyyy")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <p className={`font-medium ${
              transaction.type === "income" 
                ? "text-green-600 dark:text-green-400" 
                : transaction.type === "savings"
                ? "text-blue-600 dark:text-blue-400"
                : "text-red-600 dark:text-red-400"
            }`}>
              {transaction.type === "income" ? "+" : transaction.type === "savings" ? "→" : "-"} Rs. {transaction.amount.toFixed(2)}
            </p>
            <Badge variant="secondary" className="bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-300">
              {transaction.type === "savings" ? "Savings" : transaction.category}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  )
}

