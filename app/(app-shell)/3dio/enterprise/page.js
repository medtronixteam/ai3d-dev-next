'use client';

import dynamic from 'next/dynamic';
import Splash from 'components/loader/Splash';

const EnterprisePage = dynamic(() => import('pages/inquiry/EnterprisePage'), {
  ssr: false,
  loading: () => <Splash />,
});

export default function Page() {
  return <EnterprisePage />;
}
