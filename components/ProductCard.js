'use client';
import Link from 'next/link';
import { useState } from 'react';

function img(src, w) {
  return src ? src + (src.includes('?') ? '&' : '?') + 'width=' + w : '';
}

const MAX = 10;

export default function ProductCard({ design }) {
  const [active, setActive] = useState(0);
  const current = design.colourways[active];
  const href = `/products/${design.slug}?c=${active}`;
  const many = design.colourways.length > 1;
  return (
    <article className="card">
      <Link href={href} className="card-image">
        <img src={img(current.image, 600)} alt={`${design.name} in ${current.label}`} loading="lazy" />
      </Link>
      {many && (
        <div className="swatches" role="group" aria-label={`${design.name} colours`}>
          {design.colourways.slice(0, MAX).map((c, i) => (
            <button
              key={c.label}
              type="button"
              className={'swatch' + (i === active ? ' is-active' : '')}
              onClick={() => setActive(i)}
              onMouseEnter={() => setActive(i)}
              aria-label={c.label}
              aria-pressed={i === active}
              title={c.label}
            >
              <img src={img(c.image, 80)} alt="" loading="lazy" />
            </button>
          ))}
          {design.colourways.length > MAX && (
            <Link href={`/products/${design.slug}`} className="swatch-more" aria-label="See all colours">
              +{design.colourways.length - MAX}
            </Link>
          )}
        </div>
      )}
      <div className="card-body">
        <Link href={href} className="card-title">
          {design.name}
        </Link>
        <span className="card-price">From ${design.minPrice.toFixed(2)}</span>
      </div>
      <span className="card-meta">{many ? `${design.colourways.length} colours` : '1 colour'}</span>
    </article>
  );
}
