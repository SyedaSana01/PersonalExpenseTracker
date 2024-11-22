import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Toaster } from 'react-hot-toast';
import { Dashboard } from './components/dashboard/Dashboard';
import { useStore } from './store';

function App() {
  const { isAuthenticated, isLoading } = useAuth0();
  const preferences = useStore((state) => state.preferences);

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        preferences?.darkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className={preferences?.darkMode ? 'dark' : ''}>
      <Toaster position="top-right" />
      {isAuthenticated ? <Dashboard /> : <LoginPage />}
    </div>
  );
}

export default App;