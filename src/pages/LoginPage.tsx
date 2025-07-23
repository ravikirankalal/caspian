import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';

const LoginPage: React.FC = () => {
  const { signInWithGoogle, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/home');
    }
  }, [user, navigate]);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      // Navigation will be handled by the useEffect when user state changes
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground px-4">
      <div className="text-center space-y-6 max-w-md w-full">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Welcome to Caspian</h1>
          <p className="text-muted-foreground text-lg">Please sign in to continue</p>
        </div>
        <Button 
          onClick={handleGoogleSignIn} 
          size="lg"
          className="w-full"
        >
          Sign in with Google
        </Button>
      </div>
    </div>
  );
};

export default LoginPage;
