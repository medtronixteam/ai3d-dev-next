'use client';

import dynamic from 'next/dynamic';
import Splash from 'components/loader/Splash';

const Guard = dynamic(() => import('components/ProtectedRoute'), { ssr: false });
const View = dynamic(() => import('pages/team'), {
  ssr: false,
  loading: () => <Splash />,
});

export default function Page() {
  return (
    <Guard>
      <View />
    </Guard>
  );
}
