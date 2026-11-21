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
  return { title: `${d.name} | Axcel Sports`, description: `${d.name} in ${d.colourways.length} colours.` };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const d = designBySlug(slug);
  if (!d) notFound();
  const cat = categoryBySlug(d.category);
  const design = { ...d, body: safeHtml(d.body) };
  return (
    <div className="container">
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link> / <Link href={`/shop/${cat.slug}`}>{cat.name}</Link> / <span>{d.name}</span>
      </nav>
      <ProductView design={design} />
    </div>
  );
}
