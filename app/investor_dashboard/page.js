'use client';

import { Suspense } from 'react';
import DashboardContent from './DashboardContent.js';


export default function InvestorDashboardPage() {
  return (
    <Suspense fallback={<div>Loading Investor Dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
