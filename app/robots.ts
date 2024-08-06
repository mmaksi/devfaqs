import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: [
        '/',
        '/community',
        '/tags',
        '/jobs',
        '/profile',
        '/sign-up',
        '/sign-in',
      ],
      disallow: '/private/',
    },
    sitemap: 'https://acme.com/sitemap.xml',
  };
}
