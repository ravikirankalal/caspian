import React from 'react';
import { useAuth } from '../context/AuthContext';

import SidebarLayout from '../components/SidebarLayout';

const HomePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <SidebarLayout>
      <div className="max-w-4xl mx-auto">
        <div className="bg-card rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-card-foreground mb-4">Welcome to Caspian</h1>
          <p className="text-lg text-muted-foreground mb-2">Hello, {user?.displayName || user?.email || 'User'}!</p>
          <p className="text-muted-foreground">You are successfully logged in and viewing the protected home page.</p>
          
          <div className="mt-8 p-6 bg-accent rounded-lg border border-border">
            <h2 className="text-lg font-semibold text-accent-foreground mb-2">Getting Started</h2>
            <p className="text-accent-foreground">Welcome to your dashboard! Use the sidebar navigation to explore different sections of the application.</p>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default HomePage;
