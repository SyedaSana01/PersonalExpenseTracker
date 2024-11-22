import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { useStore } from '../../store';
import { startOfMonth, endOfMonth, eachDayOfInterval, format } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export const Analytics: React.FC = () => {
  const { transactions, budgets } = useStore();
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  // Calculate spending trends
  const currentDate = new Date();
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const dailyExpenses = daysInMonth.map(day => {
    const dayExpenses = transactions
      .filter(t => t.type === 'expense' && new Date(t.date).toDateString() === day.toDateString())
      .reduce((sum, t) => sum + t.amount, 0);
    return { date: format(day, 'MMM d'), amount: dayExpenses };
  });

  const spendingByCategory = Object.entries(
    transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>)
  );

  const lineChartData = {
    labels: dailyExpenses.map(d => d.date),
    datasets: [
      {
        label: 'Daily Expenses',
        data: dailyExpenses.map(d => d.amount),
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
        tension: 0.4,
      },
    ],
  };

  const pieChartData = {
    labels: spendingByCategory.map(([category]) => category),
    datasets: [
      {
        data: spendingByCategory.map(([, amount]) => amount),
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(147, 51, 234, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(248, 113, 113, 0.8)',
          'rgba(251, 146, 60, 0.8)',
        ],
      },
    ],
  };

  const budgetComparisonData = {
    labels: budgets.map(b => b.category),
    datasets: [
      {
        label: 'Budget',
        data: budgets.map(b => b.limit),
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
      },
      {
        label: 'Spent',
        data: budgets.map(b => b.spent),
        backgroundColor: 'rgba(248, 113, 113, 0.5)',
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Time Frame Selector */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
        <div className="flex space-x-4">
          {(['daily', 'weekly', 'monthly'] as const).map(option => (
            <button
              key={option}
              onClick={() => setTimeframe(option)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                timeframe === option
                  ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spending Trends */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Spending Trends</h2>
          <Line
            data={lineChartData}
            options={{
              responsive: true,
              scales: {
                y: {
                  beginAtZero: true,
                  grid: {
                    color: 'rgba(156, 163, 175, 0.1)',
                  },
                },
                x: {
                  grid: {
                    display: false,
                  },
                },
              },
            }}
          />
        </div>

        {/* Category Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Spending by Category</h2>
          <Pie data={pieChartData} />
        </div>

        {/* Budget vs Actual */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Budget vs Actual Spending</h2>
          <Bar
            data={budgetComparisonData}
            options={{
              responsive: true,
              scales: {
                y: {
                  beginAtZero: true,
                  grid: {
                    color: 'rgba(156, 163, 175, 0.1)',
                  },
                },
                x: {
                  grid: {
                    display: false,
                  },
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};