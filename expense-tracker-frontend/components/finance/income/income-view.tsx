"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { IncomeForm } from "./income-form"
import { IncomeList } from "./income-list"
import type { Income } from "@/types/finance"

interface IncomeViewProps {
  incomes: Income[]
  onAdd: (income: Omit<Income, "id">) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

export function IncomeView({ incomes, onAdd, onDelete }: IncomeViewProps) {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Income Tracking</h1>
        <p className="text-muted-foreground">Monitor your income sources</p>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="list">Income History</TabsTrigger>
          <TabsTrigger value="add">Add Income</TabsTrigger>
        </TabsList>
        <TabsContent value="list" className="space-y-4 pt-4">
          <IncomeList incomes={incomes} onDelete={onDelete} />
        </TabsContent>
        <TabsContent value="add" className="space-y-4 pt-4">
          <IncomeForm onSubmit={onAdd} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

