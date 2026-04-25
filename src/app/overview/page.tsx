'use client';

import { useAuth } from "@/components/auth/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import OverviewDashboard from "@/components/overview/OverviewDashboard";

export default function Overview() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/landing');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return (
    <div>
      {/* Market Status Bar - fixed below navbar */}
      <div className="fixed top-20 left-0 right-0 z-30 glass-morphism border-b border-white/10 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-3">
          <div className="grid grid-cols-3 items-center">
            {/* Left: Market Status */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-sm font-semibold text-green-400">Market Open</span>
              </div>
              <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Closes in 3h 24m</span>
            </div>

            {/* Center: Major Indices */}
            <div className="flex items-center justify-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>S&P 500</span>
                <span className="text-sm font-bold text-green-400">5,234.18</span>
                <span className="text-xs text-green-400">+0.45%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>NASDAQ</span>
                <span className="text-sm font-bold text-green-400">16,428.82</span>
                <span className="text-xs text-green-400">+0.78%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>DOW</span>
                <span className="text-sm font-bold text-red-400">38,712.21</span>
                <span className="text-xs text-red-400">-0.12%</span>
              </div>
            </div>

            {/* Right: User's Day P&L */}
            <div className="flex items-center justify-end gap-2">
              <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Today:</span>
              <span className="text-sm font-bold text-green-400">+$234.56</span>
              <span className="text-xs text-green-400">(+2.1%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - account for market status bar only; navbar offset handled by ConditionalLayout */}
      <div className="pt-[48px]">
        <OverviewDashboard />
      </div>
    </div>
  );
}
