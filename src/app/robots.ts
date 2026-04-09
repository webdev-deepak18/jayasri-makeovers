import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return [
    {
      userAgent: '*',
      allow: '/',
      disallow: '/admin/',
    },
  ];
}
