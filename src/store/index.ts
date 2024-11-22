import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Transaction, SavingGoal, Budget, UserPreferences } from '../types';

interface FinanceStore {
  transactions: Transaction[];
  savingGoals: SavingGoal[];
  budgets: Budget[];
  preferences: UserPreferences;
  totalBalance: number;
  addTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  addSavingGoal: (goal: SavingGoal) => void;
  updateSavingGoal: (id: string, amount: number) => void;
  deleteSavingGoal: (id: string) => void;
  updateBudget: (category: string, limit: number) => void;
  toggleDarkMode: () => void;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
}

export const useStore = create<FinanceStore>()(
  persist(
    (set) => ({
      transactions: [],
      savingGoals: [],
      budgets: [
        { category: 'food', limit: 500, spent: 0 },
        { category: 'entertainment', limit: 200, spent: 0 },
        { category: 'transportation', limit: 300, spent: 0 },
        { category: 'utilities', limit: 400, spent: 0 },
        { category: 'shopping', limit: 300, spent: 0 },
        { category: 'other', limit: 200, spent: 0 },
      ],
      preferences: {
        darkMode: false,
        currency: 'USD',
        notifications: true,
      },
      totalBalance: 0,

      addTransaction: (transaction) =>
        set((state) => {
          const newBalance =
            state.totalBalance +
            (transaction.type === 'income' ? transaction.amount : -transaction.amount);

          const updatedBudgets = state.budgets.map((budget) => {
            if (
              transaction.type === 'expense' &&
              budget.category === transaction.category
            ) {
              return { ...budget, spent: budget.spent + transaction.amount };
            }
            return budget;
          });

          return {
            transactions: [...state.transactions, transaction],
            totalBalance: newBalance,
            budgets: updatedBudgets,
          };
        }),

      deleteTransaction: (id) =>
        set((state) => {
          const transaction = state.transactions.find((t) => t.id === id);
          if (!transaction) return state;

          const newBalance =
            state.totalBalance +
            (transaction.type === 'income' ? -transaction.amount : transaction.amount);

          const updatedBudgets = state.budgets.map((budget) => {
            if (
              transaction.type === 'expense' &&
              budget.category === transaction.category
            ) {
              return { ...budget, spent: budget.spent - transaction.amount };
            }
            return budget;
          });

          return {
            transactions: state.transactions.filter((t) => t.id !== id),
            totalBalance: newBalance,
            budgets: updatedBudgets,
          };
        }),

      updateTransaction: (id, updatedTransaction) =>
        set((state) => ({
          transactions: state.transactions.map((transaction) =>
            transaction.id === id
              ? { ...transaction, ...updatedTransaction }
              : transaction
          ),
        })),

      addSavingGoal: (goal) =>
        set((state) => ({
          savingGoals: [...state.savingGoals, goal],
        })),

      updateSavingGoal: (id, amount) =>
        set((state) => ({
          savingGoals: state.savingGoals.map((goal) =>
            goal.id === id
              ? { ...goal, currentAmount: goal.currentAmount + amount }
              : goal
          ),
        })),

      deleteSavingGoal: (id) =>
        set((state) => ({
          savingGoals: state.savingGoals.filter((goal) => goal.id !== id),
        })),

      updateBudget: (category, limit) =>
        set((state) => ({
          budgets: state.budgets.map((budget) =>
            budget.category === category ? { ...budget, limit } : budget
          ),
        })),

      toggleDarkMode: () =>
        set((state) => ({
          preferences: {
            ...state.preferences,
            darkMode: !state.preferences.darkMode,
          },
        })),

      updatePreferences: (prefs) =>
        set((state) => ({
          preferences: { ...state.preferences, ...prefs },
        })),
    }),
    {
      name: 'finance-store',
    }
  )
);