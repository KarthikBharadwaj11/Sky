'use client';

import { useAuth } from '../auth/AuthProvider';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const { user } = useAuth();
  
  // For logged-in users, add padding-top for fixed navbar (84px)
  // For non-logged-in users, no padding since floating navbar doesn't need it
  const layoutClass = user ? "min-h-screen pl-[60px] trading-background" : "min-h-screen trading-background";

  return (
    <main className={layoutClass}>
      {children}
    </main>
  );
}