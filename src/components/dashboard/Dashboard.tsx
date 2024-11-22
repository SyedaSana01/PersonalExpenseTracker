import React, { useState } from 'react';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';

import {
  LayoutDashboard,
  PiggyBank,
  BarChart3,
  Settings,
  LogOut,
  Moon,
  Sun,
} from 'lucide-react';
import { Overview } from './Overview';
import { Goals } from './Goals';
import { Analytics } from './Analytics';
import { Settings as SettingsPanel } from './Settings';
import { useStore } from '../../store';

export const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { logout, user } = useAuth0();
  const { preferences, toggleDarkMode } = useStore();

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview />;
      case 'transactions':
        return <Transactions />;
      case 'goals':
        return <Goals />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <SettingsPanel />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className={`min-h-screen ${preferences.darkMode ? 'dark' : ''}`}>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
        {/* Sidebar */}
        <div className="w-64 bg-white dark:bg-gray-800 shadow-sm">
          <div className="flex flex-col h-full">
            <div className="p-4">
              <h1 className="text-xl font-bold text-gray-800 dark:text-white">
                FinanceManager
              </h1>
            </div>

            <nav className="flex-1 p-4">
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg ${
                      activeTab === 'overview'
                        ? 'bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <LayoutDashboard className="h-5 w-5" />
                    <span>Overview</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('transactions')}
                    className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg ${
                      activeTab === 'transactions'
                        ? 'bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <BarChart3 className="h-5 w-5" />
                    <span>Transactions</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('goals')}
                    className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg ${
                      activeTab === 'goals'
                        ? 'bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <PiggyBank className="h-5 w-5" />
                    <span>Saving Goals</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('analytics')}
                    className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg ${
                      activeTab === 'analytics'
                        ? 'bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <BarChart3 className="h-5 w-5" />
                    <span>Analytics</span>
                  </button>
                </li>
              </ul>
            </nav>

            <div className="p-4 border-t dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={toggleDarkMode}
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  {preferences.darkMode ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  <Settings className="h-5 w-5" />
                </button>
                <button
                  onClick={() => logout()}
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
              <div className="flex items-center space-x-3">
                <img
                  src={user?.picture}
                  alt={user?.name}
                  className="h-8 w-8 rounded-full"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <main className="p-6">{renderContent()}</main>
        </div>
      </div>
    </div>
  );
};