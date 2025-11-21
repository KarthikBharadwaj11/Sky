'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // Initialize with saved theme or default to dark to prevent flash
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') as Theme;
      if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme;
      }
    }
    return 'dark';
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check for saved theme preference or default to 'dark'
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      setTheme(savedTheme);
    } else {
      // Default to dark mode for new users
      setTheme('dark');
      localStorage.setItem('theme', 'dark');
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      // Apply theme to document root
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
      
      // Update CSS custom properties
      const root = document.documentElement;
      
      if (theme === 'light') {
        // Light mode colors: warm whites with blueish/purple accents
        root.style.setProperty('--background-primary', '#fefcfb');
        root.style.setProperty('--background-secondary', '#faf8f7');
        root.style.setProperty('--background-tertiary', '#f5f3f2');
        root.style.setProperty('--background-card', '#ffffff');
        root.style.setProperty('--background-modal', '#ffffff');
        
        root.style.setProperty('--text-primary', '#0f0e0d');
        root.style.setProperty('--text-secondary', '#2c2925');
        root.style.setProperty('--text-tertiary', '#4a453f');
        root.style.setProperty('--text-muted', '#6b6460');
        root.style.setProperty('--text-accent', '#4f46e5');
        
        root.style.setProperty('--primary-blue', '#4f46e5');
        root.style.setProperty('--primary-purple', '#7c3aed');
        root.style.setProperty('--accent-violet', '#8b5cf6');
        root.style.setProperty('--success', '#059669');
        root.style.setProperty('--error', '#dc2626');
        root.style.setProperty('--warning', '#d97706');
        
        root.style.setProperty('--border-primary', '#e7e3e1');
        root.style.setProperty('--border-secondary', '#d1cbc7');
        root.style.setProperty('--glass-border', '#e7e3e1');
        
        root.style.setProperty('--gradient-primary', 'linear-gradient(135deg, #4f46e5, #7c3aed)');
        root.style.setProperty('--gradient-secondary', 'linear-gradient(135deg, #7c3aed, #8b5cf6)');
        root.style.setProperty('--gradient-accent', 'linear-gradient(135deg, #6366f1, #8b5cf6)');
        
        root.style.setProperty('--shadow-sm', '0 1px 2px 0 rgba(79, 70, 229, 0.05)');
        root.style.setProperty('--shadow-md', '0 4px 6px -1px rgba(79, 70, 229, 0.08)');
        root.style.setProperty('--shadow-lg', '0 10px 15px -3px rgba(79, 70, 229, 0.1)');
        root.style.setProperty('--shadow-xl', '0 20px 25px -5px rgba(79, 70, 229, 0.12)');
        
        // Glass morphism for light mode - warm white with subtle purple tint
        root.style.setProperty('--glass-bg', 'rgba(254, 252, 251, 0.95)');
        root.style.setProperty('--glass-border-color', 'rgba(79, 70, 229, 0.1)');
        
        // Chart colors for light mode
        root.style.setProperty('--chart-grid', '#e7e3e1');
        root.style.setProperty('--chart-axis', '#6b6460');
        root.style.setProperty('--chart-tooltip-bg', 'rgba(254, 252, 251, 0.98)');
        root.style.setProperty('--chart-tooltip-border', '#e7e3e1');
        root.style.setProperty('--chart-tooltip-text', '#1e1b1a');
        
      } else {
        // Dark mode colors - enhanced for better contrast
        root.style.setProperty('--background-primary', '#020617');
        root.style.setProperty('--background-secondary', '#0f172a');
        root.style.setProperty('--background-tertiary', '#1e293b');
        root.style.setProperty('--background-card', '#0f172a');
        root.style.setProperty('--background-modal', '#0f172a');
        
        root.style.setProperty('--text-primary', '#f8fafc');
        root.style.setProperty('--text-secondary', '#e2e8f0');
        root.style.setProperty('--text-tertiary', '#cbd5e1');
        root.style.setProperty('--text-muted', '#94a3b8');
        root.style.setProperty('--text-accent', '#60a5fa');
        
        root.style.setProperty('--primary-blue', '#3b82f6');
        root.style.setProperty('--primary-purple', '#8b5cf6');
        root.style.setProperty('--accent-violet', '#a855f7');
        root.style.setProperty('--success', '#22c55e');
        root.style.setProperty('--error', '#ef4444');
        root.style.setProperty('--warning', '#f59e0b');
        
        root.style.setProperty('--border-primary', '#334155');
        root.style.setProperty('--border-secondary', '#475569');
        root.style.setProperty('--glass-border', '#334155');
        
        root.style.setProperty('--gradient-primary', 'linear-gradient(135deg, #3b82f6, #8b5cf6)');
        root.style.setProperty('--gradient-secondary', 'linear-gradient(135deg, #8b5cf6, #a855f7)');
        root.style.setProperty('--gradient-accent', 'linear-gradient(135deg, #6366f1, #8b5cf6)');
        
        root.style.setProperty('--shadow-sm', '0 1px 2px 0 rgba(0, 0, 0, 0.3)');
        root.style.setProperty('--shadow-md', '0 4px 6px -1px rgba(0, 0, 0, 0.4)');
        root.style.setProperty('--shadow-lg', '0 10px 15px -3px rgba(0, 0, 0, 0.5)');
        root.style.setProperty('--shadow-xl', '0 20px 25px -5px rgba(0, 0, 0, 0.6)');
        
        // Glass morphism for dark mode - more opaque for better contrast
        root.style.setProperty('--glass-bg', 'rgba(15, 23, 42, 0.9)');
        root.style.setProperty('--glass-border-color', 'rgba(148, 163, 184, 0.2)');
        
        // Chart colors for dark mode
        root.style.setProperty('--chart-grid', '#475569');
        root.style.setProperty('--chart-axis', '#94a3b8');
        root.style.setProperty('--chart-tooltip-bg', 'rgba(15, 23, 42, 0.98)');
        root.style.setProperty('--chart-tooltip-border', '#475569');
        root.style.setProperty('--chart-tooltip-text', '#f8fafc');
      }
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Prevent flash of unstyled content
  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};