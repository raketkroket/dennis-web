// Writes a ready HTML file for every public page after `vite build`, so
// search engines and link previews get the page text, title and description
// without running JavaScript. In the browser React takes this markup over
// (index.tsx). Also writes 404.html, sitemap.xml and an empty shell for the
// admin (see vercel.json).
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = resolve(import.meta.dirname, '..');
const dist = join(root, 'dist');
const ssrDir = join(root, 'dist-ssr');
const server = await import(pathToFileURL(join(ssrDir, 'entry-server.js')).href);
const { pages, notFound, canonicalUrl, siteUrl, render } = server;

const template = await readFile(join(dist, 'index.html'), 'utf8');

const escapeHtml = (value) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function withMeta(html, page) {
  const url = canonicalUrl(page);
  const replacements = [
    [/<title>[^<]*<\/title>/, `<title>${escapeHtml(page.title)}</title>`],
    [/(<meta name="description" content=")[^"]*(")/, `$1${escapeHtml(page.description)}$2`],
    [/(<meta property="og:title" content=")[^"]*(")/, `$1${escapeHtml(page.title)}$2`],
    [/(<meta property="og:description" content=")[^"]*(")/, `$1${escapeHtml(page.description)}$2`],
    [/(<meta name="twitter:title" content=")[^"]*(")/, `$1${escapeHtml(page.title)}$2`],
    [/(<meta name="twitter:description" content=")[^"]*(")/, `$1${escapeHtml(page.description)}$2`],
    [/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`],
    [/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`],
    [/(<meta name="robots" content=")[^"]*(")/, `$1${page.noindex ? 'noindex, follow' : 'index, follow'}$2`],
  ];
  const result = replacements.reduce((current, [pattern, value]) => {
    if (!pattern.test(current)) throw new Error(`index.html is missing ${pattern}`);
    return current.replace(pattern, value);
  }, html);
  // Pages that are not indexed have no canonical address.
  return page.noindex ? result.replace(/\s*<link rel="canonical"[^>]*>/, '') : result;
}

// Home › page, for every page below the homepage.
function breadcrumbs(page) {
  if (page.path === '/' || page.noindex) return '';
  const name = page.title.split(/ \| |: /)[0];
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` },
      { '@type': 'ListItem', position: 2, name, item: canonicalUrl(page) },
    ],
  };
  return `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;
}

// /projecten is served from projecten.html (cleanUrls in vercel.json).
const target = (path) => (path === '/' ? join(dist, 'index.html') : join(dist, `${path.slice(1)}.html`));

async function writePage(page, url, file) {
  const rendered = await render(url);
  if (!rendered.includes('<main')) throw new Error(`Prerendered ${page.path} has no <main>`);
  // React puts image preload hints in front of the markup; they belong in <head>.
  // Only the high-priority hint (the hero photo) is kept, so it is not held
  // up by photos further down the page.
  const allHints = rendered.match(/^(?:<link [^>]*\/?>)*/)[0];
  const markup = rendered.slice(allHints.length);
  const hints = (allHints.match(/<link [^>]*\/?>/g) ?? []).filter((hint) => hint.includes('fetchPriority="high"')).join('');
  const html = withMeta(template, page)
    .replace('</head>', `${hints}${breadcrumbs(page)}</head>`)
    .replace('<div id="root"></div>', `<div id="root">${markup}</div>`);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, html);
}

for (const page of pages) await writePage(page, page.path, target(page.path));

// Vercel answers unknown addresses with this page and a real 404 status.
await writePage(notFound, '/404', join(dist, '404.html'));

// The admin: the plain app, not indexed.
const shell = withMeta(template, { path: '/', title: 'Denra Badkamers', description: pages[0].description, noindex: true });
await writeFile(join(dist, 'app.html'), shell);

const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.filter((page) => !page.noindex).map((page) => `  <url><loc>${siteUrl}${page.path}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>
`;
await writeFile(join(dist, 'sitemap.xml'), sitemap);
await rm(ssrDir, { recursive: true, force: true });
console.log(`Prerendered ${pages.length} pages and wrote sitemap.xml`);
