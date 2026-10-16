import AboutUs from 'pages/AboutUs';
import { pageMeta } from '../../seo';

export const metadata = pageMeta({
  title: 'About 3DIO | Pioneering the Next Era of 3D Creation',
  description:
    'Building the Canva of 3D. An AI-native spatial computing platform that turns images, videos, and text into production-ready 3D assets in seconds.',
  path: '/about-us',
  keywords: [
    'About 3DIO',
    '3D creation',
    'spatial computing',
    'AI-native 3D platform',
    'quality speed and scale',
  ],
});

export default function Page() {
  return <AboutUs />;
}
