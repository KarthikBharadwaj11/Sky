'use client';

import Link from 'next/link';
import { useAuth } from '../auth/AuthProvider';
import { useTheme } from '../theme/ThemeProvider';
import { Sun, Moon } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b-2 navbar-bg" style={{ 
      backdropFilter: 'blur(25px)', 
      boxShadow: 'var(--shadow-xl), 0 0 30px color-mix(in srgb, var(--primary-blue) 15%, transparent)', 
      borderBottomColor: 'var(--primary-blue)',
      borderImage: 'linear-gradient(90deg, var(--primary-blue), var(--primary-purple)) 1'
    }}>
      <div className="max-w-8xl mx-auto px-6">
        <div className="flex justify-between items-center h-20 gap-6">
          {/* Logo Section - Left */}
          <div className="flex items-center flex-shrink-0">
            <Link
              href="/landing"
              className="text-2xl font-bold text-gradient hover:scale-105 transition-all duration-300 gradient-shift"
            >
              Sky
            </Link>
          </div>

          {user ? (
            <>
              {/* Search Bar - Center */}
              <div className="hidden lg:flex flex-1 max-w-2xl mx-6">
                <div className="relative w-full">
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-tertiary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search for stocks, ETFs, or assets..."
                    disabled
                    className="w-full pl-10 pr-4 py-2 rounded-xl text-sm transition-all duration-300 focus:outline-none"
                    style={{
                      background: 'var(--glass-bg)',
                      border: '1px solid var(--glass-border-color)',
                      color: 'var(--text-primary)',
                      cursor: 'not-allowed',
                      opacity: '0.7'
                    }}
                  />
                </div>
              </div>

              {/* User Controls - Right */}
              <div className="hidden lg:flex items-center space-x-4 flex-shrink-0">
                <Link href="/overview" className="nav-link px-4 py-2">
                  Overview
                </Link>
                <Link href="/search" className="nav-link px-4 py-2">
                  Search
                </Link>
                <Link href="/market" className="nav-link px-4 py-2">
                  Market
                </Link>
                <Link href="/options" className="nav-link px-4 py-2">
                  Options
                </Link>
                <Link href="/copy-trading" className="nav-link px-4 py-2">
                  Copy Trading
                </Link>
                <Link href="/paper-trading" className="nav-link px-4 py-2">
                  Paper Trading
                </Link>
                <Link href="/social-feed" className="nav-link px-4 py-2">
                  Social
                </Link>
                <Link href="/orders" className="nav-link px-4 py-2">
                  Orders
                </Link>
                <Link href="/profile" className="nav-link px-4 py-2">
                  Profile
                </Link>

                <button
                  onClick={toggleTheme}
                  className="p-3 rounded-xl transition-all duration-300 hover:scale-110"
                  style={{
                    background: 'var(--glass-bg)',
                    border: '2px solid var(--glass-border-color)',
                    color: 'var(--text-primary)'
                  }}
                  title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                >
                  {theme === 'light' ? (
                    <Moon className="w-5 h-5" />
                  ) : (
                    <Sun className="w-5 h-5" />
                  )}
                </button>

                <button
                  onClick={logout}
                  className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-1"
                >
                  Logout
                </button>
              </div>

              {/* Mobile Menu Button - Only visible on smaller screens */}
              <div className="lg:hidden">
                <button className="p-3 rounded-xl" style={{ background: 'var(--glass-bg)', border: '2px solid var(--glass-border-color)' }}>
                  <svg className="w-6 h-6" style={{ color: 'var(--text-primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-6 flex-shrink-0">
              <div className="hidden md:flex items-center space-x-2 bg-black/20 rounded-2xl p-2 backdrop-blur-sm">
                <Link href="/landing" className="nav-link px-4 py-2 font-medium">
                  Home
                </Link>
                <Link href="/login" className="nav-link px-4 py-2 font-medium">
                  Login
                </Link>
              </div>
              
              <button
                onClick={toggleTheme}
                className="p-3 rounded-xl transition-all duration-300 hover:scale-110"
                style={{
                  background: 'var(--glass-bg)',
                  border: '2px solid var(--glass-border-color)',
                  color: 'var(--text-primary)'
                }}
                title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'light' ? (
                  <Moon className="w-5 h-5" />
                ) : (
                  <Sun className="w-5 h-5" />
                )}
              </button>
              
              <Link href="/register" className="btn-primary px-6 py-3 font-semibold">
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}