import GetStartedPage from 'pages/ContributorPage/GetStartedPage';
import { pageMeta } from '../../seo';

export const metadata = pageMeta({
  title: 'Smarter Tools. Faster Uploads. Bigger Earnings.',
  description:
    'Explore smart tools designed to simplify uploading, managing, and selling your 3D assets, so you can focus on creating.',
  path: '/contributor-getstarted',
  keywords: ['faster uploads', 'bigger earnings', 'sell 3D assets', 'upload 3D assets', 'contributor tools'],
});

export default function Page() {
  return <GetStartedPage />;
}
