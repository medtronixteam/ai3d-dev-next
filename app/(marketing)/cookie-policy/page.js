import CookiePolicy from 'pages/CookiePolicy';
import { pageMeta } from '../../seo';

export const metadata = pageMeta({
  title: 'Cookie Policy | 3DIO AI',
  description:
    'How AI 3D Scanning Solutions Inc. uses and categorizes cookies on its websites and products, and how you can manage your consent.',
  path: '/cookie-policy',
  keywords: ['cookie policy', 'cookie consent', 'AI 3D Scanning Solutions'],
});

export default function Page() {
  return <CookiePolicy />;
}
