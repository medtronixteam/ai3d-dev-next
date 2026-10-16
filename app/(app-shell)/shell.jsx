'use client';

import dynamic from 'next/dynamic';
import Splash from 'components/loader/Splash';
import ClientShell from '../client-shell';

const MainLayout = dynamic(() => import('layouts/main-layout'), {
  ssr: false,
  loading: () => <Splash />,
});

export default function AppShell({ children }) {
  return (
    <ClientShell>
      <MainLayout>{children}</MainLayout>
    </ClientShell>
  );
}
