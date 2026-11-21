import raw from '@/data/products.json';

export const STORE_URL = 'https://www.axcelsports.com';

export const CATEGORIES = [
  { slug: 'sfi-suits', name: 'SFI Auto Racing Suits', blurb: 'SFI-rated, fire-resistant driver suits.' },
  { slug: 'karting-suits', name: 'Karting Suits', blurb: 'CIK karting suits for youth and adult drivers.' },
  { slug: 'drag-racing-suits', name: 'Drag Racing Suits', blurb: 'SFI 3.2A/15 and 3.2A/20 drag racing suits.' },
  { slug: 'powerboat-suits', name: 'Powerboat Suits', blurb: 'Kevlar-lined suits that meet APBA and UIM requirements.' },
  { slug: 'motorcycle-suits', name: 'Motorcycle Suits', blurb: 'One-piece road racing leathers.' },
  { slug: 'gloves', name: 'Gloves', blurb: 'Driver gloves in youth and adult sizes.' },
  { slug: 'shoes', name: 'Shoes', blurb: 'Racing shoes, including SFI 3.3/5 rated models.' },
  { slug: 'accessories', name: 'Accessories', blurb: 'Bags and other racing gear.' },
];

const CUSTOM_TYPES = new Set(['Custom Apparel', 'Custom Race Suits', 'Custom Racing Leathers', 'teamwear']);

function categoryOf(p) {
  const t = p.title.toLowerCase();
  const tags = (p.tags || []).map((x) => x.toLowerCase());
  if (CUSTOM_TYPES.has(p.type)) return null;
  if (t.includes('embroidery')) return null;
  if (t.includes('powerboat')) return 'powerboat-suits';
  if (t.includes('drag')) return 'drag-racing-suits';
  if (p.type === 'Off The Rack Motorcycle Racing Suits' || t.includes('motorcycle')) return 'motorcycle-suits';
  if (t.includes('glove') || p.type === 'gloves' || p.type === 'SFI Gloves') return 'gloves';
  if (t.includes('shoe') || p.type === 'shoes' || p.type === 'SFI Shoes') return 'shoes';
  if (t.includes('suit') || p.type === 'race suit' || p.type === 'SFI Suits') {
    if (t.includes('karting') || (!t.includes('sfi') && p.type !== 'SFI Suits' && tags.includes('kart'))) return 'karting-suits';
    if (t.includes('sfi') || p.type === 'SFI Suits') return 'sfi-suits';
    return 'karting-suits';
  }
  return 'accessories';
}

// Colour codes in titles look like "WRB", "BFGW", "BBW2".
const CODE = /^[A-Z]{1,6}\d{0,2}$/;

function splitTitle(title) {
  const words = title.split(' ');
  // "Tech 2 Suit WRBG" -> code at the end
  if (words.length > 2 && CODE.test(words[words.length - 1])) {
    return { base: words.slice(0, -1).join(' '), code: words[words.length - 1] };
  }
  // "SFI Axcel ProTech BRW Suit" -> code before the last word
  if (words.length > 3 && CODE.test(words[words.length - 2]) && words[words.length - 1].toLowerCase() === 'suit') {
    return { base: [...words.slice(0, -2), words[words.length - 1]].join(' '), code: words[words.length - 2] };
  }
  return { base: title, code: null };
}

function codeFromImage(src) {
  if (!src) return null;
  const file = src.split('/').pop().split('?')[0];
  const m = file.match(/-([A-Z]{1,6}\d{0,2})(?:_[0-9a-f-]+)?\.(?:png|jpe?g|webp)$/);
  return m ? m[1] : null;
}

