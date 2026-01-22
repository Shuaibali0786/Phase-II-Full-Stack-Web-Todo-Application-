'use client';

import React from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  fallback = <div>Loading...</div>
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated && pathname !== '/auth/login' && pathname !== '/auth/register') {
        router.push('/auth/login');
      }
    }
  }, [isAuthenticated, isLoading, router, pathname]);

  if (isLoading) {
    return <>{fallback}</>;
  }

  if (!isAuthenticated) {
    // Render nothing or a simple message while redirecting
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;