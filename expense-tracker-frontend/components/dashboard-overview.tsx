"use client"

import { useMemo } from "react"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Line,
  AreaChart,
  Area,
} from "recharts"
import { ArrowDown, ArrowUp, TrendingUp, TrendingDown, Wallet } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { format } from "date-fns"
import type { Expense, Income, Budget, SavingsGoal } from "./finance-dashboard"

interface DashboardOverviewProps {
  expenses: Expense[]
  incomes: Income[]
  budgets: Budget[]
  savingsGoals: SavingsGoal[]
  updateSavingsGoal: (id: string, amount: number) => void
  setActiveView: (view: string) => void
}

// Colors for charts
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A569BD", "#5DADE2", "#48C9B0", "#F4D03F", "#EC7063"]

export function DashboardOverview({
  expenses,
  incomes,
  budgets,
  savingsGoals,
  updateSavingsGoal,
  setActiveView,
}: DashboardOverviewProps) {
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

  // Calculate expenses by category for the pie chart
  const expensesByCategory = useMemo(() => {
    const categoryMap = new Map<string, number>()

    expenses.forEach((expense) => {
      const currentAmount = categoryMap.get(expense.category) || 0
      categoryMap.set(expense.category, currentAmount + expense.amount)
    })

    return Array.from(categoryMap.entries()).map(([name, value]) => ({
      name,
      value,
    }))
  }, [expenses])

  // Calculate income by category for the pie chart
  const incomeByCategory = useMemo(() => {
    const categoryMap = new Map<string, number>()

    incomes.forEach((income) => {
      const currentAmount = categoryMap.get(income.category) || 0
      categoryMap.set(income.category, currentAmount + income.amount)
    })

    return Array.from(categoryMap.entries()).map(([name, value]) => ({
      name,
      value,
    }))
  }, [incomes])

  // Calculate cash flow over time (last 6 months)
  const cashFlowData = useMemo(() => {
    const months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      return {
        month: format(date, "MMM"),
        timestamp: date.getTime(),
      }
    }).reverse()

    const result = months.map(({ month, timestamp }) => {
      const monthExpenses = expenses
        .filter((expense) => expense.date.getTime() <= timestamp)
        .reduce((sum, expense) => sum + expense.amount, 0)

      const monthIncome = incomes
        .filter((income) => income.date.getTime() <= timestamp)
        .reduce((sum, income) => sum + income.amount, 0)

      return {
        month,
        income: monthIncome,
        expenses: monthExpenses,
        balance: monthIncome - monthExpenses,
      }
    })

    return result
  }, [expenses, incomes])

  // Calculate budget status
  const budgetStatus = useMemo(() => {
    return budgets
      .map((budget) => {
        const percentage = (budget.spent / budget.amount) * 100
        const remaining = budget.amount - budget.spent

        return {
          ...budget,
          percentage,
          remaining,
        }
      })
      .sort((a, b) => b.percentage - a.percentage)
  }, [budgets])

  // Handle contribution to savings goal
  const handleContribution = (goalId: string, amount: string) => {
    const goal = savingsGoals.find((g) => g.id === goalId)
    if (!goal) return

    const newAmount = goal.initial_amount + Number.parseFloat(amount || "0")
    if (isNaN(newAmount)) return

    updateSavingsGoal(goalId, Math.min(newAmount, goal.target_amount))
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
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

      {/* Cash Flow Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Cash Flow Trends</CardTitle>
          <CardDescription>Your income, expenses, and balance over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cashFlowData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: number) => [`$${value.toFixed(2)}`, ""]} />
                <Legend />
                <Area type="monotone" dataKey="income" stackId="1" stroke="#8884d8" fill="#8884d8" name="Income" />
                <Area type="monotone" dataKey="expenses" stackId="2" stroke="#82ca9d" fill="#82ca9d" name="Expenses" />
                <Line type="monotone" dataKey="balance" stroke="#ff7300" name="Balance" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Budget Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Budget Progress</CardTitle>
          <CardDescription>Track your spending against budget categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {budgetStatus.length > 0 ? (
              budgetStatus.map((budget) => (
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
                        budget.percentage > 90
                          ? "text-destructive"
                          : budget.percentage > 75
                            ? "text-amber-500"
                            : "text-green-500"
                      }`}
                    >
                      {budget.percentage.toFixed(0)}%
                    </span>
                  </div>
                  <Progress
                    value={budget.percentage}
                    className={`h-2 ${
                      budget.percentage > 90
                        ? "bg-destructive/20"
                        : budget.percentage > 75
                          ? "bg-amber-500/20"
                          : "bg-green-500/20"
                    }`}
                    indicatorClassName={`${
                      budget.percentage > 90
                        ? "bg-destructive"
                        : budget.percentage > 75
                          ? "bg-amber-500"
                          : "bg-green-500"
                    }`}
                  />
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground">No budgets set up yet</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Distribution Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Expense Distribution</CardTitle>
            <CardDescription>Breakdown of your expenses by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {expensesByCategory.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expensesByCategory}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {expensesByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [`$${value.toFixed(2)}`, "Amount"]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-sm text-muted-foreground">No expense data available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Income Sources</CardTitle>
            <CardDescription>Breakdown of your income by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {incomeByCategory.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={incomeByCategory}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {incomeByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [`$${value.toFixed(2)}`, "Amount"]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-sm text-muted-foreground">No income data available</p>
                </div>
              )}
            </div>
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
          <div className="space-y-6">
            {savingsGoals.length > 0 ? (
              savingsGoals.map((goal) => {
                if (!goal || typeof goal.initial_amount !== 'number' || typeof goal.target_amount !== 'number') {
                  console.error('Invalid goal data:', goal);
                  return null;
                }

                const percentage = (goal.initial_amount / goal.target_amount) * 100;
                const remaining = goal.target_amount - goal.initial_amount;
                const targetDate = format(goal.date, "MMM d, yyyy");

                return (
                  <div key={goal.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{goal.name}</h4>
                        <p className="text-xs text-muted-foreground">
                          Target: ${goal.target_amount.toFixed(2)} by {targetDate}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${goal.initial_amount.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">${remaining.toFixed(2)} remaining</p>
                      </div>
                    </div>
                    <Progress value={percentage} className="h-2" indicatorClassName={`bg-[${goal.color}]`} />
                    <div className="flex items-center gap-2">
                      <Input type="number" placeholder="Amount" className="h-8" id={`contribution-${goal.id}`} />
                      <Button
                        size="sm"
                        onClick={() => {
                          const input = document.getElementById(`contribution-${goal.id}`) as HTMLInputElement
                          handleContribution(goal.id, input.value)
                          input.value = ""
                        }}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground">No savings goals set up yet</p>
                <Button className="mt-2" variant="outline" onClick={() => setActiveView("savings")}>
                  Create a Savings Goal
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

