import React, { Suspense, lazy } from 'react';
import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles.css';

import Home from './src/pages/Home';
import NotFound from './src/pages/NotFound';

const Badkamerrenovatie = lazy(() => import('./src/pages/Badkamerrenovatie'));
const WCRenovatie = lazy(() => import('./src/pages/WCRenovatie'));
const Binnenrenovatie = lazy(() => import('./src/pages/Binnenrenovatie'));
const Projecten = lazy(() => import('./src/pages/Projecten'));
const OverOns = lazy(() => import('./src/pages/OverOns'));
const Contact = lazy(() => import('./src/pages/Contact'));
const ConfiguratorPage = lazy(() => import('./src/pages/ConfiguratorPage'));

const PageLoader = () => (
  <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-[#8B6F47]/30 border-t-[#8B6F47] rounded-full animate-spin" />
  </div>
);

const App: React.FC = () => {
  return (
    <Theme appearance="inherit" radius="large" scaling="100%">
      <Router>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/badkamerrenovatie" element={<Badkamerrenovatie />} />
            <Route path="/wc-renovatie" element={<WCRenovatie />} />
            <Route path="/binnenrenovatie" element={<Binnenrenovatie />} />
            <Route path="/projecten" element={<Projecten />} />
            <Route path="/over-ons" element={<OverOns />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/configurator" element={<ConfiguratorPage />} />
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