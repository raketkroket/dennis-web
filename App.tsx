import React, { Suspense, lazy } from 'react';
import { LazyMotion } from 'framer-motion';
import { Routes, Route, useLocation } from 'react-router-dom';
import './styles.css';
import { LanguageProvider } from './src/i18n/LanguageProvider';
import { SiteContentProvider } from './src/content/SiteContentProvider';

import Home from './src/pages/Home';
import NotFound from './src/pages/NotFound';
import LocalServicePage from './src/pages/LocalServicePage';
import { useLanguage } from './src/i18n/useLanguage';
import { canonicalUrl, metaFor } from './src/seo/pages';
import { trackLinkClick } from './src/lib/analytics';

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

const localPages = {
  nl: {
  badkamerAlmere: {
    city: 'Almere',
    serviceType: 'badkamer' as const,
    title: 'Badkamer renovatie in Almere',
    intro: 'Denra Badkamers verzorgt complete badkamerrenovaties in Almere. Van sloopwerk, leidingwerk en tegelwerk tot sanitair, afwerking en luxe details: wij zorgen voor een badkamer die zowel mooi als functioneel is.',
    bullets: [
      'Complete renovatie, van sloop tot afwerking',
      'Een oplossing op maat voor kleine en grote badkamers',
      'Vaste communicatie, duidelijke planning en een transparante offerte',
      'Luxe materialen, moderne afwerkingen en duurzame kwaliteit',
      'Tegelwerk, vloerverwarming, verlaagd plafond en nisjes op maat',
      'Vakkundige uitvoering door een specialist in badkamerrenovaties',
    ],
    faq: [
      {
        question: 'Wat kost een badkamerrenovatie in Almere?',
        answer: 'De prijs hangt af van de omvang, het sanitair, de afwerking en het benodigde werk zoals leidingwerk of verlaagde plafonds. Wij geven vooraf een duidelijke, heldere offerte op maat.',
      },
      {
        question: 'Hoe lang duurt een badkamerrenovatie?',
        answer: 'Voor een complete badkamerrenovatie in Almere is vaak een projectduur van enkele weken nodig, afhankelijk van de omvang, materiaalselectie en eventuele technische aanpassingen.',
      },
      {
        question: 'Krijg ik een complete badkamer van A tot Z?',
        answer: 'Ja. Wij verzorgen het volledige traject: sloopwerk, leidingwerk, tegelwerk, sanitair, afwerking en styling, zodat u één aanspreekpunt heeft.',
      },
    ],
  },
  wcAlmere: {
    city: 'Almere',
    serviceType: 'wc' as const,
    title: 'WC-renovatie in Almere',
    intro: 'Bij Denra Badkamers maken we van uw WC of toilet een nette, stijlvolle en functionele ruimte. Wij verzorgen complete WC-renovaties in Almere, van sloopwerk en tegelwerk tot sanitair en afwerking.',
    bullets: [
      'Een nieuwe uitstraling en meer comfort',
      'Toilet renoveren of verbouwen met duurzame materialen',
      'Professionele montage van hangtoilet, inbouwreservoir en sanitair',
      'Tegelwerk, stucwerk en afwerking zonder onnodige complicaties',
      'Ruimtebesparende oplossingen voor kleine en compacte toiletten',
      'Vaste prijs en duidelijke planning van begin tot eind',
    ],
    faq: [
      {
        question: 'Wat kost een WC renovatie in Almere?',
        answer: 'De kosten verschillen per keuze aan tegelwerk, sanitair, leidingwerk en afwerking. Wij geven u graag een concrete indicatie op basis van uw ruimte en wensen.',
      },
      {
        question: 'Kan ik een kleine WC laten renoveren?',
        answer: 'Ja. Veel kleine toiletten kunnen prachtig worden opgewaardeerd met slimme materialen, een compacte indeling en een luxe uitstraling zonder grote verbouwing.',
      },
      {
        question: 'Kunnen jullie ook mijn toilet verbouwen?',
        answer: 'Ja, wij verzorgen ook complete toiletverbouwingen, inclusief leidingwerk, afwerking en het plaatsen van het sanitair.',
      },
    ],
  },
  wcAmsterdam: {
    city: 'Amsterdam',
    serviceType: 'wc' as const,
    title: 'WC-renovatie in Amsterdam',
    intro: 'Bij Denra Badkamers maken we van uw WC of toilet een nette, stijlvolle en functionele ruimte. Wij verzorgen complete WC-renovaties in Amsterdam, van sloopwerk en tegelwerk tot sanitair en afwerking.',
    bullets: ['Een nieuwe uitstraling en meer comfort', 'Toilet renoveren of verbouwen met duurzame materialen', 'Professionele montage van hangtoilet, inbouwreservoir en sanitair', 'Tegelwerk, stucwerk en afwerking zonder onnodige complicaties', 'Ruimtebesparende oplossingen voor kleine en compacte toiletten', 'Vaste prijs en duidelijke planning van begin tot eind'],
    faq: [{ question: 'Wat kost een WC renovatie in Amsterdam?', answer: 'De kosten verschillen per keuze aan tegelwerk, sanitair, leidingwerk en afwerking. Wij geven u graag een concrete indicatie op basis van uw ruimte en wensen.' }, { question: 'Kan ik een kleine WC laten renoveren?', answer: 'Ja. Veel kleine toiletten kunnen prachtig worden opgewaardeerd met slimme materialen, een compacte indeling en een luxe uitstraling zonder grote verbouwing.' }, { question: 'Kunnen jullie ook mijn toilet verbouwen?', answer: 'Ja, wij verzorgen ook complete toiletverbouwingen, inclusief leidingwerk, afwerking en het plaatsen van het sanitair.' }],
  },
  badkamerAmsterdam: {
    city: 'Amsterdam',
    serviceType: 'badkamer' as const,
    title: 'Badkamer renovatie in Amsterdam',
    intro: 'Denra Badkamers renoveert badkamers in Amsterdam van sloop en leidingwerk tot tegelwerk, sanitair en een luxe afwerking. U heeft één aanspreekpunt en een duidelijke planning, van de opname tot de oplevering.',
    bullets: [
      'Moderne en luxe ontwerpen, afgestemd op uw woning',
      'Aangepaste badkamerrenovatie voor kleine en grotere ruimtes',
      'Alles onder één dak: sloopwerk, tegelwerk, sanitair en afwerking',
      'Zorgvuldige uitvoering met oog voor detail en praktische indeling',
      'Mogelijkheid voor inloopdouche, bad, nisjes en verlaagd plafond',
      'Helder advies, vaste communicatielijnen en duidelijke offerte',
    ],
    faq: [
      {
        question: 'Wat is inbegrepen bij een complete badkamerrenovatie in Amsterdam?',
        answer: 'Bij een complete badkamerrenovatie verzorgen wij het werk van begin tot eind: sloop, leidingwerk, vloerafwerking, tegelwerk, sanitair en de laatste details.',
      },
      {
        question: 'Kan ik mijn badkamer in Amsterdam ook laten verbouwen?',
        answer: 'Ja. Wij helpen bij het plannen en uitvoeren van een volledige badkamer verbouwing, inclusief het aanpassen van de ruimte aan uw wensen en stijl.',
      },
      {
        question: 'Hoe krijg ik een offerte voor badkamer renovatie?',
        answer: 'U kunt eenvoudig contact opnemen voor een vrijblijvend gesprek. Daarna geven wij u een duidelijke offerte op basis van uw wensen en de bestaande ruimte.',
      },
    ],
  },
  },
  en: {
    badkamerAlmere: { city: 'Almere', serviceType: 'badkamer' as const, title: 'Bathroom renovation in Almere', intro: 'Denra Badkamers delivers complete bathroom renovations in Almere. From demolition, plumbing and tiling to sanitary ware, finishing and refined details: we create a bathroom that is both beautiful and functional.', bullets: ['Complete bathroom renovation in Almere, from demolition to finishing', 'Tailored solutions for small and large bathrooms', 'Consistent communication, clear planning and a transparent quote', 'Luxury materials, contemporary finishes and lasting quality', 'Tiling, underfloor heating, lowered ceilings and bespoke niches', 'Expert work by a bathroom-renovation specialist'], faq: [{ question: 'How much does a bathroom renovation in Almere cost?', answer: 'The price depends on the scale, sanitary ware, finishing and required work such as plumbing or lowered ceilings. We provide a clear, tailored quote in advance.' }, { question: 'How long does a bathroom renovation take?', answer: 'A complete bathroom renovation in Almere often takes several weeks, depending on the scope, material selection and any technical alterations.' }, { question: 'Will I receive a complete bathroom from start to finish?', answer: 'Yes. We manage the complete process: demolition, plumbing, tiling, sanitary ware, finishing and styling, so you have one point of contact.' }] },
    wcAlmere: { city: 'Almere', serviceType: 'wc' as const, title: 'Toilet renovation in Almere', intro: 'At Denra Badkamers, we turn your toilet into a neat, stylish and functional room. We deliver complete toilet renovations in Almere, from demolition and tiling to sanitary ware and finishing.', bullets: ['Toilet renovation in Almere for a new look and greater comfort', 'Toilet refurbishment with durable materials', 'Professional installation of wall-hung toilets, concealed cisterns and sanitary ware', 'Tiling, plastering and finishing without unnecessary complications', 'Space-saving solutions for small, compact toilets', 'A fixed price and clear planning from start to finish'], faq: [{ question: 'How much does a toilet renovation in Almere cost?', answer: 'Costs vary according to your choices of tiling, sanitary ware, plumbing and finishing. We are happy to provide a specific estimate based on your room and requirements.' }, { question: 'Can I renovate a small toilet?', answer: 'Yes. Many small toilets can be transformed beautifully with smart materials, a compact layout and a refined look, without major construction work.' }, { question: 'Do you also carry out full toilet refurbishments?', answer: 'Yes, we also manage complete toilet refurbishments and renovations, including plumbing, finishing and sanitary-ware installation.' }] },
    wcAmsterdam: { city: 'Amsterdam', serviceType: 'wc' as const, title: 'Toilet renovation in Amsterdam', intro: 'At Denra Badkamers, we turn your toilet into a neat, stylish and functional room. We deliver complete toilet renovations in Amsterdam, from demolition and tiling to sanitary ware and finishing.', bullets: ['Toilet renovation in Amsterdam for a new look and greater comfort', 'Toilet refurbishment with durable materials', 'Professional installation of wall-hung toilets, concealed cisterns and sanitary ware', 'Tiling, plastering and finishing without unnecessary complications', 'Space-saving solutions for small, compact toilets', 'A fixed price and clear planning from start to finish'], faq: [{ question: 'How much does a toilet renovation in Amsterdam cost?', answer: 'Costs vary according to your choices of tiling, sanitary ware, plumbing and finishing. We are happy to provide a specific estimate based on your room and requirements.' }, { question: 'Can I renovate a small toilet?', answer: 'Yes. Many small toilets can be transformed beautifully with smart materials, a compact layout and a refined look, without major construction work.' }, { question: 'Do you also carry out full toilet refurbishments?', answer: 'Yes, we also manage complete toilet refurbishments and renovations, including plumbing, finishing and sanitary-ware installation.' }] },
    badkamerAmsterdam: { city: 'Amsterdam', serviceType: 'badkamer' as const, title: 'Bathroom renovation in Amsterdam', intro: 'Denra Badkamers renovates bathrooms in Amsterdam, from demolition and plumbing to tiling, sanitary ware and a refined finish. You have one point of contact and a clear schedule, from the site visit to the handover.', bullets: ['Bathroom renovation in Amsterdam for contemporary, refined designs', 'Tailored bathroom renovation for small and larger rooms', 'Everything under one roof: demolition, tiling, sanitary ware and finishing', 'Careful execution with an eye for detail and practical layouts', 'Options for walk-in showers, baths, niches and lowered ceilings', 'Clear advice, consistent communication and a transparent quote'], faq: [{ question: 'What is included in a complete bathroom renovation in Amsterdam?', answer: 'With a complete bathroom renovation, we manage the work from start to finish: demolition, plumbing, floor finishing, tiling, sanitary ware and the final details.' }, { question: 'Can I have my bathroom remodelled in Amsterdam?', answer: 'Yes. We help plan and carry out a complete bathroom remodel, including adapting the room to your needs and style.' }, { question: 'How can I get a quote for a bathroom renovation?', answer: 'You can easily get in touch for a no-obligation consultation. We then provide a clear quote based on your requirements and the existing room.' }] },
  },
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
  <div className="min-h-screen bg-[#F5EFE6] flex items-center justify-center">
    <div className="w-8 h-8 border border-[#8E7A68]/20 border-t-[#231A12] rounded-full animate-spin" />
  </div>
);

const AppRoutes = () => {
  const { language } = useLanguage();
  const pages = localPages[language];

  return (
    <>
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
const App: React.FC = () => {
  return (
    <div className="denra-root">
      <LazyMotion features={loadMotionFeatures}>
        <SiteContentProvider>
          <LanguageProvider>
            <AppRoutes />
          </LanguageProvider>
        </SiteContentProvider>
      </LazyMotion>
    </div>
  );
};

export default App;