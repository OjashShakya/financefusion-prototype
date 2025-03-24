"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExpenseForm } from "./expense-form"
import { ExpenseList } from "./expense-list"
import type { Expense } from "@/components/finance-dashboard"

interface ExpensesViewProps {
  expenses: Expense[]
  onAdd: (expense: Omit<Expense, "id">) => void
  onDelete: (id: string) => void
}

export function ExpensesView({ expenses, onAdd, onDelete }: ExpensesViewProps) {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Expense Management</h1>
        <p className="text-muted-foreground">Track and manage your expenses</p>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="list">Expense History</TabsTrigger>
          <TabsTrigger value="add">Add Expense</TabsTrigger>
        </TabsList>
        <TabsContent value="list" className="space-y-4 pt-4">
          <ExpenseList expenses={expenses} onDelete={onDelete} />
        </TabsContent>
        <TabsContent value="add" className="space-y-4 pt-4">
          <ExpenseForm onSubmit={onAdd} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

