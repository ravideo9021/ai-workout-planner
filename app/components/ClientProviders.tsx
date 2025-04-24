'use client';

import React from 'react';
import WorkoutProvider from '../context/WorkoutContext';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <WorkoutProvider>
      {children}
    </WorkoutProvider>
  );
} 