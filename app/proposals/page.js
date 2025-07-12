import { Suspense } from 'react';
import ProposalsContent from './ProposalsContent';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading proposals...</div>}>
      <ProposalsContent />
    </Suspense>
  );
}
