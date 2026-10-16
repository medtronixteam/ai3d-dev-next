import BookDemo from 'pages/Service/BookDemo';
import { pageMeta } from '../../seo';

export const metadata = pageMeta({
  title: 'Book Your Free Demo | 3DIO AI',
  description:
    'Tell us about your project and we will show you how we can build it, with a live prototype concept, timeline, and cost estimate.',
  path: '/book-demo',
  keywords: ['free demo', 'book a demo', 'prototype concept', 'project timeline', 'cost estimate'],
});

export default function Page() {
  return <BookDemo />;
}
