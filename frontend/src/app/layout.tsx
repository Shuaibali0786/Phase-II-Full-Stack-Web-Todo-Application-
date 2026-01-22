import React, { ReactNode } from 'react';
import './globals.css';
import AppWrapper from './AppWrapper';

// Define the props type for the RootLayout component
interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <AppWrapper>
          {children}
        </AppWrapper>
      </body>
    </html>
  );
};

export default RootLayout;