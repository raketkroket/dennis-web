import { Link } from 'react-router-dom';
import { MessageCircle, Phone, ArrowRight } from 'lucide-react';
import { useSiteContent } from '../content/SiteContentProvider';
import { useLanguage } from '../i18n/useLanguage';

// Fixed contact bar on phones and tablets. Pages reserve its height with
// .pb-action-bar so it never covers content, and the desktop WhatsApp
// button is hidden at these sizes so nothing overlaps.
export default function MobileActionBar() {
  const { business } = useSiteContent();
  const { t } = useLanguage();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-denra-line bg-denra-ivory/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
      aria-label={t('site.quickActions')}
    >
      <div className="grid h-16 grid-cols-[1fr_1fr_1.6fr]">
        <a href={`tel:${business.phoneLink}`} className="flex flex-col items-center justify-center gap-1 text-[12px] font-medium text-denra-ink">
          <Phone size={18} aria-hidden="true" />
          {t('site.call')}
        </a>
        <a href={`https://wa.me/${business.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center gap-1 border-l border-denra-line text-[12px] font-medium text-denra-ink">
          <MessageCircle size={18} aria-hidden="true" />
          {t('site.whatsapp')}
        </a>
        <Link to="/contact" className="flex items-center justify-center gap-2 whitespace-nowrap bg-denra-ink px-3 text-[14px] font-medium text-denra-ivory">
          {t('site.quote')}
          <ArrowRight size={16} className="hidden min-[400px]:block" aria-hidden="true" />
        </Link>
      </div>
    </nav>
  );
}
