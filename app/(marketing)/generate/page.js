import GeneratePage from 'pages/generate/GeneratePage';
import { pageMeta } from '../../seo';

export const metadata = pageMeta({
  title: 'Generate | 3DIO',
  description:
    'Search and browse production-ready 3D models, then generate new assets from a prompt.',
  path: '/generate',
});

export default function Page() {
  return <GeneratePage />;
}
