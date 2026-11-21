// Pulls the live Axcel Sports catalogue from Shopify's public product feed
// and saves a trimmed snapshot to data/products.json.
// Streetwear and fan merchandise are left out (out of scope for now).
import { writeFile } from 'node:fs/promises';

const STORE = 'https://www.axcelsports.com';
const SKIP_TYPES = new Set(['Axcel Streetwear', 'Fan Merchandise']);

async function fetchPage(page) {
  const res = await fetch(`${STORE}/products.json?limit=250&page=${page}`, {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) throw new Error(`Page ${page}: HTTP ${res.status}`);
  return (await res.json()).products;
}

const all = new Map();
for (let page = 1; page <= 20; page++) {
  const products = await fetchPage(page);
  if (!products.length) break;
  for (const p of products) all.set(p.id, p);
}

const trimmed = [...all.values()]
  .filter((p) => !SKIP_TYPES.has(p.product_type))
  .map((p) => ({
    id: p.id,
    title: p.title.replace(/\s+/g, ' ').trim(),
    handle: p.handle,
    type: p.product_type,
    tags: p.tags,
    body: p.body_html || '',
    options: p.options.map((o) => ({ name: o.name, values: o.values })),
    images: p.images.map((i) => ({ src: i.src, variantIds: i.variant_ids })),
    variants: p.variants.map((v) => ({
      id: v.id,
      price: v.price,
      compareAt: v.compare_at_price,
      available: v.available,
      options: [v.option1, v.option2, v.option3].filter((x) => x != null),
      image: v.featured_image ? v.featured_image.src : null,
    })),
  }));

if (trimmed.length < 50) throw new Error(`Only ${trimmed.length} products came back, keeping the old snapshot`);
await writeFile(new URL('../data/products.json', import.meta.url), JSON.stringify(trimmed));
console.log(`Saved ${trimmed.length} products (of ${all.size} in the store) to data/products.json`);
