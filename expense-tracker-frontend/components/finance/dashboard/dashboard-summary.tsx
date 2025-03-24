"use client"

import { useMemo } from "react"
import { ArrowDown, ArrowUp, TrendingUp, TrendingDown, Wallet } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Expense, Income } from "@/components/finance-dashboard"

interface DashboardSummaryProps {
  expenses: Expense[]
  incomes: Income[]
}

export function DashboardSummary({ expenses, incomes }: DashboardSummaryProps) {
  // Calculate total expenses
  const totalExpenses = useMemo(() => {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0)
  }, [expenses])

  // Calculate total income
  const totalIncome = useMemo(() => {
    return incomes.reduce((sum, income) => sum + income.amount, 0)
  }, [incomes])

  // Calculate net income (income - expenses)
  const netIncome = useMemo(() => {
    return totalIncome - totalExpenses
  }, [totalIncome, totalExpenses])

  // Calculate savings rate
  const savingsRate = useMemo(() => {
    if (totalIncome === 0) return 0
    return (netIncome / totalIncome) * 100
  }, [netIncome, totalIncome])

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Income</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalIncome.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">{incomes.length} income sources</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          <TrendingDown className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalExpenses.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">{expenses.length} transactions</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Net Income</CardTitle>
          {netIncome >= 0 ? (
            <ArrowUp className="h-4 w-4 text-green-500" />
          ) : (
            <ArrowDown className="h-4 w-4 text-destructive" />
          )}
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${netIncome >= 0 ? "text-green-500" : "text-destructive"}`}>
            ${Math.abs(netIncome).toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground">
            {netIncome >= 0 ? "Positive cash flow" : "Negative cash flow"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Savings Rate</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{savingsRate.toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground">
            {savingsRate >= 20
              ? "Excellent saving habits"
              : savingsRate >= 10
                ? "Good saving habits"
                : savingsRate >= 0
                  ? "Could save more"
                  : "Spending more than earning"}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

