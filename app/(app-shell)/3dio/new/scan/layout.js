'use client';

import dynamic from 'next/dynamic';
import Splash from 'components/loader/Splash';

const ScanNewPage = dynamic(() => import('pages/scan/ScanNewPage'), {
  ssr: false,
  loading: () => <Splash />,
});

export default function ScanLayout({ children }) {
  return (
    <>
      <ScanNewPage />
      {children}
    </>
  );
}
