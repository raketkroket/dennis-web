import React, { Suspense, lazy } from 'react';
import { LazyMotion, MotionConfig } from 'framer-motion';
import { Routes, Route, useLocation } from 'react-router-dom';
import './styles.css';
import { LanguageProvider } from './src/i18n/LanguageProvider';
import { SiteContentProvider } from './src/content/SiteContentProvider';
import type { SiteContent } from './src/content/types';

import Home from './src/pages/Home';
import NotFound from './src/pages/NotFound';
import LocalServicePage from './src/pages/LocalServicePage';
import { canonicalUrl, metaFor } from './src/seo/pages';
import { trackLinkClick } from './src/lib/analytics';
import { useSiteContent } from './src/content/SiteContentProvider';
import { useHasMounted } from './src/lib/hydration';
import { defaultThemeId, isThemeId, themeContentKey, themeStylesheet } from './src/lib/theme';

// Pages load as separate files. Before React takes over a prerendered page,
// index.tsx loads that page's file first (preloadPage), so the whole page is
// taken over at once instead of being redrawn when the file arrives.
type PageModule = { default: React.ComponentType };
function lazyPage(load: () => Promise<PageModule>) {
  let Loaded: React.ComponentType | null = null;
  const preload = () => load().then((module) => {
    Loaded = module.default;
    return module;
  });
  const Lazy = lazy(preload);
  const Page = () => (Loaded ? <Loaded /> : <Lazy />);
  return Object.assign(Page, { preload });
}

const Badkamerrenovatie = lazyPage(() => import('./src/pages/Badkamerrenovatie'));
const BadkamerRenovatieKosten = lazyPage(() => import('./src/pages/BadkamerRenovatieKosten'));
const WCRenovatie = lazyPage(() => import('./src/pages/WCRenovatie'));
const Binnenrenovatie = lazyPage(() => import('./src/pages/Binnenrenovatie'));
const Projecten = lazyPage(() => import('./src/pages/Projecten'));
const OverOns = lazyPage(() => import('./src/pages/OverOns'));
const Contact = lazyPage(() => import('./src/pages/Contact'));
const ConfiguratorPage = lazyPage(() => import('./src/pages/ConfiguratorPage'));
const AlgemeneVoorwaarden = lazyPage(() => import('./src/pages/AlgemeneVoorwaarden'));
const Ervaringen = lazyPage(() => import('./src/pages/Ervaringen'));

const pagesByPath: Record<string, { preload: () => Promise<unknown> }> = {
  '/badkamerrenovatie': Badkamerrenovatie,
  '/badkamer-renovatie': Badkamerrenovatie,
  '/badkamer-renovatie-kosten': BadkamerRenovatieKosten,
  '/wc-renovatie': WCRenovatie,
  '/binnenrenovatie': Binnenrenovatie,
  '/projecten': Projecten,
  '/over-ons': OverOns,
  '/contact': Contact,
  '/configurator': ConfiguratorPage,
  '/algemene-voorwaarden': AlgemeneVoorwaarden,
  '/ervaringen': Ervaringen,
};

/** Loads the file of the page at this address, if it is a separately loaded page. */
// eslint-disable-next-line react-refresh/only-export-components
export const preloadPage = (pathname: string) => pagesByPath[pathname.replace(/\/+$/, '') || '/']?.preload() ?? Promise.resolve();

const AdminApp = lazy(() => import('./src/admin/AdminApp'));

// The city pages; their texts are in the translations (localBadkamerAlmere and
// so on), so Dennis can change them in the admin like any other text.
const localPages = {
  badkamerAlmere: { city: 'Almere', serviceType: 'badkamer' as const, textKey: 'localBadkamerAlmere' },
  wcAlmere: { city: 'Almere', serviceType: 'wc' as const, textKey: 'localWcAlmere' },
  wcAmsterdam: { city: 'Amsterdam', serviceType: 'wc' as const, textKey: 'localWcAmsterdam' },
  badkamerAmsterdam: { city: 'Amsterdam', serviceType: 'badkamer' as const, textKey: 'localBadkamerAmsterdam' },
};

// The animation features load as a separate file after the page is shown.
const loadMotionFeatures = () => import('./src/lib/motionFeatures').then((module) => module.default);

