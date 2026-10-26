import React from 'react';
import { prerenderToNodeStream } from 'react-dom/static';
import { StaticRouter } from 'react-router-dom/server';
import App from '../App';

export { pages, notFound, metaFor, canonicalUrl, siteUrl } from './seo/pages';
export { defaultBusiness } from './content/defaults';

async function renderOnce(url: string): Promise<string> {
  const { prelude } = await prerenderToNodeStream(
    <React.StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </React.StrictMode>,
    // One complete document: never split large sections out for streaming.
    { progressiveChunkSize: Number.MAX_SAFE_INTEGER },
  );
  const chunks: Buffer[] = [];
  for await (const chunk of prelude) chunks.push(Buffer.from(chunk));
  return Buffer.concat(chunks).toString('utf8');
}

/**
 * Renders one page to HTML at build time. The first pass loads the lazily
 * imported page code; the second renders with it in place, so the page comes
 * out in one piece instead of as a hidden copy that a script moves into place.
 */
export async function render(url: string): Promise<string> {
  await renderOnce(url);
  const html = await renderOnce(url);
  if (/<template|\$RC|hidden id="S:/.test(html)) throw new Error(`${url} still has a deferred part after the second render`);
  return html;
}
