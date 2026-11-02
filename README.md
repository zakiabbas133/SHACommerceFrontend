# NexaTech — Upgrade your tech

A responsive computer hardware and electronics storefront built with React, TypeScript, Vite, React Router, Motion, Lucide React, and regular CSS.

## Run locally

```sh
npm install
npm run dev
```

## Storefront

- Component, graphics, memory, storage, gaming, audio, mobile and laptop parts catalog.
- Product models, SKUs, manufacturer specifications and explicitly scoped compatibility notes.
- Brand, price, technical-spec, rating, availability and sale filters; sorting; URL-backed search and category routes.
- Responsive category mega menu, search suggestions, recent searches and product discovery.
- Persistent cart and wishlist, animated cart drawer, stock-aware quantities, and `NEXA10` demo coupon.
- Demo checkout, account and order history. No payment is processed and no real order is submitted.

## Project structure

- `src/pages/` — independently maintained route pages.
- `src/components/` — shared layout, product, cart, and form UI.
- `src/data/products.ts` — catalog models, category hierarchy and mock catalog.
- `src/store/` — persistent cart and wishlist state.
- `src/context/` — app-level store UI actions.
- `src/styles/` — shared commerce styles; page and component styles are colocated.

Catalog data is currently local mock data; this workspace did not contain a configured ASP.NET Core API client or service layer. The UI consumes a centralized product/category model so an API-backed repository can replace the mock catalog without changing the route structure. Cart, wishlist, demo account, order history, and recent searches persist in browser local storage.

## Commands

- `npm run dev` — local development server
- `npm run build` — TypeScript check and production build
- `npm run lint` — ESLint
- `npm run preview` — preview the production build
