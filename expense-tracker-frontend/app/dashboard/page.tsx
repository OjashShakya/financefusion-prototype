'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../src/context/AuthContext';
import { FinanceDashboard } from '@/components/finance/finance-dashboard';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      const token = localStorage.getItem("token");
      console.log("Token")
      if (!token) {
        router.replace('/login');
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-solid border-gray-200"></div>
            <div className="w-16 h-16 rounded-full border-4 border-solid border-primary border-t-transparent animate-spin absolute top-0 left-0"></div>
          </div>
          <p className="text-lg font-medium text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <FinanceDashboard />
    </div>
  );
} 