export function slugify(s) {
  return s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function img(src, width) {
  if (!src) return '';
  return src + (src.includes('?') ? '&' : '?') + 'width=' + width;
}

const COLOUR_OPTION = /^colou?rs?$/i;

// One product listing becomes one or more colourways.
function colourwaysOf(p, fallbackIndex) {
  const colourIdx = p.options.findIndex((o) => COLOUR_OPTION.test(o.name) && o.values.length > 1);
  if (colourIdx >= 0) {
    // Already a combined listing: one colourway per Color value.
    const otherOptions = p.options.filter((_, i) => i !== colourIdx);
    return p.options[colourIdx].values.map((colour) => {
      const variants = p.variants.filter((v) => v.options[colourIdx] === colour);
      const ids = new Set(variants.map((v) => v.id));
      const linked = p.images.filter((i) => i.variantIds.some((id) => ids.has(id))).map((i) => i.src);
      const featured = variants.map((v) => v.image).filter(Boolean);
      const images = [...new Set([...featured, ...linked])];
      return {
        label: colour,
        handle: p.handle,
        images: images.length ? images : p.images.slice(0, 1).map((i) => i.src),
        options: otherOptions,
        variants: variants.map((v) => ({
          id: v.id,
          price: Number(v.price),
          compareAt: v.compareAt ? Number(v.compareAt) : null,
          available: v.available,
          options: v.options.filter((_, i) => i !== colourIdx),
        })),
      };
    });
  }
  const { code } = splitTitle(p.title);
  const label = code || codeFromImage(p.images[0]?.src) || `Colour ${fallbackIndex + 1}`;
  return [
    {
      label,
      handle: p.handle,
      images: p.images.map((i) => i.src),
      options: p.options.filter((o) => !(o.name === 'Title' && o.values[0] === 'Default Title')),
      variants: p.variants.map((v) => ({
        id: v.id,
        price: Number(v.price),
        compareAt: v.compareAt ? Number(v.compareAt) : null,
        available: v.available,
        options: v.options,
      })),
    },
  ];
}

const NOISE = new Set(['axcel', "axcel's", 'suit', 'suits', 'racing', 'karting', 'kart', 'gloves', 'glove', 'driver',
  'driving', 'shoes', 'shoe', 'leather', 'certified', 'sfi', '3.2a/5', '3.3/5', 'cik', 'and', '3.2a/15', '3.2a/20', 'drag', 'rcaing']);

function designKey(d) {
  let n = d.name.toLowerCase();
  const youth = n.includes('(youth)');
  const sfi = n.includes('sfi');
  n = n.replace('(youth)', ' ').replace(/[–\-&()]/g, ' ').replace(/\bii\b/g, '2').replace('pro tech', 'protech').replace('hemesphire', 'hemisphere');
  const core = n.split(/\s+/).filter((w) => w && !NOISE.has(w)).join(' ');
  return [d.category, youth ? 'y' : 'a', sfi ? 's' : 'n', core].join('|');
}

function build() {
  const groups = new Map();
  for (const p of raw) {
    const category = categoryOf(p);
    if (!category) continue;
    const { base } = splitTitle(p.title);
    const key = category + '|' + base.toLowerCase();
    if (!groups.has(key)) groups.set(key, { category, name: base, products: [] });
    groups.get(key).products.push(p);
  }

  const designs = [];
  for (const g of groups.values()) {
    g.products.sort((a, b) => a.handle.localeCompare(b.handle, undefined, { numeric: true }));
    const colourways = g.products.flatMap((p, i) => colourwaysOf(p, i));
    // Merge repeated labels so circles stay unique.
    const seen = new Map();
    for (const c of colourways) {
      const n = (seen.get(c.label) || 0) + 1;
      seen.set(c.label, n);
      if (n > 1) c.label = `${c.label} (${n})`;
    }
    const prices = colourways.flatMap((c) => c.variants.map((v) => v.price)).filter((x) => x > 0);
    const body = g.products.reduce((best, p) => (p.body.length > best.length ? p.body : best), '');
    designs.push({
      slug: slugify(g.name),
      name: g.name,
      category: g.category,
      body,
      minPrice: prices.length ? Math.min(...prices) : 0,
      oldListings: g.products.length,
      colourways,
    });
  }
  // Where the store already has a combined listing for a design (one product with
  // colour options), hide the older one-listing-per-colour version of the same design,
  // so each design shows once.
  const byKey = new Map();
  for (const d of designs) {
    const k = designKey(d);
    if (!byKey.has(k)) byKey.set(k, []);
    byKey.get(k).push(d);
  }
  const keep = [];
  for (const list of byKey.values()) {
    const combined = list.filter((d) => d.oldListings === 1 && d.colourways.length > 1);
    keep.push(...(combined.length ? combined : list));
  }
  designs.length = 0;
  designs.push(...keep);

  // Keep URLs short; add the category only when two designs share a name.
  const used = new Map();
  for (const d of designs) used.set(d.slug, (used.get(d.slug) || 0) + 1);
  for (const d of designs) if (used.get(d.slug) > 1) d.slug = slugify(d.category + ' ' + d.name);

  designs.sort((a, b) => b.colourways.length - a.colourways.length || a.name.localeCompare(b.name));
  return designs;
}

const DESIGNS = build();

export function allDesigns() {
  return DESIGNS;
}

export function designsIn(category) {
  return DESIGNS.filter((d) => d.category === category);
}

export function designBySlug(slug) {
  return DESIGNS.find((d) => d.slug === slug);
}

export function categoryBySlug(slug) {
  return CATEGORIES.find((c) => c.slug === slug);
}

// Small version for cards: no variants or descriptions.
export function cardData(d) {
  return {
    slug: d.slug,
    name: d.name,
    minPrice: d.minPrice,
    colourways: d.colourways.map((c) => ({ label: c.label, image: c.images[0] || '' })),
  };
}

export function stats() {
  return {
    designs: DESIGNS.length,
    listings: DESIGNS.reduce((n, d) => n + d.oldListings, 0),
  };
}

export function money(n) {
  return '$' + n.toFixed(2);
}

export function safeHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, '')
    .replace(/\son\w+="[^"]*"/gi, '')
    .replace(/<meta[^>]*>/gi, '');
}
