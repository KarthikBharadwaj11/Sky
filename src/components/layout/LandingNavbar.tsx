'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

export default function LandingNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 px-4 w-full max-w-5xl">
      <div className="navbar-gradient-border rounded-2xl">
        <nav className={`navbar-glass rounded-2xl ${isScrolled ? 'scrolled' : ''}`}>
          <div className="px-6 py-3">
            <div className="flex justify-between items-center gap-4">
              {/* Logo */}
              <Link href="/landing" className="hover:scale-105 transition-all duration-300 flex-shrink-0">
                <Image
                  src="/logo.png"
                  alt="Sky Logo"
                  width={100}
                  height={35}
                  className="object-contain"
                  priority
                />
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-2">
                <Link href="/copy-trading" className={`nav-link ${pathname === '/copy-trading' ? 'active' : ''}`}>Copy Trading</Link>
                <Link href="/paper-trading" className={`nav-link ${pathname === '/paper-trading' ? 'active' : ''}`}>Paper Trading</Link>
                <Link href="/learn" className={`nav-link ${pathname === '/learn' ? 'active' : ''}`}>Learn</Link>
                <Link href="/about" className={`nav-link ${pathname === '/about' ? 'active' : ''}`}>About</Link>
                <Link href="/support" className={`nav-link ${pathname === '/support' ? 'active' : ''}`}>Support</Link>

                <div className="h-6 w-px bg-white/20"></div>

                <Link href="/login" className="btn-primary px-6 py-2 text-sm whitespace-nowrap">Sign In</Link>
                <Link href="/register" className="btn-primary px-6 py-2 text-sm whitespace-nowrap">Get Started</Link>
              </div>

              {/* Mobile menu button */}
              <button
                className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-expanded={isMenuOpen}
                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6 text-white" />
                ) : (
                  <Menu className="w-6 h-6 text-white" />
                )}
              </button>
            </div>

            {/* Mobile Navigation */}
            <div className={`md:hidden mobile-menu ${isMenuOpen ? 'open' : ''}`}>
              <div>
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex flex-col space-y-3 pb-2">
                    <Link href="/copy-trading" className={`nav-link px-4 py-3 ${pathname === '/copy-trading' ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>Copy Trading</Link>
                    <Link href="/paper-trading" className={`nav-link px-4 py-3 ${pathname === '/paper-trading' ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>Paper Trading</Link>
                    <Link href="/learn" className={`nav-link px-4 py-3 ${pathname === '/learn' ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>Learn</Link>
                    <Link href="/about" className={`nav-link px-4 py-3 ${pathname === '/about' ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>About</Link>
                    <Link href="/support" className={`nav-link px-4 py-3 ${pathname === '/support' ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>Support</Link>
                    <div className="h-px bg-white/10 my-2"></div>
                    <Link href="/login" className="btn-primary px-6 py-3 text-center font-semibold" onClick={() => setIsMenuOpen(false)}>Sign In</Link>
                    <Link href="/register" className="btn-primary px-6 py-3 text-center font-semibold" onClick={() => setIsMenuOpen(false)}>Get Started</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}
