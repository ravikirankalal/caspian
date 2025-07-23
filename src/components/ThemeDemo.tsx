import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ThemeToggle } from './ThemeToggle';

export const ThemeDemo: React.FC = () => {
  const { theme } = useTheme();

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Theme Demo</CardTitle>
        <CardDescription>
          Current theme: <strong>{theme}</strong>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          This card demonstrates how the theme system works. The background, 
          text colors, and borders will automatically adapt based on the current theme.
        </p>
        <div className="flex flex-col space-y-2">
          <p className="text-xs text-muted-foreground">
            • Light mode: Uses light background with dark text
          </p>
          <p className="text-xs text-muted-foreground">
            • Dark mode: Uses dark background with light text
          </p>
          <p className="text-xs text-muted-foreground">
            • System: Follows your system's preference
          </p>
        </div>
        <ThemeToggle className="w-full" />
      </CardContent>
    </Card>
  );
};
