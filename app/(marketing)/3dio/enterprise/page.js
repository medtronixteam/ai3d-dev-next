import EnterprisePage from 'pages/inquiry/EnterprisePage';
import { pageMeta } from '../../../seo';

export const metadata = pageMeta({
  title: 'Enterprise AI | Scale Your 3D Production',
  description:
    'Get custom pipeline integrations, dedicated high-throughput GPU capacity, a tailored SLA, and flexible volume pricing for your organization.',
  path: '/3dio/enterprise',
  keywords: [
    'Enterprise Solutions',
    '3D production',
    'pipeline integrations',
    'GPU capacity',
    'volume pricing',
  ],
});

export default function Page() {
  return <EnterprisePage />;
}