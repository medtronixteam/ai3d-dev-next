export const SITE_URL = 'https://ai3dscanning.com';
const OG_IMAGE = `${SITE_URL}/logo.png`;

export function pageMeta({ title, description, path, keywords }) {
  const url = `${SITE_URL}${path === '/' ? '' : path}`;
  return {
    title: { absolute: title },
    description,
    keywords,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      url,
      title,
      description,
      images: [OG_IMAGE],
      siteName: '3DIO AI',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [OG_IMAGE],
    },
  };
}
