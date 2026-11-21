import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProductView from '@/components/ProductView';
import { allDesigns, designBySlug, categoryBySlug, safeHtml } from '@/lib/catalog';

export function generateStaticParams() {
  return allDesigns().map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const d = designBySlug(slug);
  if (!d) return {};
  const n = d.colourways.length;
  const desc = `${d.name} from Axcel Sports, available in ${n} colour${n > 1 ? 's' : ''}, from $${d.minPrice.toFixed(2)}.`;
  const image = d.colourways[0]?.images[0];
  return {
    title: `${d.name} | Axcel Sports`,
    description: desc,
    alternates: { canonical: `/products/${d.slug}` },
    openGraph: { title: d.name, description: desc, images: image ? [image + '&width=1200'] : [] },
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const d = designBySlug(slug);
  if (!d) notFound();
  const cat = categoryBySlug(d.category);
  const design = { ...d, body: safeHtml(d.body) };
  const offers = d.colourways.flatMap((c) => c.variants).filter((v) => v.price > 0);
  const jsonLd = offers.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: d.name,
        brand: { '@type': 'Brand', name: 'Axcel Sports' },
        image: d.colourways.map((c) => c.images[0]).filter(Boolean).slice(0, 10),
        color: d.colourways.map((c) => c.label).join(', '),
        offers: {
          '@type': 'AggregateOffer',
          priceCurrency: 'USD',
          lowPrice: Math.min(...offers.map((v) => v.price)).toFixed(2),
          highPrice: Math.max(...offers.map((v) => v.price)).toFixed(2),
          offerCount: offers.length,
          availability: offers.some((v) => v.available) ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        },
      }
    : null;
  return (
    <div className="container">
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
        />
      )}
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link> / <Link href={`/shop/${cat.slug}`}>{cat.name}</Link> / <span>{d.name}</span>
      </nav>
      <ProductView design={design} />
    </div>
  );
}
