'use client';

import { useAuth } from "@/components/auth/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import OverviewDashboard from "@/components/overview/OverviewDashboard";

export default function Dashboard() {
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

  return <OverviewDashboard />;
}
