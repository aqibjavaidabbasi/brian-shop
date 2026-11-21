import { notFound } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { CATEGORIES, categoryBySlug, designsIn, cardData } from '@/lib/catalog';

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }) {
  const { category } = await params;
  const c = categoryBySlug(category);
  return c ? { title: `${c.name} | Axcel Sports`, description: c.blurb } : {};
}

export default async function CategoryPage({ params }) {
  const { category } = await params;
  const c = categoryBySlug(category);
  if (!c) notFound();
  const designs = designsIn(category);
  return (
    <>
      <section className="page-head">
        <div className="container">
          <p className="eyebrow">Axcel Sports / Shop</p>
          <h1>{c.name}</h1>
          <p>{c.blurb}</p>
        </div>
      </section>
      <div className="container">
        <p className="count">{designs.length} designs</p>
        <div className="grid">
          {designs.map((d) => (
            <ProductCard key={d.slug} design={cardData(d)} />
          ))}
        </div>
      </div>
    </>
  );
}
