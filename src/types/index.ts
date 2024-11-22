export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
}

export interface SavingGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  createdAt: string;
}

export interface Budget {
  category: string;
  limit: number;
  spent: number;
}

export interface UserPreferences {
  darkMode: boolean;
  currency: string;
  notifications: boolean;
}