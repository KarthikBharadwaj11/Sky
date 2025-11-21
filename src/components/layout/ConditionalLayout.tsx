'use client';

import { useAuth } from '../auth/AuthProvider';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const { user } = useAuth();
  
  // For logged-in users, add padding-top for fixed navbar (h-20 = 80px = pt-20)
  // For non-logged-in users, no padding since floating navbar doesn't need it
  const layoutClass = user ? "min-h-screen pt-20" : "min-h-screen";
  
  return (
    <main className={layoutClass} style={{ background: 'var(--gradient-background)' }}>
      {children}
    </main>
  );
}