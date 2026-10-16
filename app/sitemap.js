import { SITE_URL } from './seo';

const routes = [
  { path: '', priority: 1, changeFrequency: 'weekly' },
  { path: '/about-us', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/service', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/book-demo', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/3dio/enterprise', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/student-program', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/contributor/program', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/contributor-getstarted', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/referral', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/terms-conditions', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/cookie-policy', priority: 0.3, changeFrequency: 'yearly' },
];

export default function sitemap() {
  const lastModified = new Date();
  return routes.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
