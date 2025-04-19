'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function useProtectedRoute() {
  const { isLogged, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isLogged) {
      router.push('/home');
    }
  }, [isLogged, loading, router]);
}
