'use client';

import dynamic from 'next/dynamic';
import Splash from 'components/loader/Splash';

const Error404 = dynamic(() => import('pages/errors/Error404'), {
  ssr: false,
  loading: () => <Splash />,
});

export default function NotFound() {
  return <Error404 />;
}
