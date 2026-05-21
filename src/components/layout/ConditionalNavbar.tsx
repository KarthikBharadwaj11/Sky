'use client';

import { useAuth } from '../auth/AuthProvider';
import { usePathname } from 'next/navigation';
import LandingNavbar from './LandingNavbar';
import SideNavbar from './SideNavbar';

export default function ConditionalNavbar() {
  const { user } = useAuth();
  const pathname = usePathname();

  if (pathname === '/onboarding') {
    return null;
  }

  if (!user) {
    return <LandingNavbar />;
  }

  return <SideNavbar />;
}