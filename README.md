# tp-app — T-Shirt Printing Storefront

A small Filipino-market t-shirt shop where customers can browse ready-made
tees, design their own from scratch, preview the result in **2D and 3D**, and
check out — all without an account, all in pesos.

This is the **frontend only**. Orders live in `localStorage` for now; the
plan is to wire it up to a Laravel API later for real persistence, auth,
and payments.

---

## What you can actually do here

- **Shop page** — browse 20 catalog tees with:
  - search by name
  - sort by price (low → high, high → low) or name
  - filter by color (multi-select) and price range (dual slider)
- **Product detail page** — every shirt has its own page (`/shop/[id]`)
  with a magnifying-glass loupe on hover, size picker (PH sizes:
  XSS / XS / S / M / L / XL / XXL), quantity stepper, and Add-to-Cart.
- **Customize page** — five-step builder: pick color → pick a design from
  the gallery → pick a placement → pick a size → pick a quantity. Live
  preview updates as you go.
- **2D + 3D preview** — toggle between a clean SVG mockup and a real
  Three.js shirt you can spin around (with optional auto-rotate).
- **Cart** — persisted in `localStorage`, shipping is ₱120 (free over
  ₱1,500), checkout generates a fake `TP-XXXX` reference number for now.

No login. No payment gateway. No backend. On purpose.

---

## Stack

| Thing | Version |
|---|---|
| Next.js (App Router, Turbopack) | 16.2.4 |
| React | 19.2.4 |
| Tailwind CSS | v4 (via `@tailwindcss/postcss`) |
| TypeScript | 5 (strict) |
| three / @react-three/fiber / @react-three/drei | latest |

Path alias `@/*` maps to the project root.

---

## Setup

You need **Node 20.9+** (Next 16 won't run on anything older). If you have
nvm:

```bash
nvm use 22
```

Then:

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

### Other scripts

```bash
npm run build   # production build
npm run start   # serve the build
npm run lint    # eslint
```

---

## Project layout

```
app/
  page.tsx              # landing page
  layout.tsx            # root layout + CartProvider
  globals.css           # tailwind v4 entry
  shop/
    page.tsx            # listing + filters
    [id]/
      page.tsx          # SSG product detail (generateStaticParams)
      ProductDetail.tsx # client-side picker + add-to-cart
  customize/page.tsx    # 5-step builder
  cart/page.tsx         # cart + fake checkout
  components/
    Header.tsx
    TshirtCard.tsx      # grid card with hover zoom
    TshirtImage.tsx     # <Image> with SVG fallback on error
    TshirtImageZoom.tsx # magnifier loupe
    TshirtPreview.tsx   # 2D SVG mockup
    Tshirt3D.tsx        # 3D shirt (R3F + drei Decals)
  lib/
    types.ts            # PHSize, ShirtColor, Placement, Cart types
    catalog.ts          # 20 tees + Unsplash photo map
    designs.ts          # design gallery
    cart.tsx            # CartProvider, useCart, formatPHP
public/
```

---

## Notes for whoever picks this up next

- Product photos come from Unsplash (`images.unsplash.com`,
  `plus.unsplash.com`) — both are whitelisted in `next.config.ts`. If a
  photo 404s, the card falls back to the SVG mockup so you never see a
  broken-image icon.
- The 3D shirt uses `<Decal>` from drei. Projection depth is intentionally
  smaller than the shirt's extrusion depth, otherwise the print bleeds
  through to the back side and shows up mirrored.
- Cart shape is in [`app/lib/types.ts`](app/lib/types.ts) and persistence
  lives in [`app/lib/cart.tsx`](app/lib/cart.tsx) under the storage key
  `tp-cart-v1`. When the Laravel API lands, `CartProvider` is the only
  place that needs to change.
- No auth, no checkout — by design. Add those on the API side, not here.
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
