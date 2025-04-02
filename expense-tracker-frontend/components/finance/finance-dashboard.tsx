'use client';

import { useState } from 'react';
import { FinanceSidebar } from '@/components/layout/finance-sidebar';
import { FinanceHeader } from '@/components/layout/finance-header';
import { DashboardView } from '@/components/finance/dashboard/dashboard-view';
import { ExpensesView } from '@/components/finance/expenses/expenses-view';
import { IncomeView } from '@/components/finance/income/income-view';
import { BudgetView } from '@/components/finance/budget/budget-view';
import { SavingsView } from '@/components/finance/savings/savings-view';
import { SidebarProvider } from '@/components/ui/sidebar';
import type { Expense, Income, Budget, SavingsGoal } from '@/types/finance';

export function FinanceDashboard() {
  const [activeView, setActiveView] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense = {
      ...expense,
      id: Math.random().toString(36).substr(2, 9),
    };
    setExpenses([...expenses, newExpense]);
  };

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  const addIncome = (income: Omit<Income, 'id'>) => {
    const newIncome = {
      ...income,
      id: Math.random().toString(36).substr(2, 9),
      source: income.category, // Using category as source for now
    };
    setIncomes([...incomes, newIncome]);
  };

  const deleteIncome = (id: string) => {
    setIncomes(incomes.filter(income => income.id !== id));
  };

  const addBudget = (budget: Omit<Budget, 'id' | 'spent'>) => {
    const newBudget = {
      ...budget,
      id: Math.random().toString(36).substr(2, 9),
      spent: 0,
    };
    setBudgets([...budgets, newBudget]);
  };

  const deleteBudget = (id: string) => {
    setBudgets(budgets.filter(budget => budget.id !== id));
  };

  const addSavingsGoal = (goal: Omit<SavingsGoal, 'id'>) => {
    const newGoal = {
      ...goal,
      id: Math.random().toString(36).substr(2, 9),
    };
    setSavingsGoals([...savingsGoals, newGoal]);
  };

  const deleteSavingsGoal = (id: string) => {
    setSavingsGoals(savingsGoals.filter(goal => goal.id !== id));
  };

  const updateSavingsGoal = (id: string, amount: number) => {
    setSavingsGoals(
      savingsGoals.map((goal) =>
        goal.id === id ? { ...goal, currentAmount: amount } : goal
      )
    );
  };

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
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
        );
      case 'expenses':
        return (
          <ExpensesView 
            expenses={expenses} 
            onAdd={addExpense}
            onDelete={deleteExpense}
          />
        );
      case 'income':
        return (
          <IncomeView 
            incomes={incomes} 
            onAdd={addIncome}
            onDelete={deleteIncome}
          />
        );
      case 'budgeting':
        return (
          <BudgetView 
            budgets={budgets} 
            onAdd={addBudget}
            onDelete={deleteBudget}
          />
        );
      case 'savings':
        return (
          <SavingsView
            goals={savingsGoals}
            onAdd={addSavingsGoal}
            onUpdate={updateSavingsGoal}
            onDelete={deleteSavingsGoal}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <FinanceSidebar 
          activeView={activeView} 
          setActiveView={setActiveView}
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
        />
        <div className={`flex-1 min-w-0 transition-all duration-300 ${isSidebarCollapsed ? 'ml-[80px]' : 'ml-[320px]'}`}>
          <FinanceHeader 
            activeView={activeView} 
            isSidebarCollapsed={isSidebarCollapsed}
            setIsSidebarCollapsed={setIsSidebarCollapsed}
          />
          <main className="p-4 md:p-6 w-full mt-[80px]">{renderView()}</main>
        </div>
      </div>
    </SidebarProvider>
  );
} 