"use client"

import { useState } from "react"
import { FinanceSidebar } from "@/components/layout/finance-sidebar"
import { FinanceHeader } from "@/components/layout/finance-header"
import { DashboardView } from "@/components/finance/dashboard/dashboard-view"
import { ExpensesView } from "@/components/finance/expenses/expenses-view"
import { IncomeView } from "@/components/finance/income/income-view"
import { BudgetView } from "@/components/finance/budget/budget-view"
import { SavingsView } from "@/components/finance/savings/savings-view"
import { SidebarProvider } from "@/components/ui/sidebar"
import { useAuth } from "@/app/context/AuthContext"

export type Expense = {
  id: string
  description: string
  amount: number
  category: string
  date: Date
}

export type Income = {
  id: string
  source: string
  amount: number
  category: string
  date: Date
}

export type Budget = {
  id: string
  category: string
  amount: number
  period: "weekly" | "monthly" | "yearly"
  spent: number
}

export type SavingsGoal = {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  targetDate: Date
  color: string
}

export function FinanceDashboard() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const [activeView, setActiveView] = useState("dashboard")
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [incomes, setIncomes] = useState<Income[]>([])
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([])

  const addExpense = (expense: Omit<Expense, "id">) => {
    const newExpense = {
      ...expense,
      id: Math.random().toString(36).substring(2, 9),
    }
    setExpenses([newExpense, ...expenses])

    // Update budget spent amount
    const matchingBudget = budgets.find((budget) => budget.category === expense.category)
    if (matchingBudget) {
      const updatedBudgets = budgets.map((budget) =>
        budget.id === matchingBudget.id ? { ...budget, spent: budget.spent + expense.amount } : budget,
      )
      setBudgets(updatedBudgets)
    }
  }

  const deleteExpense = (id: string) => {
    const expenseToDelete = expenses.find((expense) => expense.id === id)
    if (expenseToDelete) {
      // Update budget spent amount
      const matchingBudget = budgets.find((budget) => budget.category === expenseToDelete.category)
      if (matchingBudget) {
        const updatedBudgets = budgets.map((budget) =>
          budget.id === matchingBudget.id
            ? { ...budget, spent: Math.max(0, budget.spent - expenseToDelete.amount) }
            : budget,
        )
        setBudgets(updatedBudgets)
      }
    }
    setExpenses(expenses.filter((expense) => expense.id !== id))
  }

  const addIncome = (income: Omit<Income, "id">) => {
    const newIncome = {
      ...income,
      id: Math.random().toString(36).substring(2, 9),
    }
    setIncomes([newIncome, ...incomes])
  }

  const deleteIncome = (id: string) => {
    setIncomes(incomes.filter((income) => income.id !== id))
  }

  const addBudget = (budget: Omit<Budget, "id" | "spent">) => {
    const newBudget = {
      ...budget,
      id: Math.random().toString(36).substring(2, 9),
      spent: 0,
    }
    setBudgets([...budgets, newBudget])
  }

  const deleteBudget = (id: string) => {
    setBudgets(budgets.filter((budget) => budget.id !== id))
  }

  const addSavingsGoal = (goal: Omit<SavingsGoal, "id">) => {
    const newGoal = {
      ...goal,
      id: Math.random().toString(36).substring(2, 9),
    }
    setSavingsGoals([...savingsGoals, newGoal])
  }

  const updateSavingsGoal = (id: string, amount: number) => {
    setSavingsGoals(
      savingsGoals.map((goal) =>
        goal.id === id ? { ...goal, currentAmount: goal.currentAmount + amount } : goal,
      ),
    )
  }

  const deleteSavingsGoal = (id: string) => {
    setSavingsGoals(savingsGoals.filter((goal) => goal.id !== id))
  }

  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        return (
          <DashboardView
            expenses={expenses}
            incomes={incomes}
            budgets={budgets}
            savingsGoals={savingsGoals}
            updateSavingsGoal={updateSavingsGoal}
            setActiveView={setActiveView}
            addExpense={addExpense}
            addIncome={addIncome}
          />
        )
      case "expenses":
        return (
          <ExpensesView
            expenses={expenses}
            onAdd={addExpense}
            onDelete={deleteExpense}
          />
        )
      case "income":
        return (
          <IncomeView
            incomes={incomes}
            onAdd={addIncome}
            onDelete={deleteIncome}
          />
        )
      case "budget":
        return (
          <BudgetView
            budgets={budgets}
            onAdd={addBudget}
            onDelete={deleteBudget}
          />
        )
      case "savings":
        return (
          <SavingsView
            goals={savingsGoals}
            onAdd={addSavingsGoal}
            onUpdate={updateSavingsGoal}
            onDelete={deleteSavingsGoal}
          />
        )
      default:
        return null
    }
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <FinanceSidebar activeView={activeView} setActiveView={setActiveView} />
        <div className="flex-1 flex flex-col">
          <FinanceHeader activeView={activeView} />
          <main className="flex-1 overflow-auto p-6">{renderContent()}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}

