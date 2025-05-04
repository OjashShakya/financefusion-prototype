'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../src/context/AuthContext';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleRouting = async () => {
      if (!loading) {
        if (user) {
          console.log('User found, redirecting to dashboard');
          router.replace('/dashboard');
        } else {
          console.log('No user found, redirecting to login');
          router.replace('/login');
        }
      }
    };

    handleRouting();
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return null;
}

