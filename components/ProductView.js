'use client';
import { useMemo, useState, useEffect } from 'react';

const STORE_URL = 'https://www.axcelsports.com';

function img(src, w) {
  return src ? src + (src.includes('?') ? '&' : '?') + 'width=' + w : '';
}

function firstChoice(colourway) {
  const v = colourway.variants.find((x) => x.available) || colourway.variants[0];
  return v ? [...v.options] : [];
}

export default function ProductView({ design, initialColour = 0 }) {
  const start = Math.min(Math.max(initialColour, 0), design.colourways.length - 1);
  const [colourIdx, setColourIdx] = useState(start);
  const colourway = design.colourways[colourIdx];
  const [imageIdx, setImageIdx] = useState(0);
  const [choice, setChoice] = useState(() => firstChoice(design.colourways[start]));

  useEffect(() => {
    const c = Number(new URLSearchParams(window.location.search).get('c'));
    if (c > 0 && c < design.colourways.length) setColourIdx(c);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setImageIdx(0);
    // Keep the chosen size/options if the new colour has them.
    setChoice((prev) => {
      const ok = colourway.options.every((o, i) => o.values.includes(prev[i]));
      return ok ? prev : firstChoice(colourway);
    });
    const url = new URL(window.location.href);
    url.searchParams.set('c', String(colourIdx));
    window.history.replaceState(null, '', url);
  }, [colourIdx]); // eslint-disable-line react-hooks/exhaustive-deps

  const variant = useMemo(
    () => colourway.variants.find((v) => v.options.every((o, i) => o === choice[i])),
    [colourway, choice]
  );

  const price = variant ? variant.price : design.minPrice;
  const main = colourway.images[imageIdx] || colourway.images[0];
  const many = design.colourways.length > 1;

  return (
    <div className="pdp">
      <div className="gallery">
        <div className="gallery-main">
          <img src={img(main, 1200)} alt={`${design.name} in ${colourway.label}`} />
        </div>

        {many && (
          <div className="pdp-swatches">
            <div className="swatch-label">
              Colour: <strong>{colourway.label}</strong>
            </div>
            <div className="swatches swatches-lg" role="group" aria-label="Choose a colour">
              {design.colourways.map((c, i) => (
                <button
                  key={c.label}
                  type="button"
                  className={'swatch' + (i === colourIdx ? ' is-active' : '')}
                  onClick={() => setColourIdx(i)}
                  aria-label={c.label}
                  aria-pressed={i === colourIdx}
                  title={c.label}
                >
                  <img src={img(c.images[0], 120)} alt="" />
                </button>
              ))}
            </div>
          </div>
        )}

        {colourway.images.length > 1 && (
          <div className="thumbs">
            {colourway.images.map((src, i) => (
              <button
                key={src}
                type="button"
                className={'thumb' + (i === imageIdx ? ' is-active' : '')}
                onClick={() => setImageIdx(i)}
                aria-label={`Image ${i + 1}`}
              >
                <img src={img(src, 200)} alt="" loading="lazy" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="pdp-info">
        <h1>{design.name}</h1>
        <div className="pdp-price">
          ${price.toFixed(2)}
          {variant && variant.compareAt > variant.price && (
            <s className="compare">${variant.compareAt.toFixed(2)}</s>
          )}
        </div>

        {colourway.options.map((o, i) => (
          <label key={o.name} className="field">
            <span>{o.name}</span>
            <select
              value={choice[i] ?? ''}
              onChange={(e) => {
                const next = [...choice];
                next[i] = e.target.value;
                setChoice(next);
              }}
            >
              {o.values.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </label>
        ))}

        {variant && variant.available ? (
          <a className="btn-primary" href={`${STORE_URL}/cart/${variant.id}:1`}>
            Add to cart and check out
          </a>
        ) : (
          <button className="btn-primary" disabled>
            {variant ? 'Sold out' : 'Choose your options'}
          </button>
        )}
        <p className="pdp-note">Secure checkout on axcelsports.com. Your order goes straight to Axcel Sports.</p>

        {design.body && <div className="pdp-desc" dangerouslySetInnerHTML={{ __html: design.body }} />}
      </div>
    </div>
  );
}
