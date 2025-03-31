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

export type Expense = {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: Date;
};

export type Income = {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: Date;
};

export type Budget = {
  id: string;
  category: string;
  amount: number;
  spent: number;
};

export type SavingsGoal = {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date;
};

export function FinanceDashboard() {
  const [activeView, setActiveView] = useState('dashboard');
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

  const addIncome = (income: Omit<Income, 'id'>) => {
    const newIncome = {
      ...income,
      id: Math.random().toString(36).substr(2, 9),
    };
    setIncomes([...incomes, newIncome]);
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
        return <ExpensesView expenses={expenses} addExpense={addExpense} />;
      case 'income':
        return <IncomeView incomes={incomes} addIncome={addIncome} />;
      case 'budgeting':
        return <BudgetView budgets={budgets} setActiveView={setActiveView} />;
      case 'savings':
        return (
          <SavingsView
            goals={savingsGoals}
            updateSavingsGoal={updateSavingsGoal}
            setActiveView={setActiveView}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <FinanceSidebar activeView={activeView} setActiveView={setActiveView} />
        <div className="flex-1 min-w-0">
          <FinanceHeader activeView={activeView} />
          <main className=" p-6 w-full">{renderView()}</main>
        </div>
      </div>
    </SidebarProvider>
  );
} 