import LandingPage from 'pages/LandingPage';
import { pageMeta, SITE_URL } from '../seo';

const description =
  'The AI infrastructure layer for 3D creation. Generate production-ready 3D assets in a minute.';

export const metadata = pageMeta({
  title: '3DIO AI | AI-Powered 3D Asset Generation',
  description,
  path: '/',
  keywords: [
    '3DIO AI',
    '3D Asset Generation',
    'AI 3D Model Generation',
    '3D Scanning',
    'High Fidelity 3D Models',
  ],
});

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      name: 'AI 3D Scanning Solutions Inc.',
      alternateName: '3DIO AI',
      url: SITE_URL,
      logo: `${SITE_URL}/logo.png`,
      description,
    },
    {
      '@type': 'WebSite',
      name: '3DIO AI',
      url: SITE_URL,
      description,
    },
  ],
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <LandingPage />
    </>
  );
}
