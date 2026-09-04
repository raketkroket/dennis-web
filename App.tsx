import React, { Suspense, lazy } from 'react';
import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles.css';

import Home from './src/pages/Home';
import NotFound from './src/pages/NotFound';
import LocalServicePage from './src/pages/LocalServicePage';

const Badkamerrenovatie = lazy(() => import('./src/pages/Badkamerrenovatie'));
const WCRenovatie = lazy(() => import('./src/pages/WCRenovatie'));
const Binnenrenovatie = lazy(() => import('./src/pages/Binnenrenovatie'));
const Projecten = lazy(() => import('./src/pages/Projecten'));
const OverOns = lazy(() => import('./src/pages/OverOns'));
const Contact = lazy(() => import('./src/pages/Contact'));
const ConfiguratorPage = lazy(() => import('./src/pages/ConfiguratorPage'));
const AlgemeneVoorwaarden = lazy(() => import('./src/pages/AlgemeneVoorwaarden'));

const localPages = {
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
};

const PageLoader = () => (
  <div className="min-h-screen bg-[#F5EFE6] flex items-center justify-center">
    <div className="w-8 h-8 border border-[#8E7A68]/20 border-t-[#231A12] rounded-full animate-spin" />
  </div>
);

const App: React.FC = () => {
  return (
    <Theme appearance="inherit" radius="large" scaling="100%">
      <Router>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/badkamer-renovatie" element={<Badkamerrenovatie />} />
            <Route path="/badkamerrenovatie" element={<Badkamerrenovatie />} />
            <Route path="/wc-renovatie" element={<WCRenovatie />} />
            <Route path="/badkamer-renovatie-almere" element={<LocalServicePage {...localPages.badkamerAlmere} />} />
            <Route path="/wc-renovatie-almere" element={<LocalServicePage {...localPages.wcAlmere} />} />
            <Route path="/badkamer-renovatie-amsterdam" element={<LocalServicePage {...localPages.badkamerAmsterdam} />} />
            <Route path="/wc-renovatie-amsterdam" element={<LocalServicePage {...localPages.wcAlmere} />} />
            <Route path="/binnenrenovatie" element={<Binnenrenovatie />} />
            <Route path="/projecten" element={<Projecten />} />
            <Route path="/over-ons" element={<OverOns />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/configurator" element={<ConfiguratorPage />} />
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
    </Theme>
  );
};

export default App;