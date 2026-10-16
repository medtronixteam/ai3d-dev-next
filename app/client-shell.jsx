'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import Splash from 'components/loader/Splash';

const Providers = dynamic(() => import('./providers'), {
  ssr: false,
  loading: () => <Splash />,
});

export default function ClientShell({ children }) {
  return (
    <Suspense fallback={<Splash />}>
      <Providers>{children}</Providers>
    </Suspense>
  );
}
