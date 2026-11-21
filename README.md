# Axcel Sports preview (Next.js)

A preview of the Axcel Sports store layout Brian asked for:

- **One listing per suit design.** The live store has a separate product for every colour (for example 8 "SFI Axcel Bratos Suit" listings). Here they are grouped into one design with round colour circles under the main image. Clicking a circle shows that colour.
- **Homepage hero** uses the exact image from the live homepage, shown whole at its own shape (never enlarged or cropped), with "Your passion drives us to Axcel" on the right side, away from the driver. On phones the text goes under the photo.
- **Real checkout.** "Add to cart and check out" sends the chosen variant to the official Shopify cart (`axcelsports.com/cart/<variant>:1`), so orders, payments and order emails stay in Shopify.
- Categories: SFI suits, karting, drag racing, powerboat, motorcycle, gloves, shoes, accessories. Streetwear and fan merchandise are left out for now.
- Where the store already has a combined listing for a design (for example "CAMPANELLA Karting Suit"), the older one-per-colour listings of that design are hidden, so each design appears once.

## Data

Products come from the store's public feed (`/products.json`). `npm run build` refreshes `data/products.json` first (the `prebuild` step). If the fetch fails, the build uses the saved snapshot.

To refresh by hand: `npm run fetch-products`.

## Run locally

```bash
npm install
npm run dev
```

## Deploy on Vercel

1. Push this folder to a new GitHub repository.
2. In Vercel, import the repository. The defaults work (framework: Next.js, build: `npm run build`).
3. Redeploy whenever you want fresh product data.

## Notes

- Colour circle names come from the codes in the product titles or image file names (for example "BFY"). Listings with no code show "Colour 1", "Colour 2" and so on.
- Prices, options and descriptions are the live store's, unchanged.

## Adding Brian's prices, images and text

Everything Brian sends goes into `data/overrides.json`, keyed by the design's URL slug (the part after `/products/`). Then rebuild.

```json
{
  "colourCodes": { "B": "Black", "W": "White", "R": "Red", "FY": "Fluo Yellow", "FG": "Fluo Green" },
  "designs": {
    "sfi-axcel-bratos-suit": {
      "priceIncrease": 25,
      "description": "<p>Brian's new text for this suit</p>",
      "colours": {
        "BG": { "name": "Black / Neon Green", "images": ["https://cdn.shopify.com/.../bratos-bg-front.png"] }
      },
      "colourOrder": ["Black / Neon Green", "Black / Orange"]
    },
    "sfi-axcel-molenaar-suit": { "price": 249.95 },
    "sfi-axcel-proton-suit": { "prices": { "Adult M": 259.95, "Youth S": 219.95 } },
    "some-old-design": { "hide": true }
  }
}
```

- `colourCodes`: turns codes like `BFYW` into "Black / Fluo Yellow / White" on every product. Codes it can't fully read stay as they are.
- `price` sets one price for the whole design. `prices` sets a price per option value (for example per size or layer). `priceIncrease` adds an amount to the current prices.
- `description` replaces the product text (HTML).
- `colours` renames a colour and/or swaps in new images for it, using the colour's current label.
- `hide` removes a design from the shop.

Note: these changes are for the preview only. Prices charged at checkout come from Shopify, so the same prices must be set in the Shopify admin.

## SEO and speed

- Every page has a title, description, canonical URL and share image. Product pages include Product structured data (price range, colours, stock).
- `/sitemap.xml` and `/robots.txt` are generated. Set `NEXT_PUBLIC_SITE_URL` in Vercel to the live domain so their links are correct.
- All pages are pre-built as static HTML. Images come from Shopify's CDN at the size each screen needs, and the hero image loads first.
