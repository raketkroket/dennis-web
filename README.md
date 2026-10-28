# Denra Badkamers website

React 19, Vite, TypeScript and Tailwind, hosted on Vercel with serverless functions in `api/` and optional Supabase for content management. Dennis manages projects, photos, texts, FAQs, prices, reviews and quote requests at `/admin` (Dutch guide: [docs/BEHEER.md](docs/BEHEER.md)).

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Site on localhost, including the `api/*` functions. |
| `npm run build` | Production build: the site, then a ready HTML file per page (`scripts/prerender.mjs`), `404.html` and `sitemap.xml`. |
| `npm run typecheck` | Site, API and tooling. |
| `npm run lint` | ESLint. |
| `npm test` | Calculator rules (prices, Dutch decimals, double counting). |
| `npm run test:db` | Applies all migrations to an in-process Postgres and checks permissions. |
| `npm run cms:seed-sql` | Regenerates the seed migration from `src/content/defaults.ts`. |

Supabase, environment variables and the first admin account: [supabase/README.md](supabase/README.md). Trying the admin locally without a live project: [tools/local-supabase](tools/local-supabase/README.md).

## How it fits together

- **Content**: `src/content/defaults.ts` holds the built-in content (projects with their photos, business details, FAQs). `SiteContentProvider` shows it immediately and replaces it with the live content from Supabase when configured; each part falls back separately if it cannot be loaded.
- **Photos**: project photos in `fotos/` are listed once in `staticPhotos` under a stable key and served as responsive WebP by `vite-imagetools` (`src/content/photoLibrary.ts`). Photos Dennis uploads are resized in the browser and stored in the `project-photos` bucket.
- **Texts**: `src/i18n/translations.ts` holds Dutch and English texts. Texts edited in the admin are stored per translation key and override the built-in text; `src/admin/contentFields.ts` lists which texts are editable.
- **Search engines**: every public page is written out as finished HTML at build time (`src/entry-server.tsx` renders it, `scripts/prerender.mjs` writes `dist/<page>.html` with that page's title, description, canonical link and breadcrumb data). In the browser React takes this HTML over (`hydrateRoot` in `index.tsx`); anything read from browser storage (language, calculator draft, quote) is applied right after that first render (`src/lib/hydration.ts`). Titles and descriptions live in `src/seo/pages.ts`; add a new public page there too. `vercel.json` serves `/projecten` from `projecten.html`, returns `404.html` with a 404 status for unknown addresses and sends only `/admin` to the empty app shell (`app.html`, written as `/app` because of cleanUrls).
- **Photo descriptions**: `src/content/photoAlt.ts` describes what is visible in each built-in photo; it is the alt text on the site and was copied into the database by `20261026120000_photo_alt_text.sql`. Descriptions Dennis edits under Foto's take precedence.
- **Calculator**: `src/lib/calculator.ts` is the single implementation of the pricing rules, used by the calculator, the admin preview and `api/offerte.ts`, which recalculates every total on the server.

## Decisions and open points

These need a decision or a check by Dennis; nothing here was changed silently.

- **Placeholder reviews removed.** `src/data/reviews.ts` contained 25 reviews marked "DEMO / PLACEHOLDER – replace with verified customer reviews before production". They were shown on the live site and are removed. The photo `fotos/joost amsterdam review.png` (an extension, not a bathroom) was attached to the placeholder "Joost, Amsterdam Centrum" bathroom review; it now belongs to the genuine 2021 review from Joost in Amsterdam about an extension. The average rating is now calculated (4,7 from 14 reviews) instead of the hard-coded 4,1.
- **Toilet-frame options.** "Inbouwreservoir / toiletframe", "Geberit Duofix inclusief montage", "Toiletframe ombouwen" and "Compleet hangtoilet-systeem" could all be selected together, counting the same frame and boxing-in two or three times. They are now marked as not combinable (choosing one replaces the overlapping ones); prices are unchanged. Dennis can change these rules under Calculator en prijzen.
- **WC prices differ between pages.** The calculator's WC base price is €3.950, while the WC page shows a "basisprijs" of €4.250 and ranges of €3.800–€5.200 and €5.500–€6.500. Both are kept as they were; Dennis should confirm which is right.
- **VAT.** The site says "incl. btw" next to calculator prices, as before. Nothing else about VAT was added.
- **Business address.** The site says "Almere, Noord-Holland", but Almere is in Flevoland, and the terms and conditions give an Amsterdam address. Editable under Bedrijfsgegevens.
- **"Beelthoven"** is the location of six projects. It may be a misspelling of Bilthoven; kept as entered.
- **"100+ tevreden klanten" and "10+ jaar ervaring"** on Over ons come from the previous site and are not verified here. They can be changed or hidden under Website aanpassen.
- **Visually identical photos.** `badkamer2.png`/`badkamer67.jpeg` and `wc6.jpeg`/`wc8.png` are the same pictures. The duplicate project (same photo, same location) is merged; the files are kept. `src/data/sitePhotos.ts` keeps the numbering the page designs use and points each number at the photo library, loading each picture once.
- **Rendered-looking photos.** Most photos in `fotos/` named `badkamer…`, `wc…`, `binnen…`, `binnenrenovatie…` and `headerimg.png` look like computer visualisations rather than photos of finished work, while the review photos (Partoredjo, Natalie, Nikie, Amersfoort) look like real photos. They are shown under "Gerealiseerde projecten" with place names. Dennis should confirm these are his own projects; if they are designs or examples, the wording or the photos should change.
- **Before/after.** Only one genuine "during the work" photo exists (`Partoredjo4.jpg`); it is labelled as such. Before/after pairs appear automatically once Dennis marks photos that way.
- **Privacy and cookies.** Google Analytics (`index.html`) loads without consent, and there is no privacy statement (the old footer linked to a missing `/privacy` page; the link is removed). With quote requests now stored, a privacy statement and a decision on analytics consent are needed.
- **Static SEO data.** The business structured data and social preview image in `index.html` are not updated from the admin; change them there if the business details change.
- **www address.** `https://www.denrabadkamers.nl` gives a certificate error: the name points to Vercel but is not added to the Vercel project. Add it under Vercel → Project → Settings → Domains and let it redirect to `denrabadkamers.nl`.
- **Prerendered content is the built-in content.** The HTML files are made at build time from `src/content/defaults.ts`; projects and texts Dennis changes in the admin appear after the page loads (and for search engines once they render the page). Search engines that run JavaScript (Google does) see the admin version too.
