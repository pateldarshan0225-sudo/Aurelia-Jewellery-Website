# Aurélia Jewels demo

A local, frontend-only jewellery catalogue. All product descriptions, prices, imagery, contact details and brand identity are samples for replacement.

## Run

Install Node.js, then run `npm install` and `npm run dev`. Use `npm run build` for production and `npm run check-images` to check local image paths.

## Make it yours

- Edit brand name, tagline, city, contact placeholders and demo mode in `src/config/siteConfig.js`. The text logo is the `Logo` component in `src/App.jsx`.
- Set `VITE_WHATSAPP_NUMBER` in a `.env` file (copy `.env.example`) to digits including the country code, or set `whatsappNumber` in the config. Leave blank to display the demo dialog.
- Edit colours in the `:root` variables in `src/styles/main.css`. Fonts are linked in `index.html` and set in that CSS file.
- Edit categories and products in `src/data/products.js`. Prices are sample values, not live rates. Keep category slugs consistent.
- The PNG images in `public/images/products/` are AI-generated sample product photos and should be replaced with properly licensed jewellery photographs. Update each product's `image` and `images` paths in the data, and replace the home and about image paths in `src/App.jsx`. Keep meaningful alt text and check image paths after replacement.
- Replace the sample story, address, phone, email, map and social details with client-approved information. The contact form is intentionally not connected.

## Deploy

Deploy the repository to Netlify or Vercel with build command `npm run build` and output directory `dist`. Set `VITE_WHATSAPP_NUMBER` in the host's environment settings. `public/_redirects` and `vercel.json` provide SPA route fallback respectively.
