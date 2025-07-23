import React from 'react';
import { Button } from './ui/button';
import { useTheme } from '../context/ThemeContext';

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className }) => {
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  const getThemeLabel = () => {
    switch (theme) {
      case 'light':
        return '☀️ Light';
      case 'dark':
        return '🌙 Dark';
      case 'system':
        return '💻 System';
      default:
        return 'Theme';
    }
  };

  return (
    <Button 
      onClick={cycleTheme} 
      variant="outline" 
      size="sm"
      className={className}
    >
      {getThemeLabel()}
    </Button>
  );
};

