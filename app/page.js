import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { CATEGORIES, designsIn, cardData, img } from '@/lib/catalog';

const HERO_BASE = 'https://www.axcelsports.com/cdn/shop/files/Blog_Banner_for_Website_Content.png?v=1';
const HERO = HERO_BASE + '&width=1440';

export default function Home() {
  const featured = ['sfi-suits', 'powerboat-suits', 'drag-racing-suits', 'karting-suits']
    .flatMap((c) => designsIn(c).slice(0, 2))
    .slice(0, 8);
  // Use a real product photo for each tile, skipping placeholder graphics.
  const photo = (slug) =>
    designsIn(slug)
      .flatMap((d) => d.colourways.map((c) => c.images[0]))
      .find((src) => src && !/\/AXCEL_\d+\./i.test(src));
  const tiles = CATEGORIES.map((c) => ({ ...c, image: photo(c.slug) }));
  return (
    <>
      <section className="hero">
        <img
          className="hero-img"
          src={HERO}
          srcSet={`${HERO_BASE}&width=960 960w, ${HERO_BASE}&width=1440 1440w, ${HERO_BASE}&width=2000 2000w`}
          sizes="100vw"
          width="1920"
          height="1080"
          fetchPriority="high"
          alt="Driver in an Axcel race suit at the track"
        />
        <div className="hero-text">
          <h1>
            Your passion
            <br />
            drives us to
            <br />
            <span>Axcel</span>
          </h1>
          <p>Custom &amp; Off the Rack, Auto, Moto &amp; Powerboat Racing Suits, Accessories and Teamwear.</p>
          <Link href="/shop/sfi-suits" className="btn-primary">
            Shop racing suits
          </Link>
        </div>
      </section>

      <section className="container section">
        <h2>Shop by category</h2>
        <div className="tiles">
          {tiles.map((t) => (
            <Link key={t.slug} href={`/shop/${t.slug}`} className="tile">
              {t.image && <img src={img(t.image, 500)} alt="" loading="lazy" />}
              <span>{t.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="container section">
        <h2>Featured suits</h2>
        <div className="grid">
          {featured.map((d) => (
            <ProductCard key={d.slug} design={cardData(d)} />
          ))}
        </div>
      </section>
    </>
  );
}
