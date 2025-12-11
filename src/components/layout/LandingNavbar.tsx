'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function LandingNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-6xl px-4">
      <nav className="glass-morphism rounded-2xl shadow-2xl">
        <div className="px-6 py-3">
          <div className="flex justify-between items-center gap-4">
            {/* Logo */}
            <Link
              href="/landing"
              className="hover:scale-105 transition-all duration-300"
            >
              <Image
                src="/logo.png"
                alt="Logo"
                width={100}
                height={35}
                className="object-contain"
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <Link
                href="/copy-trading"
                className="nav-link"
              >
                Copy Trading
              </Link>
              <Link
                href="/paper-trading"
                className="nav-link"
              >
                Paper Trading
              </Link>
              <Link
                href="/learn"
                className="nav-link"
              >
                Learn
              </Link>
              <Link
                href="/about"
                className="nav-link"
              >
                About
              </Link>
              <Link
                href="/support"
                className="nav-link"
              >
                Support
              </Link>

              <div className="h-6 w-px bg-white/20"></div>

              <Link 
                href="/login" 
                className="nav-link"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="btn-primary px-6 py-2 text-sm whitespace-nowrap"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-white" />
              ) : (
                <Menu className="w-6 h-6 text-white" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pt-4 border-t border-white/10">
              <div className="flex flex-col space-y-3">
                <Link
                  href="/copy-trading"
                  className="nav-link px-4 py-3"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Copy Trading
                </Link>
                <Link
                  href="/paper-trading"
                  className="nav-link px-4 py-3"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Paper Trading
                </Link>
                <Link
                  href="/learn"
                  className="nav-link px-4 py-3"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Learn
                </Link>
                <Link
                  href="/about"
                  className="nav-link px-4 py-3"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
                <Link
                  href="/support"
                  className="nav-link px-4 py-3"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Support
                </Link>
                
                <div className="h-px bg-white/10 my-2"></div>
                
                <Link 
                  href="/login" 
                  className="nav-link px-4 py-3"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link 
                  href="/register" 
                  className="btn-primary px-6 py-3 text-center font-semibold"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}