// Title, description and canonical link of the current page.
function RouteMeta() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    const page = metaFor(pathname);
    document.title = page.title;
    const setMeta = (selector: string, value: string) => document.head.querySelector(selector)?.setAttribute('content', value);
    setMeta('meta[name="description"]', page.description);
    setMeta('meta[property="og:title"]', page.title);
    setMeta('meta[property="og:description"]', page.description);
    setMeta('meta[property="og:url"]', canonicalUrl(page));
    setMeta('meta[name="robots"]', page.noindex ? 'noindex, follow' : 'index, follow');
    document.head.querySelector('link[rel="canonical"]')?.setAttribute('href', canonicalUrl(page));
  }, [pathname]);
  return null;
}

// The colour scheme chosen in the admin (Uitstraling). "?kleur=<scheme>" in
// the address previews a scheme without saving it.
function ThemeStyle() {
  const { texts } = useSiteContent();
  const hasMounted = useHasMounted();
  const preview = hasMounted ? new URLSearchParams(window.location.search).get('kleur') : null;
  const chosen = texts[themeContentKey]?.nl;
  const id = isThemeId(preview) ? preview : isThemeId(chosen) ? chosen : defaultThemeId;
  const css = themeStylesheet(id);
  return css ? <style>{css}</style> : null;
}

// Phone, e-mail, WhatsApp and call-to-action clicks, for the whole site.
function TrackClicks() {
  React.useEffect(() => {
    document.addEventListener('click', trackLinkClick, { capture: true });
    return () => document.removeEventListener('click', trackLinkClick, { capture: true });
  }, []);
  return null;
}

// Start each new page at the top (the router keeps the old scroll position).
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  React.useEffect(() => {
    if (!hash) window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname, hash]);
  return null;
}

const PageLoader = () => (
  <div className="min-h-screen bg-c-f5efe6 flex items-center justify-center">
    <div className="w-8 h-8 border border-c-8e7a68/20 border-t-c-231a12 rounded-full animate-spin" />
  </div>
);

const AppRoutes = () => {
  const pages = localPages;

  return (
    <>
        <ThemeStyle />
        <ScrollToTop />
        <RouteMeta />
        <TrackClicks />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/admin/*" element={<AdminApp />} />
            <Route path="/" element={<Home />} />
            <Route path="/badkamer-renovatie" element={<Badkamerrenovatie />} />
            <Route path="/badkamerrenovatie" element={<Badkamerrenovatie />} />
            <Route path="/badkamer-renovatie-kosten" element={<BadkamerRenovatieKosten />} />
            <Route path="/wc-renovatie" element={<WCRenovatie />} />
            <Route path="/badkamer-renovatie-almere" element={<LocalServicePage {...pages.badkamerAlmere} />} />
            <Route path="/wc-renovatie-almere" element={<LocalServicePage {...pages.wcAlmere} />} />
            <Route path="/badkamer-renovatie-amsterdam" element={<LocalServicePage {...pages.badkamerAmsterdam} />} />
            <Route path="/wc-renovatie-amsterdam" element={<LocalServicePage {...pages.wcAmsterdam} />} />
            <Route path="/binnenrenovatie" element={<Binnenrenovatie />} />
            <Route path="/projecten" element={<Projecten />} />
            <Route path="/over-ons" element={<OverOns />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/configurator" element={<ConfiguratorPage />} />
            <Route path="/ervaringen" element={<Ervaringen />} />
            <Route path="/algemene-voorwaarden" element={<AlgemeneVoorwaarden />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
    </>
  );
};

// The router is added by the entry file: BrowserRouter in the browser,
// StaticRouter when the build writes the HTML for each page.
// initialContent: Dennis's content as it was baked into the page at build
// time (scripts/prerender.mjs), so the page and React start from the same text.
const App: React.FC<{ initialContent?: SiteContent | null }> = ({ initialContent }) => {
  return (
    <div className="denra-root">
      <LazyMotion features={loadMotionFeatures}>
        {/* Visitors who ask for less motion get fades without movement. */}
        <MotionConfig reducedMotion="user">
        <SiteContentProvider initialContent={initialContent ?? null}>
          <LanguageProvider>
            <AppRoutes />
          </LanguageProvider>
        </SiteContentProvider>
        </MotionConfig>
      </LazyMotion>
    </div>
  );
};

export default App;