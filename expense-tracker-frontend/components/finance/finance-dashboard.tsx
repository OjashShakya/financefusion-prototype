'use client';

import { useState, useEffect } from 'react';
import { FinanceSidebar } from '@/components/layout/finance-sidebar';
import { FinanceHeader } from '@/components/layout/finance-header';
import { DashboardView } from '@/components/finance/dashboard/dashboard-view';
import { ExpensesView } from '@/components/finance/expenses/expenses-view';
import { IncomeView } from '@/components/finance/income/income-view';
import { BudgetView } from '@/components/finance/budget/budget-view';
import { SavingsView } from '@/components/finance/savings/savings-view';
import { SidebarProvider } from '@/components/ui/sidebar';
import type { Expense, Income, Budget, SavingsGoal } from '@/types/finance';
import { getIncomes, createIncome, deleteIncome } from '@/lib/api/income';
import { savingsApi } from '@/lib/api/savings';
import { useAuth } from '@/app/context/AuthContext';
import { toast } from '@/components/ui/use-toast';

export function FinanceDashboard() {
  const [activeView, setActiveView] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchIncomes();
      fetchSavingsGoals();
    }
  }, [user]);

  const fetchIncomes = async () => {
    try {
      setIsLoading(true);
      const data = await getIncomes();
      setIncomes(data);
    } catch (error: any) {
      console.error('Error fetching incomes:', error);
      toast({
        title: "Error",
        description: "Failed to load incomes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSavingsGoals = async () => {
    try {
      setIsLoading(true);
      const data = await savingsApi.getAllSavings();
      setSavingsGoals(data);
    } catch (error: any) {
      console.error('Error fetching savings goals:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to load savings goals. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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

  const addIncome = async (income: Omit<Income, 'id'>) => {
    try {
      const newIncome = await createIncome(income);
      setIncomes(prev => [newIncome, ...prev]);
      toast({
        title: "Success",
        description: "Income added successfully",
      });
    } catch (error: any) {
      console.error('Error adding income:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add income. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteIncome = async (id: string) => {
    try {
      await deleteIncome(id);
      setIncomes(prev => prev.filter(income => income.id !== id));
      toast({
        title: "Success",
        description: "Income deleted successfully",
      });
    } catch (error: any) {
      console.error('Error deleting income:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete income. Please try again.",
        variant: "destructive",
      });
    }
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

  const addSavingsGoal = async (goal: Omit<SavingsGoal, "id">) => {
    try {
      console.log('Adding savings goal:', goal);

      // Validate required fields
      if (!goal.name?.trim()) {
        toast({
          title: "Error",
          description: "Goal name is required",
          variant: "destructive",
        });
        return;
      }
      if (isNaN(goal.target_amount) || goal.target_amount <= 0) {
        toast({
          title: "Error",
          description: "Target amount must be greater than 0",
          variant: "destructive",
        });
        return;
      }
      if (isNaN(goal.initial_amount) || goal.initial_amount < 0) {
        toast({
          title: "Error",
          description: "Initial amount cannot be negative",
          variant: "destructive",
        });
        return;
      }

      // Check for duplicate names
      if (savingsGoals.some(g => g.name.toLowerCase() === goal.name.toLowerCase())) {
        toast({
          title: "Error",
          description: "A goal with this name already exists",
          variant: "destructive",
        });
        return;
      }

      // Validate initial amount is less than target amount
      if (goal.initial_amount >= goal.target_amount) {
        toast({
          title: "Error",
          description: "Initial amount must be less than target amount",
          variant: "destructive",
        });
        return;
      }

      // Validate date is in the future
      if (goal.date <= new Date()) {
        toast({
          title: "Error",
          description: "Target date must be in the future",
          variant: "destructive",
        });
        return;
      }

      const newGoal = await savingsApi.createSavings({
        name: goal.name.trim(),
        target_amount: Number(goal.target_amount),
        initial_amount: Number(goal.initial_amount),
        date: goal.date.toISOString(),
        color: goal.color || "#0088FE"
      });

      console.log('Created new savings goal:', newGoal);
      setSavingsGoals(prev => [...prev, newGoal]);
      toast({
        title: "Success",
        description: "Savings goal created successfully",
      });
    } catch (error: any) {
      console.error('Error creating savings goal:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create savings goal. Please try again.",
        variant: "destructive",
      });
    }
  };

  const deleteSavingsGoal = async (id: string) => {
    try {
      await savingsApi.deleteSavings(id);
      setSavingsGoals(prev => prev.filter(goal => goal.id !== id));
      toast({
        title: "Success",
        description: "Savings goal deleted successfully",
      });
    } catch (error: any) {
      console.error('Error deleting savings goal:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete savings goal. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateSavingsGoal = async (id: string, amount: number) => {
    try {
      if (!id) {
        throw new Error('Savings goal ID is required');
      }

      if (!amount || amount <= 0) {
        toast({
          title: "Error",
          description: "Please enter a valid amount greater than 0",
          variant: "destructive",
        });
        return;
      }

      const updatedGoal = await savingsApi.updateSavings(id, {
        amount,
        date: new Date().toISOString()
      });

      setSavingsGoals(prev => prev.map(goal => 
        goal.id === id 
          ? {
              ...goal,
              initial_amount: updatedGoal.initial_amount
            }
          : goal
      ));

      toast({
        title: "Success",
        description: `$${amount.toFixed(2)} added to ${updatedGoal.name}`,
      });
    } catch (error: any) {
      console.error('Error updating savings goal:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update savings goal. Please try again.",
        variant: "destructive",
      });
    }
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
            onDelete={handleDeleteIncome}
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

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