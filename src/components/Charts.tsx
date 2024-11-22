import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { useStore } from '../store';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export const Charts: React.FC = () => {
  const { expenses, budgets } = useStore();

  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const categories = Object.keys(budgets);
  const spentData = categories.map((category) => categoryTotals[category] || 0);
  const budgetData = categories.map((category) => budgets[category]);

  const barData = {
    labels: categories,
    datasets: [
      {
        label: 'Spent',
        data: spentData,
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
        borderColor: 'rgb(99, 102, 241)',
        borderWidth: 1,
      },
      {
        label: 'Budget',
        data: budgetData,
        backgroundColor: 'rgba(209, 213, 219, 0.5)',
        borderColor: 'rgb(156, 163, 175)',
        borderWidth: 1,
      },
    ],
  };

  const pieData = {
    labels: categories,
    datasets: [
      {
        data: spentData,
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

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium mb-4">Budget vs. Spending</h3>
        <Bar
          data={barData}
          options={{
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          }}
        />
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Spending Distribution</h3>
        <Pie data={pieData} />
      </div>
    </div>
  );
};