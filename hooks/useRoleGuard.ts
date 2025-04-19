'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function useRoleGuard(allowedRoles: string[]) {
  const { userRole, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!userRole || !allowedRoles.includes(userRole))) {
      router.push('/unauthorized');
    }
  }, [userRole, loading, allowedRoles, router]);
}
