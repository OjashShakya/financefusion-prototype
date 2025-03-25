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
    <div className="space-y-6">
      {/* Welcome Message */}
      <div className="rounded-lg bg-muted/50 p-4 md:p-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            {greeting}, {user?.fullname || "User"}!
          </h1>
          <p className="text-muted-foreground">
            Welcome to your financial dashboard. Here's an overview of your finances.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <DashboardSummary expenses={expenses} incomes={incomes} />

      {/* Quick Actions */}
      <QuickActions setActiveView={setActiveView} addExpense={addExpense} addIncome={addIncome} />

      {/* Cash Flow Chart - Full width (FIRST PRIORITY) */}
      <Card>
        <CardHeader>
          <CardTitle>Cash Flow Trends</CardTitle>
          <CardDescription>Your income, expenses, and balance over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[350px]">
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

      {/* Monthly Comparison Chart - Full width (SECOND PRIORITY) */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Comparison</CardTitle>
          <CardDescription>Income vs Expenses by month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[350px]">
            <MonthlyComparisonChart
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
                }
              }).reverse()}
            />
          </div>
        </CardContent>
      </Card>

      {/* Pie Charts - Two column layout (THIRD PRIORITY) */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Expense Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Expense Distribution</CardTitle>
            <CardDescription>Breakdown of your expenses by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ExpenseDistributionChart
                data={expenses
                  .reduce(
                    (acc, expense) => {
                      const existingCategory = acc.find((item) => item.name === expense.category)
                      if (existingCategory) {
                        existingCategory.value += expense.amount
                      } else {
                        acc.push({ name: expense.category, value: expense.amount })
                      }
                      return acc
                    },
                    [] as { name: string; value: number }[],
                  )
                  .sort((a, b) => b.value - a.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Income Sources */}
        <Card>
          <CardHeader>
            <CardTitle>Income Sources</CardTitle>
            <CardDescription>Breakdown of your income by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <IncomeSourcesChart
                data={incomes
                  .reduce(
                    (acc, income) => {
                      const existingCategory = acc.find((item) => item.name === income.category)
                      if (existingCategory) {
                        existingCategory.value += income.amount
                      } else {
                        acc.push({ name: income.category, value: income.amount })
                      }
                      return acc
                    },
                    [] as { name: string; value: number }[],
                  )
                  .sort((a, b) => b.value - a.value)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Two Column Layout for Widgets */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your latest expenses and income</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentTransactions expenses={expenses} incomes={incomes} />
          </CardContent>
        </Card>

        {/* Budget Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Budget Progress</CardTitle>
            <CardDescription>Track your spending against budget categories</CardDescription>
          </CardHeader>
          <CardContent>
            <BudgetProgressWidget budgets={budgets} setActiveView={setActiveView} />
          </CardContent>
        </Card>
      </div>

      {/* Savings Goals */}
      <Card>
        <CardHeader>
          <CardTitle>Savings Goals</CardTitle>
          <CardDescription>Track progress towards your financial goals</CardDescription>
        </CardHeader>
        <CardContent>
          <SavingsGoalsWidget
            goals={savingsGoals}
            updateSavingsGoal={updateSavingsGoal}
            setActiveView={setActiveView}
          />
        </CardContent>
      </Card>
    </div>
  )
}

