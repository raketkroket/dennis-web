import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App, { preloadPage } from './App.tsx';
import './styles.css';

const container = document.getElementById('root')!;
const app = (
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// Pages are delivered as ready HTML (scripts/prerender.mjs); React takes that
// markup over instead of drawing the page again. Only the admin arrives with
// an empty root and is rendered normally.
if (container.hasChildNodes()) {
  // The prerendered page stays visible while its code loads.
  preloadPage(window.location.pathname).finally(() => ReactDOM.hydrateRoot(container, app));
} else {
  ReactDOM.createRoot(container).render(app);
}
