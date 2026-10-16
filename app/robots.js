import { SITE_URL } from './seo';

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/3dio/enterprise'],
        disallow: [
          '/3dio/',
          '/signin',
          '/signup',
          '/reset-password',
          '/login/',
          '/project/',
          '/public/',
          '/render/',
          '/subscription/',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
