# tp-app — T-Shirt Printing Storefront

A small Filipino-market t-shirt shop where customers can browse ready-made
tees, design their own from scratch, preview the result in **2D and 3D**, and
check out — all without an account, all in pesos.

This is the **frontend only**. Orders live in `localStorage` for now; the
plan is to wire it up to a Laravel API later for real persistence, auth,
and payments.

---

## What you can actually do here

- Shop page has 20 shirts right now. You can search by name, sort by price
  or name, and filter by color and price range.
- Each shirt has its own detail page at `/shop/[id]`. That page has the zoom
  lens, size picker, quantity controls, and add-to-cart button.
- The customize page lets you choose the shirt color, design, print spot,
  size, and quantity, then see the result right away.
- There is a 2D preview and a 3D preview. The 3D one can be rotated, and it
  also has auto-rotate if you want it.
- The cart is saved in `localStorage`, shipping is ₱120, and shipping becomes
  free once the total goes over ₱1,500.
- Checkout is just a demo flow for now. It creates a fake `TP-XXXX` reference
  number.

There is still no login, payment, or backend hooked up yet.

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

- Product photos are from Unsplash. Allowed hosts are set in `next.config.ts`.
- If an image fails, the UI falls back to the SVG shirt preview.
- The 3D preview uses `Decal` from drei.
- Decal depth is kept smaller than the shirt depth so prints do not show through to the back.
- Cart types are in `app/lib/types.ts`.
- Cart storage logic is in `app/lib/cart.tsx` using `tp-cart-v1`.
- If you move cart storage to Laravel later, `CartProvider` is the main place to change.
- There is no auth, payment, or backend in this repo yet.
