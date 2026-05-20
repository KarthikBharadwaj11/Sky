'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useAuth } from '../auth/AuthProvider';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push('/landing');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b-2 navbar-bg" style={{
      backdropFilter: 'blur(25px)', 
      boxShadow: 'var(--shadow-xl), 0 0 30px color-mix(in srgb, var(--primary-blue) 15%, transparent)', 
      borderBottomColor: 'var(--primary-blue)',
      borderImage: 'linear-gradient(90deg, var(--primary-blue), var(--primary-purple)) 1'
    }}>
      <div className="max-w-8xl mx-auto px-6 h-[95px] flex items-center">
        <div className="flex justify-between items-center w-full gap-6">
          {/* Logo Section - Left */}
          <div className="flex items-center flex-shrink-0">
            <Link
              href="/landing"
              className="hover:scale-105 transition-all duration-300"
            >
              <Image
                src="/logo.png"
                alt="Logo"
                width={70}
                height={25}
                className="object-contain"
                style={{ width: '90px', height: 'auto' }}
                priority
              />
            </Link>
          </div>

          {user ? (
            <>
              {/* Search Bar - compact pill on lg, full bar on xl */}
              <div className="hidden lg:flex xl:flex-1 xl:max-w-2xl mx-4">
                <div className="relative xl:w-full">
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-tertiary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  {/* Compact pill — visible on lg only */}
                  <input
                    type="text"
                    placeholder="Search..."
                    disabled
                    className="xl:hidden pl-9 pr-3 py-1.5 rounded-full text-sm focus:outline-none"
                    style={{
                      background: 'var(--glass-bg)',
                      border: '1px solid var(--glass-border-color)',
                      color: 'var(--text-primary)',
                      cursor: 'not-allowed',
                      opacity: '0.7',
                      width: '130px'
                    }}
                  />
                  {/* Full bar — visible on xl+ */}
                  <input
                    type="text"
                    placeholder="Search for stocks, ETFs, or assets..."
                    disabled
                    className="hidden xl:block w-full pl-10 pr-4 py-2 rounded-xl text-sm focus:outline-none"
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
              <div className="hidden lg:flex items-center space-x-1 flex-shrink-0 text-sm">
                <Link href="/overview" className={`nav-link px-2.5 py-1.5 ${pathname === '/overview' ? 'active' : ''}`}>Overview</Link>
                <Link href="/search" className={`nav-link px-2.5 py-1.5 ${pathname === '/search' ? 'active' : ''}`}>Search</Link>
                <Link href="/market" className={`nav-link px-2.5 py-1.5 ${pathname === '/market' ? 'active' : ''}`}>Market</Link>
                <Link href="/options" className={`nav-link px-2.5 py-1.5 ${pathname === '/options' ? 'active' : ''}`}>Options</Link>
                <Link href="/copy-trading" className={`nav-link px-2.5 py-1.5 ${pathname === '/copy-trading' ? 'active' : ''}`}>Copy Trading</Link>
                <Link href="/orders" className={`nav-link px-2.5 py-1.5 ${pathname === '/orders' ? 'active' : ''}`}>Orders</Link>
                <Link href="/profile" className={`nav-link px-2.5 py-1.5 ${pathname === '/profile' ? 'active' : ''}`}>Profile</Link>

                {/* Resources Dropdown */}
                <div className="relative" onMouseEnter={() => setResourcesOpen(true)} onMouseLeave={() => setResourcesOpen(false)}>
                  <button className="nav-link px-2.5 py-1.5 flex items-center gap-1">
                    Resources
                    <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${resourcesOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {resourcesOpen && (
                    <div className="absolute right-0 top-full mt-1 w-44 rounded-xl overflow-hidden shadow-xl z-50"
                      style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border-color)', backdropFilter: 'blur(20px)' }}>
                      <Link href="/learn" className="block px-4 py-3 text-sm transition-colors hover:bg-white/10" style={{ color: 'var(--text-primary)' }}>
                        Learn
                      </Link>
                      <Link href="/support" className="block px-4 py-3 text-sm transition-colors hover:bg-white/10" style={{ color: 'var(--text-primary)' }}>
                        Support
                      </Link>
                      <Link href="/about" className="block px-4 py-3 text-sm transition-colors hover:bg-white/10" style={{ color: 'var(--text-primary)' }}>
                        About
                      </Link>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-1.5 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 font-semibold text-sm shadow-lg hover:shadow-xl transform hover:scale-105"
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
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 border border-white/20 hover:border-white/50 hover:bg-white/10"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Sign In
                </Link>
              </div>

              <Link
                href="/register"
                className="px-6 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-200 hover:scale-105 shadow-lg"
                style={{ background: '#ffffff', color: '#0f0e1a' }}
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}