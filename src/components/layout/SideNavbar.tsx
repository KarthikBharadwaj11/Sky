'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard,
  LineChart,
  TrendingUp,
  BarChart2,
  Users,
  User,
  BookOpen,
  HelpCircle,
  Info,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../auth/AuthProvider';

const navItems = [
  { href: '/overview', icon: LineChart, label: 'Trading' },
  { href: '/options', icon: BarChart2, label: 'Options' },
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/market', icon: TrendingUp, label: 'Market' },
  { href: '/copy-trading', icon: Users, label: 'Copy Trading' },
  { href: '/profile', icon: User, label: 'Profile' },
];

const bottomItems = [
  { href: '/learn', icon: BookOpen, label: 'Learn' },
  { href: '/support', icon: HelpCircle, label: 'Support' },
  { href: '/about', icon: Info, label: 'About' },
];

interface NavIconProps {
  href?: string;
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

function NavIcon({ href, icon: Icon, label, active, onClick }: NavIconProps) {
  const content = (
    <div
      className="relative group flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 cursor-pointer"
      style={{
        background: active ? 'linear-gradient(135deg, rgba(59,130,246,0.25), rgba(124,58,237,0.25))' : 'transparent',
        border: active ? '1px solid rgba(124,58,237,0.4)' : '1px solid transparent',
      }}
      onClick={onClick}
    >
      <Icon
        className="w-5 h-5 transition-colors duration-200"
        style={{ color: active ? 'var(--text-accent)' : 'var(--text-tertiary)' }}
      />

      {/* Tooltip */}
      <div
        className="absolute left-full ml-3 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50"
        style={{
          background: 'var(--glass-bg)',
          border: '1px solid var(--glass-border-color)',
          color: 'var(--text-primary)',
          backdropFilter: 'blur(12px)',
        }}
      >
        {label}
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}

export default function SideNavbar() {
  const { logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push('/landing');
  };

  return (
    <nav
      className="fixed top-0 left-0 bottom-0 z-50 flex flex-col items-center py-4 gap-1"
      style={{
        width: '60px',
        background: 'var(--navbar-bg, rgba(10,10,20,0.95))',
        borderRight: '1px solid var(--glass-border-color)',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Logo */}
      <Link href="/overview" className="flex items-center justify-center mb-4 mt-1">
        <Image
          src="/logo.png"
          alt="Sky"
          width={32}
          height={32}
          className="object-contain"
          style={{ width: '32px', height: 'auto' }}
          priority
        />
      </Link>

      {/* Divider */}
      <div className="w-8 h-px mb-3" style={{ background: 'var(--glass-border-color)' }} />

      {/* Main nav items */}
      <div className="flex flex-col items-center gap-1 flex-1">
        {navItems.map(({ href, icon, label }) => (
          <NavIcon
            key={href}
            href={href}
            icon={icon}
            label={label}
            active={pathname === href || pathname.startsWith(href + '/')}
          />
        ))}
      </div>

      {/* Bottom items */}
      <div className="flex flex-col items-center gap-1">
        {bottomItems.map(({ href, icon, label }) => (
          <NavIcon key={href} href={href} icon={icon} label={label} active={pathname === href} />
        ))}

        {/* Divider */}
        <div className="w-8 h-px my-2" style={{ background: 'var(--glass-border-color)' }} />

        {/* Logout */}
        <NavIcon icon={LogOut} label="Logout" onClick={handleLogout} />
      </div>
    </nav>
  );
}
