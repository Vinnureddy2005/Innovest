'use client';

import { Suspense } from 'react';
import DashboardContent from './DashboardContent.js';


export default function DashboardPage() {
  return (
    <Suspense fallback={<div>Loading Dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
