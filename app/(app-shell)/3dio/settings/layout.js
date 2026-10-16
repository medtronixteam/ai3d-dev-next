'use client';

import dynamic from 'next/dynamic';
import Splash from 'components/loader/Splash';
import { OutletProvider } from 'lib/router-compat';

const Guard = dynamic(() => import('components/ProtectedRoute'), { ssr: false });
const SettingsPage = dynamic(() => import('pages/settings'), {
  ssr: false,
  loading: () => <Splash />,
});

export default function SettingsLayout({ children }) {
  return (
    <Guard>
      <OutletProvider outlet={children}>
        <SettingsPage />
      </OutletProvider>
    </Guard>
  );
}
