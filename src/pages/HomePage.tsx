import React from 'react';
import { useAuth } from '../context/AuthContext';

import SidebarLayout from '../components/SidebarLayout';

const HomePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <SidebarLayout>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Caspian</h1>
          <p className="text-lg text-gray-600 mb-2">Hello, {user?.displayName || user?.email || 'User'}!</p>
          <p className="text-gray-500">You are successfully logged in and viewing the protected home page.</p>
          
          <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
            <h2 className="text-lg font-semibold text-blue-900 mb-2">Getting Started</h2>
            <p className="text-blue-700">Welcome to your dashboard! Use the sidebar navigation to explore different sections of the application.</p>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default HomePage;
