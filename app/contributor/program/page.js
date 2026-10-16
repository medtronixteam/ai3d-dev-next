import ContributorLandingPage from 'pages/ContributorPage/ContributorLandingPage';
import { pageMeta } from '../../seo';

export const metadata = pageMeta({
  title: 'Contributor Program | Your Work. Our Platform.',
  description:
    'Join forces with global visionaries and innovators to co-create next-generation 3D solutions, shaping the future of immersive design and collaboration.',
  path: '/contributor/program',
  keywords: [
    'contributor program',
    'immersive design',
    '3D collaboration',
    'next-generation 3D solutions',
  ],
});

export default function Page() {
  return <ContributorLandingPage />;
}
