'use client';

import React, { Suspense } from 'react';
import LoginForm from '@/app/components/Auth/LoginForm';
import { Logo } from '@/app/components/Auth/Logo';

// Loading fallback for Suspense boundary (required for useSearchParams in Next.js 15)
const LoginFormSkeleton = () => (
  <div className="w-full max-w-md animate-pulse">
    <div className="mb-8 text-center">
      <Logo size="lg" />
    </div>
    <div className="auth-card">
      <div className="h-8 bg-surface rounded mb-6 mx-auto w-48" />
      <div className="space-y-4">
        <div className="h-12 bg-surface rounded" />
        <div className="h-12 bg-surface rounded" />
        <div className="h-10 bg-surface rounded" />
      </div>
    </div>
  </div>
);

const LoginPage: React.FC = () => {
  return (
    <div className="auth-page">
      <Suspense fallback={<LoginFormSkeleton />}>
        <LoginForm />
      </Suspense>
    </div>
  );
};

export default LoginPage;
