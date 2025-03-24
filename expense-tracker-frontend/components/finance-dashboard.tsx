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
  const { user } = useAuth()
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
    {
      id: "4",
      description: "Restaurant dinner",
      amount: 65.3,
      category: "Food",
      date: new Date("2025-03-05"),
    },
    {
      id: "5",
      description: "Gas",
      amount: 45.2,
      category: "Transportation",
      date: new Date("2025-03-02"),
    },
    {
      id: "6",
      description: "Internet bill",
      amount: 59.99,
      category: "Utilities",
      date: new Date("2025-02-28"),
    },
    {
      id: "7",
      description: "Coffee shop",
      amount: 12.5,
      category: "Food",
      date: new Date("2025-02-25"),
    },
  ])

  const [incomes, setIncomes] = useState<Income[]>([
    {
      id: "1",
      source: "Salary",
      amount: 3500,
      category: "Employment",
      date: new Date("2025-03-01"),
    },
    {
      id: "2",
      source: "Freelance work",
      amount: 750,
      category: "Side Hustle",
      date: new Date("2025-03-12"),
    },
    {
      id: "3",
      source: "Dividend payment",
      amount: 120,
      category: "Investments",
      date: new Date("2025-03-15"),
    },
    {
      id: "4",
      source: "Rental income",
      amount: 1200,
      category: "Rental",
      date: new Date("2025-02-28"),
    },
  ])

  const [budgets, setBudgets] = useState<Budget[]>([
    {
      id: "1",
      category: "Food",
      amount: 400,
      period: "monthly",
      spent: 151.05,
    },
    {
      id: "2",
      category: "Entertainment",
      amount: 200,
      period: "monthly",
      spent: 24.99,
    },
    {
      id: "3",
      category: "Utilities",
      amount: 300,
      period: "monthly",
      spent: 120.5,
    },
    {
      id: "4",
      category: "Transportation",
      amount: 150,
      period: "monthly",
      spent: 45.2,
    },
  ])

  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([
    {
      id: "1",
      name: "Vacation Fund",
      targetAmount: 2000,
      currentAmount: 750,
      targetDate: new Date("2025-08-01"),
      color: "#0088FE",
    },
    {
      id: "2",
      name: "Emergency Fund",
      targetAmount: 10000,
      currentAmount: 3500,
      targetDate: new Date("2025-12-31"),
      color: "#00C49F",
    },
    {
      id: "3",
      name: "New Laptop",
      targetAmount: 1500,
      currentAmount: 500,
      targetDate: new Date("2025-06-30"),
      color: "#FFBB28",
    },
  ])

  const [activeView, setActiveView] = useState<string>("dashboard")

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
          />
        )
      case "expenses":
        return (
          <ExpensesView
            expenses={expenses}
            onAddExpense={addExpense}
            onDeleteExpense={deleteExpense}
          />
        )
      case "income":
        return (
          <IncomeView
            incomes={incomes}
            onAddIncome={addIncome}
            onDeleteIncome={deleteIncome}
          />
        )
      case "budget":
        return (
          <BudgetView
            budgets={budgets}
            onAddBudget={addBudget}
            onDeleteBudget={deleteBudget}
          />
        )
      case "savings":
        return (
          <SavingsView
            savingsGoals={savingsGoals}
            onAddSavingsGoal={addSavingsGoal}
            onUpdateSavingsGoal={updateSavingsGoal}
            onDeleteSavingsGoal={deleteSavingsGoal}
          />
        )
      default:
        return null
    }
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <FinanceSidebar activeView={activeView} onViewChange={setActiveView} />
        <div className="flex-1 flex flex-col">
          <FinanceHeader user={user} />
          <main className="flex-1 overflow-auto p-6">{renderContent()}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}

