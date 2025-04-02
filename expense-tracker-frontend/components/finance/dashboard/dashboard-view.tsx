"use client"

import { useEffect, useState } from "react"
import { DashboardSummary } from "./dashboard-summary"
import { QuickActions } from "./quick-actions"
import { RecentTransactions } from "./recent-transactions"
import { SavingsGoalsWidget } from "./savings-goals-widget"
import { BudgetProgressWidget } from "./budget-progress-widget"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Expense, Income, Budget, SavingsGoal } from "@/components/finance-dashboard"
import { ExpenseDistributionChart } from "./charts/expense-distribution-chart"
import { IncomeSourcesChart } from "./charts/income-sources-chart"
import { CashFlowChart } from "./charts/cash-flow-chart"
import { MonthlyComparisonChart } from "./charts/monthly-comparison-chart"
import { useAuth } from "@/app/context/AuthContext"

interface DashboardViewProps {
  expenses: Expense[]
  incomes: Income[]
  budgets: Budget[]
  savingsGoals: SavingsGoal[]
  updateSavingsGoal: (id: string, amount: number) => void
  setActiveView: (view: string) => void
  addExpense: (expense: Omit<Expense, "id">) => void
  addIncome: (income: Omit<Income, "id">) => void
}

export function DashboardView({
  expenses,
  incomes,
  budgets,
  savingsGoals,
  updateSavingsGoal,
  setActiveView,
  addExpense,
  addIncome,
}: DashboardViewProps) {
  const { user } = useAuth()
  const [greeting, setGreeting] = useState("Good day")

  // Update greeting based on time of day
  useEffect(() => {
    const currentHour = new Date().getHours()
    let newGreeting = "Good morning"
    if (currentHour >= 12 && currentHour < 18) {
      newGreeting = "Good afternoon"
    } else if (currentHour >= 18) {
      newGreeting = "Good evening"
    }
    setGreeting(newGreeting)
  }, [])

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Welcome Message */}
      <div>
        <h1 className="text-2xl md:text-[32px] font-semibold tracking-tight">
          {greeting}, {user?.fullname || "Username"}!
        </h1>
        <p className="text-sm text-muted-foreground">
          Welcome to dashboard. Here's an overview of your finance.
        </p>
      </div>

      {/* Summary Cards and Quick Actions */}
      <div className="space-y-6">
        <DashboardSummary 
          expenses={expenses} 
          incomes={incomes} 
        />
        <div>
          <QuickActions 
            setActiveView={setActiveView} 
            addExpense={addExpense} 
            addIncome={addIncome} 
          />
        </div>
      </div>

      {/* Cash Flow Chart and Recent Transactions */}
      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Cash Flow Trends</CardTitle>
            <CardDescription>Your income, expenses, and balance over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] md:h-[350px]">
              <CashFlowChart
                data={Array.from({ length: 6 }, (_, i) => {
                  const date = new Date()
                  date.setMonth(date.getMonth() - i)
                  const month = date.toLocaleString("default", { month: "short" })
                  
                  const monthExpenses = expenses
                  .filter((expense) => {
                    const expenseMonth = expense.date.getMonth()
                    const expenseYear = expense.date.getFullYear()
                    return expenseMonth === date.getMonth() && expenseYear === date.getFullYear()
                  })
                  .reduce((sum, expense) => sum + expense.amount, 0)
                  
                  const monthIncome = incomes
                  .filter((income) => {
                    const incomeMonth = income.date.getMonth()
                    const incomeYear = income.date.getFullYear()
                    return incomeMonth === date.getMonth() && incomeYear === date.getFullYear()
                  })
                  .reduce((sum, income) => sum + income.amount, 0)
                  
                  return {
                    name: month,
                    income: monthIncome,
                    expenses: monthExpenses,
                    balance: monthIncome - monthExpenses,
                  }
                }).reverse()}
                />
            </div>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your latest expenses and income</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentTransactions expenses={expenses} incomes={incomes} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

