import React, { Suspense, lazy } from 'react';
import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles.css';
import { LanguageProvider } from './src/i18n/LanguageProvider';

import Home from './src/pages/Home';
import NotFound from './src/pages/NotFound';
import LocalServicePage from './src/pages/LocalServicePage';
import { useLanguage } from './src/i18n/useLanguage';

const Badkamerrenovatie = lazy(() => import('./src/pages/Badkamerrenovatie'));
const WCRenovatie = lazy(() => import('./src/pages/WCRenovatie'));
const Binnenrenovatie = lazy(() => import('./src/pages/Binnenrenovatie'));
const Projecten = lazy(() => import('./src/pages/Projecten'));
const OverOns = lazy(() => import('./src/pages/OverOns'));
const Contact = lazy(() => import('./src/pages/Contact'));
const ConfiguratorPage = lazy(() => import('./src/pages/ConfiguratorPage'));
const AlgemeneVoorwaarden = lazy(() => import('./src/pages/AlgemeneVoorwaarden'));
const Ervaringen = lazy(() => import('./src/pages/Ervaringen'));

const localPages = {
  nl: {
  badkamerAlmere: {
    city: 'Almere',
    serviceType: 'badkamer' as const,
    title: 'Badkamer renovatie Almere | Complete badkamerrenovatie',
    intro: 'Denra Badkamers verzorgt complete badkamerrenovaties in Almere. Van sloopwerk, leidingwerk en tegelwerk tot sanitair, afwerking en luxe details: wij zorgen voor een badkamer die zowel mooi als functioneel is.',
    bullets: [
      'Complete badkamer renovatie in Almere van sloop tot afwerking',
      'Op maat gemaakte oplossing voor kleine en grote badkamers',
      'Vaste communicatie, duidelijke planning en transparante offerte',
      'Luxe materials, moderne afwerkingen en duurzame kwaliteit',
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
    title: 'WC renovatie Almere | Toilet renovatie',
    intro: 'Bij Denra Badkamers maken we van uw WC of toilet een nette, stijlvolle en functionele ruimte. Wij verzorgen complete WC-renovaties in Almere, van sloopwerk en tegelwerk tot sanitair en afwerking.',
    bullets: [
      'WC renovatie Almere voor nieuwe uitstraling en meer comfort',
      'Toilet renovatie en toilet verbouwen met duurzame materialen',
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
        question: 'Doen jullie ook toilet verbouwen?',
        answer: 'Ja, wij verzorgen ook complete toilet verbouwingen en WC-renovaties, inclusief leidingwerk, afwerking en sanitair plaatsing.',
      },
    ],
  },
  wcAmsterdam: {
    city: 'Amsterdam',
    serviceType: 'wc' as const,
    title: 'WC renovatie Amsterdam | Toilet renovatie',
    intro: 'Bij Denra Badkamers maken we van uw WC of toilet een nette, stijlvolle en functionele ruimte. Wij verzorgen complete WC-renovaties in Amsterdam, van sloopwerk en tegelwerk tot sanitair en afwerking.',
    bullets: ['WC renovatie Amsterdam voor nieuwe uitstraling en meer comfort', 'Toilet renovatie en toilet verbouwen met duurzame materialen', 'Professionele montage van hangtoilet, inbouwreservoir en sanitair', 'Tegelwerk, stucwerk en afwerking zonder onnodige complicaties', 'Ruimtebesparende oplossingen voor kleine en compacte toiletten', 'Vaste prijs en duidelijke planning van begin tot eind'],
    faq: [{ question: 'Wat kost een WC renovatie in Amsterdam?', answer: 'De kosten verschillen per keuze aan tegelwerk, sanitair, leidingwerk en afwerking. Wij geven u graag een concrete indicatie op basis van uw ruimte en wensen.' }, { question: 'Kan ik een kleine WC laten renoveren?', answer: 'Ja. Veel kleine toiletten kunnen prachtig worden opgewaardeerd met slimme materialen, een compacte indeling en een luxe uitstraling zonder grote verbouwing.' }, { question: 'Doen jullie ook toilet verbouwen?', answer: 'Ja, wij verzorgen ook complete toilet verbouwingen en WC-renovaties, inclusief leidingwerk, afwerking en sanitair plaatsing.' }],
  },
  badkamerAmsterdam: {
    city: 'Amsterdam',
    serviceType: 'badkamer' as const,
    title: 'Badkamer renovatie Amsterdam | Complete badkamer',
    intro: 'Heeft u een badkamer renovatie in Amsterdam nodig? Denra Badkamers verzorgt complete badkamerrenovaties van sloop en leidingwerk tot tegelwerk, sanitair en luxe afwerking in een strak werkproces.',
    bullets: [
      'Badkamer renovatie Amsterdam voor moderne en luxe ontwerpen',
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
        question: 'Kan ik mijn badkamer laten verbouwen in Amsterdam?',
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
    badkamerAlmere: { city: 'Almere', serviceType: 'badkamer' as const, title: 'Bathroom renovation Almere | Complete bathroom renovation', intro: 'Denra Badkamers delivers complete bathroom renovations in Almere. From demolition, plumbing and tiling to sanitary ware, finishing and refined details: we create a bathroom that is both beautiful and functional.', bullets: ['Complete bathroom renovation in Almere, from demolition to finishing', 'Tailored solutions for small and large bathrooms', 'Consistent communication, clear planning and a transparent quote', 'Luxury materials, contemporary finishes and lasting quality', 'Tiling, underfloor heating, lowered ceilings and bespoke niches', 'Expert work by a bathroom-renovation specialist'], faq: [{ question: 'How much does a bathroom renovation in Almere cost?', answer: 'The price depends on the scale, sanitary ware, finishing and required work such as plumbing or lowered ceilings. We provide a clear, tailored quote in advance.' }, { question: 'How long does a bathroom renovation take?', answer: 'A complete bathroom renovation in Almere often takes several weeks, depending on the scope, material selection and any technical alterations.' }, { question: 'Will I receive a complete bathroom from start to finish?', answer: 'Yes. We manage the complete process: demolition, plumbing, tiling, sanitary ware, finishing and styling, so you have one point of contact.' }] },
    wcAlmere: { city: 'Almere', serviceType: 'wc' as const, title: 'Toilet renovation Almere | Toilet refurbishment', intro: 'At Denra Badkamers, we turn your toilet into a neat, stylish and functional room. We deliver complete toilet renovations in Almere, from demolition and tiling to sanitary ware and finishing.', bullets: ['Toilet renovation in Almere for a new look and greater comfort', 'Toilet refurbishment with durable materials', 'Professional installation of wall-hung toilets, concealed cisterns and sanitary ware', 'Tiling, plastering and finishing without unnecessary complications', 'Space-saving solutions for small, compact toilets', 'A fixed price and clear planning from start to finish'], faq: [{ question: 'How much does a toilet renovation in Almere cost?', answer: 'Costs vary according to your choices of tiling, sanitary ware, plumbing and finishing. We are happy to provide a specific estimate based on your room and requirements.' }, { question: 'Can I renovate a small toilet?', answer: 'Yes. Many small toilets can be transformed beautifully with smart materials, a compact layout and a refined look, without major construction work.' }, { question: 'Do you also carry out full toilet refurbishments?', answer: 'Yes, we also manage complete toilet refurbishments and renovations, including plumbing, finishing and sanitary-ware installation.' }] },
    wcAmsterdam: { city: 'Amsterdam', serviceType: 'wc' as const, title: 'Toilet renovation Amsterdam | Toilet refurbishment', intro: 'At Denra Badkamers, we turn your toilet into a neat, stylish and functional room. We deliver complete toilet renovations in Amsterdam, from demolition and tiling to sanitary ware and finishing.', bullets: ['Toilet renovation in Amsterdam for a new look and greater comfort', 'Toilet refurbishment with durable materials', 'Professional installation of wall-hung toilets, concealed cisterns and sanitary ware', 'Tiling, plastering and finishing without unnecessary complications', 'Space-saving solutions for small, compact toilets', 'A fixed price and clear planning from start to finish'], faq: [{ question: 'How much does a toilet renovation in Amsterdam cost?', answer: 'Costs vary according to your choices of tiling, sanitary ware, plumbing and finishing. We are happy to provide a specific estimate based on your room and requirements.' }, { question: 'Can I renovate a small toilet?', answer: 'Yes. Many small toilets can be transformed beautifully with smart materials, a compact layout and a refined look, without major construction work.' }, { question: 'Do you also carry out full toilet refurbishments?', answer: 'Yes, we also manage complete toilet refurbishments and renovations, including plumbing, finishing and sanitary-ware installation.' }] },
    badkamerAmsterdam: { city: 'Amsterdam', serviceType: 'badkamer' as const, title: 'Bathroom renovation Amsterdam | Complete bathroom', intro: 'Need a bathroom renovation in Amsterdam? Denra Badkamers delivers complete renovations from demolition and plumbing to tiling, sanitary ware and refined finishing in a structured working process.', bullets: ['Bathroom renovation in Amsterdam for contemporary, refined designs', 'Tailored bathroom renovation for small and larger rooms', 'Everything under one roof: demolition, tiling, sanitary ware and finishing', 'Careful execution with an eye for detail and practical layouts', 'Options for walk-in showers, baths, niches and lowered ceilings', 'Clear advice, consistent communication and a transparent quote'], faq: [{ question: 'What is included in a complete bathroom renovation in Amsterdam?', answer: 'With a complete bathroom renovation, we manage the work from start to finish: demolition, plumbing, floor finishing, tiling, sanitary ware and the final details.' }, { question: 'Can I have my bathroom remodelled in Amsterdam?', answer: 'Yes. We help plan and carry out a complete bathroom remodel, including adapting the room to your needs and style.' }, { question: 'How can I get a quote for a bathroom renovation?', answer: 'You can easily get in touch for a no-obligation consultation. We then provide a clear quote based on your requirements and the existing room.' }] },
  },
};

const PageLoader = () => (
  <div className="min-h-screen bg-[#F5EFE6] flex items-center justify-center">
    <div className="w-8 h-8 border border-[#8E7A68]/20 border-t-[#231A12] rounded-full animate-spin" />
  </div>
);

const AppRoutes = () => {
  const { language } = useLanguage();
  const pages = localPages[language];

  return (
    <Router>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/badkamer-renovatie" element={<Badkamerrenovatie />} />
            <Route path="/badkamerrenovatie" element={<Badkamerrenovatie />} />
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
        <ToastContainer
          position="top-right"
          autoClose={3000}
          newestOnTop
          closeOnClick
          pauseOnHover
        />
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <Theme appearance="inherit" radius="large" scaling="100%">
      <LanguageProvider>
        <AppRoutes />
      </LanguageProvider>
    </Theme>
  );
};

export default App;