'use client';

import dynamic from 'next/dynamic';
import Splash from 'components/loader/Splash';

const Dashboard = dynamic(() => import('pages/dashboard'), {
  ssr: false,
  loading: () => <Splash />,
});

export default function DashboardLayout({ children }) {
  return (
    <>
      <Dashboard />
      {children}
    </>
  );
}
