"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BudgetForm } from "./budget-form"
import { BudgetList } from "./budget-list"
import type { Budget, Expense } from "@/types/finance"

interface BudgetViewProps {
  budgets: Budget[]
  expenses: Expense[]
  onAdd: (budget: Omit<Budget, "id" | "spent">) => void
  onDelete: (id: string) => void
}

export function BudgetView({ budgets, expenses, onAdd, onDelete }: BudgetViewProps) {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Budget Planning</h1>
        <p className="text-muted-foreground">Set and track your budgets</p>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="list">Budgets</TabsTrigger>
          <TabsTrigger value="add">Create Budget</TabsTrigger>
        </TabsList>
        <TabsContent value="list" className="space-y-4 pt-4">
          <BudgetList budgets={budgets} expenses={expenses} onDelete={onDelete} />
        </TabsContent>
        <TabsContent value="add" className="space-y-4 pt-4">
          <BudgetForm onSubmit={onAdd} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

