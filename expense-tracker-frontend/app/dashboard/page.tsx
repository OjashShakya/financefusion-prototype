'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { FinanceDashboard } from '@/components/finance/finance-dashboard';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      if (!loading) {
        if (!user) {
          console.log('No user found, redirecting to login');
          router.replace('/login');
        }
      }
    };

    checkAuth();
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-full absolute border-4 border-solid border-gray-200"></div>
            <div className="w-12 h-12 rounded-full animate-spin absolute border-4 border-solid border-primary border-t-transparent"></div>
          </div>
          <p className="text-lg font-medium text-gray-600">Loading your dashboard...</p>
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