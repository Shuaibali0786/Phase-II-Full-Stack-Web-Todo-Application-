'use client';

import React, { ReactNode } from 'react';
import { AuthProvider } from '@/providers/AuthProvider';

interface AppWrapperProps {
  children: ReactNode;
}

const AppWrapper: React.FC<AppWrapperProps> = ({ children }) => {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
};

export default AppWrapper;