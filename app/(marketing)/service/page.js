import Service from 'pages/Service';
import { pageMeta } from '../../seo';

export const metadata = pageMeta({
  title: 'AI & Software Services | 3DIO',
  description:
    'From concept to deployment, AI3D Scanning Solutions delivers AI development, Flutter apps, websites, desktop apps, consulting, and creative media.',
  path: '/service',
  keywords: [
    'AI Development and Solutions',
    'Flutter App Development',
    'Website Development',
    'Desktop App Development',
    'Business Development and Consulting',
    'Creative Media',
  ],
});

export default function Page() {
  return <Service />;
}
