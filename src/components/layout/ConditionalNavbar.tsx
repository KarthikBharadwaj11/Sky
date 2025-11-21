'use client';

import { useAuth } from '../auth/AuthProvider';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import LandingNavbar from './LandingNavbar';

export default function ConditionalNavbar() {
  const { user } = useAuth();
  const pathname = usePathname();

  // Hide navbar completely during onboarding
  if (pathname === '/onboarding') {
    return null;
  }

  // If user is not logged in (landing, register, login pages), show limited LandingNavbar
  if (!user) {
    return <LandingNavbar />;
  }

  // For logged-in users who completed onboarding, use full Navbar
  return <Navbar />;
}