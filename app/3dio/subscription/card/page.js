'use client';

import dynamic from 'next/dynamic';
import Splash from 'components/loader/Splash';

const View = dynamic(() => import('pages/subscription/CardPayment'), {
  ssr: false,
  loading: () => <Splash />,
});

export default function Page() {
  return <View />;
}
