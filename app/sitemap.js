import { allDesigns, CATEGORIES } from '@/lib/catalog';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export default function sitemap() {
  return [
    { url: `${SITE}/`, priority: 1 },
    ...CATEGORIES.map((c) => ({ url: `${SITE}/shop/${c.slug}`, priority: 0.8 })),
    ...allDesigns().map((d) => ({ url: `${SITE}/products/${d.slug}`, priority: 0.6 })),
  ];
}
