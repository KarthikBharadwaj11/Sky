'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  balance: number;
  onboardingComplete?: boolean;
  profile?: {
    fullName: string;
    email: string;
    dateOfBirth: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    mobile: string;
  };
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateBalance: (newBalance: number) => void;
  completeOnboarding: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// In-memory users storage (no persistence)
let inMemoryUsers: Array<{ id: string; username: string; email: string; password: string; balance: number; onboardingComplete: boolean }> = [];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('sky_session');
    if (saved) {
      setUser(JSON.parse(saved));
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Demo mode: Accept any credentials without validation
    const userSession = {
      id: Date.now().toString(),
      username: username || 'DemoUser',
      email: `${username}@demo.com`,
      balance: 10000,
      onboardingComplete: true // Skip onboarding on login
    };
    setUser(userSession);
    localStorage.setItem('sky_session', JSON.stringify(userSession));
    return true;
  };

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    // Demo mode: Accept any credentials without validation
    const userSession = {
      id: Date.now().toString(),
      username: username || 'DemoUser',
      email: email || 'demo@demo.com',
      balance: 10000,
      onboardingComplete: false
    };
    setUser(userSession);
    localStorage.setItem('sky_session', JSON.stringify(userSession));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sky_session');
  };

  const updateBalance = (newBalance: number) => {
    if (user) {
      const updatedUser = { ...user, balance: newBalance };
      setUser(updatedUser);
      localStorage.setItem('sky_session', JSON.stringify(updatedUser));

      // Update in-memory storage
      const userIndex = inMemoryUsers.findIndex((u) => u.id === user.id);
      if (userIndex !== -1) {
        inMemoryUsers[userIndex].balance = newBalance;
      }
    }
  };

  const completeOnboarding = () => {
    if (user) {
      const updatedUser = { ...user, onboardingComplete: true };
      setUser(updatedUser);
      localStorage.setItem('sky_session', JSON.stringify(updatedUser));

      // Update in-memory storage
      const userIndex = inMemoryUsers.findIndex((u) => u.id === user.id);
      if (userIndex !== -1) {
        inMemoryUsers[userIndex].onboardingComplete = true;
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateBalance, completeOnboarding }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}