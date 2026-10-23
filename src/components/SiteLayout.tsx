import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import WhatsAppButton from './WhatsAppButton';
import MobileActionBar from './MobileActionBar';

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname, hash]);
  return null;
}

export default function SiteLayout() {
  return (
    <div className="pb-action-bar">
      <ScrollToTop />
      <Header />
      <main id="main" tabIndex={-1} className="pt-[var(--header-height)] outline-none">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
      <MobileActionBar />
    </div>
  );
}
