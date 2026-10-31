import React from 'react';
import { prerenderToNodeStream } from 'react-dom/static';
import { StaticRouter } from 'react-router-dom/server';
import { createClient } from '@supabase/supabase-js';
import App from '../App';
import { defaultSiteContent, loadSiteContent } from './content/load';
import type { SiteContent } from './content/types';
import { supabaseAnonKey, supabaseConfigured, supabaseUrl } from './lib/env';

export { pages, notFound, metaFor, canonicalUrl, siteUrl } from './seo/pages';
export { defaultBusiness } from './content/defaults';
export { packContent } from './content/bakedContent';

/**
 * Dennis's content from the admin, read at build time so it is part of the
 * HTML of every page. Null without Supabase: the pages then use the built-in
 * content, as before.
 */
export async function loadPublishedContent(): Promise<SiteContent | null> {
  if (!supabaseConfigured) return null;
  const client = createClient(supabaseUrl, supabaseAnonKey, { auth: { persistSession: false } });
  return loadSiteContent(client, defaultSiteContent());
}

async function renderOnce(url: string, content: SiteContent | null): Promise<string> {
  const { prelude } = await prerenderToNodeStream(
    <React.StrictMode>
      <StaticRouter location={url}>
        <App initialContent={content} />
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
export async function render(url: string, content: SiteContent | null = null): Promise<string> {
  await renderOnce(url, content);
  const html = await renderOnce(url, content);
  if (/<template|\$RC|hidden id="S:/.test(html)) throw new Error(`${url} still has a deferred part after the second render`);
  return html;
}
