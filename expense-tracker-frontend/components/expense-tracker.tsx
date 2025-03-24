"use client"

import { useState } from "react"
import { ExpenseForm } from "./expense-form"
import { ExpenseList } from "./expense-list"
import { ExpenseSummary } from "./expense-summary"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export type Expense = {
  id: string
  description: string
  amount: number
  category: string
  date: Date
}

export function ExpenseTracker() {
  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: "1",
      description: "Groceries",
      amount: 85.75,
      category: "Food",
      date: new Date("2025-03-18"),
    },
    {
      id: "2",
      description: "Movie tickets",
      amount: 24.99,
      category: "Entertainment",
      date: new Date("2025-03-15"),
    },
    {
      id: "3",
      description: "Electricity bill",
      amount: 120.5,
      category: "Utilities",
      date: new Date("2025-03-10"),
    },
  ])

  const addExpense = (expense: Omit<Expense, "id">) => {
    const newExpense = {
      ...expense,
      id: Math.random().toString(36).substring(2, 9),
    }
    setExpenses([newExpense, ...expenses])
  }

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter((expense) => expense.id !== id))
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Expense Tracker</h1>
        <p className="text-muted-foreground">Track and manage your expenses in one place</p>
      </div>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="add">Add Expense</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard" className="space-y-4 pt-4">
          <ExpenseSummary expenses={expenses} />
        </TabsContent>
        <TabsContent value="add" className="space-y-4 pt-4">
          <ExpenseForm onSubmit={addExpense} />
        </TabsContent>
        <TabsContent value="history" className="space-y-4 pt-4">
          <ExpenseList expenses={expenses} onDelete={deleteExpense} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

