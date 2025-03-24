"use client"

import { useMemo } from "react"
import { format } from "date-fns"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ExpenseDistributionChart } from "./charts/expense-distribution-chart"
import { IncomeSourcesChart } from "./charts/income-sources-chart"
import { CashFlowChart } from "./charts/cash-flow-chart"
import { MonthlyComparisonChart } from "./charts/monthly-comparison-chart"
import type { Expense, Income } from "@/components/finance-dashboard"

interface DashboardChartsProps {
  expenses: Expense[]
  incomes: Income[]
}

export function DashboardCharts({ expenses, incomes }: DashboardChartsProps) {
  // Calculate expenses by category for the pie chart
  const expensesByCategory = useMemo(() => {
    const categoryMap = new Map<string, number>()

    expenses.forEach((expense) => {
      const currentAmount = categoryMap.get(expense.category) || 0
      categoryMap.set(expense.category, currentAmount + expense.amount)
    })

    return Array.from(categoryMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value) // Sort by value descending
  }, [expenses])

  // Calculate income by category for the pie chart
  const incomeByCategory = useMemo(() => {
    const categoryMap = new Map<string, number>()

    incomes.forEach((income) => {
      const currentAmount = categoryMap.get(income.category) || 0
      categoryMap.set(income.category, currentAmount + income.amount)
    })

    return Array.from(categoryMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value) // Sort by value descending
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
        name: month,
        income: monthIncome,
        expenses: monthExpenses,
        balance: monthIncome - monthExpenses,
      }
    })

    return result
  }, [expenses, incomes])

  // Monthly comparison data (simplified for demo)
  const monthlyComparisonData = useMemo(() => {
    return cashFlowData.map(({ name, income, expenses }) => ({
      name,
      income,
      expenses,
    }))
  }, [cashFlowData])

  return (
    <Tabs defaultValue="cashflow" className="space-y-4">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
        <TabsTrigger value="monthly">Monthly</TabsTrigger>
        <TabsTrigger value="expenses">Expenses</TabsTrigger>
        <TabsTrigger value="income">Income</TabsTrigger>
      </TabsList>

      <TabsContent value="cashflow" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Cash Flow Trends</CardTitle>
            <CardDescription>Your income, expenses, and balance over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <CashFlowChart data={cashFlowData} />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="monthly" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Comparison</CardTitle>
            <CardDescription>Income vs Expenses by month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <MonthlyComparisonChart data={monthlyComparisonData} />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="expenses" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Expense Distribution</CardTitle>
            <CardDescription>Breakdown of your expenses by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ExpenseDistributionChart data={expensesByCategory} />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="income" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Income Sources</CardTitle>
            <CardDescription>Breakdown of your income by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <IncomeSourcesChart data={incomeByCategory} />
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

