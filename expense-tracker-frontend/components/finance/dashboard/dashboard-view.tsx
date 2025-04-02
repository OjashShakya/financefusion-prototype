"use client"

import { useEffect, useState } from "react"
import { RecentTransactions } from "./recent-transactions"
import { Card, CardContent } from "@/components/ui/card"
import type { Expense, Income, Budget, SavingsGoal } from "@/components/finance-dashboard"
import { CashFlowChart } from "./charts/cash-flow-chart"
import { useAuth } from "@/app/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Plus, BarChart, Banknote, ChartPie, Wallet, Sun } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ExpenseForm } from "@/components/finance/expenses/expense-form"
import { IncomeForm } from "@/components/finance/income/income-form"
import { cn } from "@/lib/utils"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

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
  const [greeting, setGreeting] = useState("Good morning")
  const [expenseDialogOpen, setExpenseDialogOpen] = useState(false)
  const [incomeDialogOpen, setIncomeDialogOpen] = useState(false)

  // Calculate totals
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0)
  const netIncome = totalIncome - totalExpenses
  const savingsRate = totalIncome === 0 ? 0 : ((netIncome / totalIncome) * 100)

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
      {/* Greeting Section */}
      <div className="space-y-1">
        <h2 className="text-[32px] font-semibold tracking-tight">
          {greeting}, {user?.fullname || "Username"}!
        </h2>
        <p className="text-sm text-gray-500 mt-2">
          Welcome to dashboard. Here's an overview of your finance.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Income Card */}
        <Card className="overflow-hidden rounded-[16px] border bg-[#F9F9F9] shadow-sm dark:border-gray-800 dark:bg-[#1c1c1c]">
          <div className="p-6">
            <h3 className="text-base font-medium text-gray-600">Total Income</h3>
            <p className="mt-2 text-3xl font-bold">Rs. {totalIncome}</p>
            <p className="mt-1 text-sm text-gray-500">{incomes.length} income sources</p>
          </div>
          <div className="border-t bg-[#F9F9F9] px-4 py-4">
            <h4 className="flex items-center gap-2 text-base font-medium">
              <BarChart className="h-5 w-5" />
              Add Income
            </h4>
            <p className="mt-1 text-sm text-gray-500">Record a new income</p>
            <Dialog open={incomeDialogOpen} onOpenChange={setIncomeDialogOpen}>
              <DialogTrigger asChild>
                <Button className="mt-3 w-full gap-2 bg-[#27ae60] hover:bg-[#2ecc71] dark:bg-[#27ae60] dark:hover:bg-[#2ecc71]">
                  <Plus className="h-4 w-4" /> Add Income
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] rounded-[24px] border-gray-200 bg-white p-0 dark:border-gray-800 dark:bg-[#131313]">
                <div className="p-6 space-y-6">
                  <div className="space-y-2">
                    <DialogTitle className="text-2xl font-semibold">Add Income</DialogTitle>
                    <DialogDescription className="text-gray-500 dark:text-gray-400">
                      Track and manage your income
                    </DialogDescription>
                  </div>
                  <IncomeForm
                    onSubmit={(data) => {
                      addIncome(data)
                      setIncomeDialogOpen(false)
                    }}
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </Card>

        {/* Expense Card */}
        <Card className="overflow-hidden rounded-[16px] border bg-[#F9F9F9] shadow-sm dark:border-gray-800 dark:bg-[#1c1c1c]">
          <div className="p-6">
            <h3 className="text-base font-medium text-gray-600">Total Expenses</h3>
            <p className="mt-2 text-3xl font-bold">Rs. {totalExpenses}</p>
            <p className="mt-1 text-sm text-gray-500">{expenses.length} transactions</p>
          </div>
          <div className="border-t bg-[#F9F9F9] px-4 py-4">
            <h4 className="flex items-center gap-2 text-base font-medium">
              <Banknote className="h-5 w-5" />
              Add Expense
            </h4>
            <p className="mt-1 text-sm text-gray-500">Record a new expense</p>
            <Dialog open={expenseDialogOpen} onOpenChange={setExpenseDialogOpen}>
              <DialogTrigger asChild>
                <Button className="mt-3 bg-[#F9F9F9] w-full gap-2 dark:bg-[#1c1c1c]" variant="outline">
                  <Plus className="h-4 w-4" /> Add Expense
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] rounded-[24px] border-gray-200 bg-white p-0 dark:border-gray-800 dark:bg-[#131313]">
                <div className="p-6 space-y-6">
                  <div className="space-y-2">
                    <DialogTitle className="text-2xl font-semibold">Add Expense</DialogTitle>
                    <DialogDescription className="text-gray-500 dark:text-gray-400">
                      Track and manage your expenses
                    </DialogDescription>
                  </div>
                  <ExpenseForm
                    onSubmit={(data) => {
                      addExpense(data)
                      setExpenseDialogOpen(false)
                    }}
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </Card>

        {/* Net Income Card */}
        <Card className="overflow-hidden rounded-[16px] border bg-[#F9F9F9] shadow-sm dark:border-gray-800 dark:bg-[#1c1c1c]">
          <div className="p-6">
            <h3 className="text-base font-medium text-gray-600">Net Income</h3>
            <p className={cn(
              "mt-2 text-3xl font-bold",
              netIncome >= 0 ? "text-[#10B981]" : "text-red-500"
            )}>
              Rs. {Math.abs(netIncome)}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              {netIncome >= 0 ? "Positive cash flow" : "Negative cash flow"}
            </p>
          </div>
          <div className="border-t bg-[#F9F9F9] px-4 py-4">
            <h4 className="flex items-center gap-2 text-base font-medium">
              <ChartPie className="h-5 w-5" />
              Mange Budgets
            </h4>
            <p className="mt-1 text-sm text-gray-500">Set and track budgets</p>
            <Button 
              variant="outline" 
              className="mt-3 bg-[#F9F9F9] w-full gap-2" 
              onClick={() => setActiveView("budgeting")}
            >
              <ChartPie className="h-4 w-4" /> View Budgets
            </Button>
          </div>
        </Card>

        {/* Savings Card */}
        <Card className="overflow-hidden rounded-[16px] border bg-[#F9F9F9] shadow-sm dark:border-gray-800 dark:bg-[#1c1c1c]">
          <div className="p-6">
            <h3 className="text-base font-medium text-gray-600">Saving Rate</h3>
            <p className="mt-2 text-3xl font-bold">{savingsRate.toFixed(1)}%</p>
            <p className="mt-1 text-sm text-gray-500">
              {savingsRate >= 20 ? "Excellent saving habits" : 
               savingsRate >= 10 ? "Good saving habits" :
               savingsRate >= 0 ? "Could save more" :
               "Spending more than earning"}
            </p>
          </div>
          <div className="border-t bg-[#F9F9F9] px-4 py-4">
            <h4 className="flex items-center gap-2 text-base font-medium">
              <Wallet className="h-5 w-5" />
              Savings Goals
            </h4>
            <p className="mt-1 text-sm text-gray-500">Record a new expense</p>
            <Button 
              variant="outline" 
              className="mt-3 bg-[#F9F9F9] w-full gap-2" 
              onClick={() => setActiveView("savings")}
            >
              <Wallet className="h-4 w-4" /> View Goals
            </Button>
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 lg:grid-cols-[2fr,1fr]">
        <Card className="overflow-hidden rounded-[16px] border shadow-sm dark:border-gray-800 dark:bg-[#131313]">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium dark:text-white">Cash Flow Trends</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Your income, expenses, and balance over time</p>
            <div className="mt-4 h-[300px]">
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

        <Card className="overflow-hidden rounded-[16px] border shadow-sm dark:border-gray-800 dark:bg-[#131313]">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium dark:text-white">Recent Transactions</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Your latest expenses and income</p>
            <div className="mt-4">
              <RecentTransactions expenses={expenses} incomes={incomes} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

