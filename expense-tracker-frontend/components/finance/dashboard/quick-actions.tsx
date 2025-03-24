"use client"

import { useState } from "react"
import { CreditCard, TrendingUp, BarChart3, DollarSign, Plus, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ExpenseForm } from "@/components/finance/expenses/expense-form"
import { IncomeForm } from "@/components/finance/income/income-form"
import type { Expense, Income } from "@/components/finance-dashboard"

interface QuickActionsProps {
  setActiveView: (view: string) => void
  addExpense: (expense: Omit<Expense, "id">) => void
  addIncome: (income: Omit<Income, "id">) => void
}

export function QuickActions({ setActiveView, addExpense, addIncome }: QuickActionsProps) {
  const [expenseDialogOpen, setExpenseDialogOpen] = useState(false)
  const [incomeDialogOpen, setIncomeDialogOpen] = useState(false)

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Quick Add Expense */}
      <Card className="relative overflow-hidden transition-all hover:shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Add Expense
          </CardTitle>
          <CardDescription>Record a new expense</CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <p className="text-sm text-muted-foreground">Quickly add your expenses to keep track of your spending.</p>
        </CardContent>
        <CardFooter className="pt-2">
          <Dialog open={expenseDialogOpen} onOpenChange={setExpenseDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full gap-2">
                <Plus className="h-4 w-4" /> Add Expense
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Expense</DialogTitle>
                <DialogDescription>Enter the details of your expense below.</DialogDescription>
              </DialogHeader>
              <ExpenseForm
                onSubmit={(data) => {
                  addExpense(data)
                  setExpenseDialogOpen(false)
                }}
              />
            </DialogContent>
          </Dialog>
        </CardFooter>
        <div className="absolute right-2 top-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={() => setActiveView("expenses")}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </Card>

      {/* Quick Add Income */}
      <Card className="relative overflow-hidden transition-all hover:shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            Add Income
          </CardTitle>
          <CardDescription>Record a new income</CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <p className="text-sm text-muted-foreground">Track your income sources to monitor your cash flow.</p>
        </CardContent>
        <CardFooter className="pt-2">
          <Dialog open={incomeDialogOpen} onOpenChange={setIncomeDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full gap-2" variant="outline">
                <Plus className="h-4 w-4" /> Add Income
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Income</DialogTitle>
                <DialogDescription>Enter the details of your income below.</DialogDescription>
              </DialogHeader>
              <IncomeForm
                onSubmit={(data) => {
                  addIncome(data)
                  setIncomeDialogOpen(false)
                }}
              />
            </DialogContent>
          </Dialog>
        </CardFooter>
        <div className="absolute right-2 top-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => setActiveView("income")}>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </Card>

      {/* Go to Budgeting */}
      <Card className="relative overflow-hidden transition-all hover:shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-500" />
            Manage Budgets
          </CardTitle>
          <CardDescription>Set and track budgets</CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <p className="text-sm text-muted-foreground">Create budgets for different categories to control spending.</p>
        </CardContent>
        <CardFooter className="pt-2">
          <Button variant="outline" className="w-full gap-2" onClick={() => setActiveView("budgeting")}>
            <BarChart3 className="h-4 w-4" /> View Budgets
          </Button>
        </CardFooter>
      </Card>

      {/* Go to Savings */}
      <Card className="relative overflow-hidden transition-all hover:shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-amber-500" />
            Savings Goals
          </CardTitle>
          <CardDescription>Track your savings</CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <p className="text-sm text-muted-foreground">Set financial goals and track your progress over time.</p>
        </CardContent>
        <CardFooter className="pt-2">
          <Button variant="outline" className="w-full gap-2" onClick={() => setActiveView("savings")}>
            <DollarSign className="h-4 w-4" /> View Goals
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

