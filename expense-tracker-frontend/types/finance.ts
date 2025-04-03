export type Expense = {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: Date;
};

export enum IncomeCategory {
  SALARY = "Salary",
  BUSINESS = "Business",
  INVESTMENTS = "Investments",
  FREELANCING = "Freelancing",
  RENTAL = "Rental",
  DIVIDENDS = "Dividends",
  INTEREST = "Interest",
  GIFTS = "Gifts",
  OTHER = "Other"
}

export type Income = {
  id: string;
  description: string;
  amount: number;
  category: IncomeCategory;
  date: Date;
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
  target_amount: number;
  initial_amount: number;
  date: Date;
  color: string;
}; 