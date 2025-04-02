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
  source: string;
};

export type Budget = {
  id: string;
  category: string;
  amount: number;
  spent: number;
  period: 'weekly' | 'monthly' | 'yearly';
};

export type SavingsGoal = {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date;
  targetDate: Date;
  color: string;
}; 