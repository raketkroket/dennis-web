import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './styles.css';

const container = document.getElementById('root')!;
const app = (
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// Pages are delivered as ready HTML (scripts/prerender.ts); React takes that
// markup over instead of drawing the page again. The admin and unknown
// addresses arrive with an empty root and are rendered normally.
if (container.hasChildNodes()) ReactDOM.hydrateRoot(container, app);
else ReactDOM.createRoot(container).render(app);
