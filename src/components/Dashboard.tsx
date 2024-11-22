import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import {
  BarChart3,
  PieChart,
  Plus,
  LogOut,
  Download,
  AlertCircle,
  User,
} from 'lucide-react';
import { ExpenseForm } from './ExpenseForm';
import { ExpenseList } from './ExpenseList';
import { Charts } from './Charts';
import { useStore } from '../store';
import { exportToExcel, exportToPDF } from '../utils/export';

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth0();
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const { expenses, totalBudget, totalSpent } = useStore();

  const budgetPercentage = (totalSpent / totalBudget) * 100;
  const isOverBudget = budgetPercentage > 90;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-semibold">ExpenseTracker</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <img
                  src={user?.picture}
                  alt={user?.name}
                  className="h-8 w-8 rounded-full"
                />
                <span className="text-sm font-medium">{user?.name}</span>
              </div>
              <button
                onClick={() => logout()}
                className="text-gray-600 hover:text-gray-900"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Budget Alert */}
        {isOverBudget && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <p className="ml-3 text-red-700">
                You're {budgetPercentage > 100 ? 'over' : 'close to'} your budget limit!
              </p>
            </div>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-gray-500 text-sm font-medium">Total Budget</h3>
            <p className="text-2xl font-bold text-gray-900">${totalBudget}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-gray-500 text-sm font-medium">Total Spent</h3>
            <p className="text-2xl font-bold text-gray-900">${totalSpent}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-gray-500 text-sm font-medium">Remaining</h3>
            <p className="text-2xl font-bold text-gray-900">
              ${totalBudget - totalSpent}
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Recent Expenses</h2>
              <div className="space-x-2">
                <button
                  onClick={() => exportToExcel(expenses)}
                  className="p-2 text-gray-600 hover:text-gray-900"
                  title="Export to Excel"
                >
                  <Download className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setShowExpenseForm(true)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition flex items-center"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Expense
                </button>
              </div>
            </div>
            <ExpenseList />
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6">Spending Overview</h2>
              <Charts />
            </div>
          </div>
        </div>
      </main>

      {showExpenseForm && (
        <ExpenseForm onClose={() => setShowExpenseForm(false)} />
      )}
    </div>
  );
};