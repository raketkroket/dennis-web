import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App, { preloadPage } from './App.tsx';
import { unpackContent } from './src/content/bakedContent';
import type { SiteContent } from './src/content/types';
import './styles.css';

const container = document.getElementById('root')!;

const app = (initialContent: SiteContent | null) => (
  <React.StrictMode>
    <BrowserRouter>
      <App initialContent={initialContent} />
    </BrowserRouter>
  </React.StrictMode>
);

// The admin content the page was built with (see scripts/prerender.mjs).
// Without it the page was built with the built-in content.
async function bakedContent(): Promise<SiteContent | null> {
  const file = document.querySelector<HTMLMetaElement>('meta[name="denra-content"]')?.content;
  if (!file) return null;
  try {
    const response = await fetch(file);
    return response.ok ? unpackContent(await response.text()) : null;
  } catch {
    return null;
  }
}

// Pages are delivered as ready HTML (scripts/prerender.mjs); React takes that
// markup over instead of drawing the page again. Only the admin arrives with
// an empty root and is rendered normally.
if (container.hasChildNodes()) {
  // The prerendered page stays visible while its code and content load.
  Promise.all([bakedContent(), preloadPage(window.location.pathname).catch(() => undefined)]).then(([content]) => ReactDOM.hydrateRoot(container, app(content)));
} else {
  ReactDOM.createRoot(container).render(app(null));
}
