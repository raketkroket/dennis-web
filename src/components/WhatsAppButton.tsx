import { MessageCircle } from 'lucide-react';
import { useSiteContent } from '../content/SiteContentProvider';
import { useLanguage } from '../i18n/useLanguage';

// Desktop only: on smaller screens WhatsApp lives in the MobileActionBar.
export default function WhatsAppButton() {
  const { t } = useLanguage();
  const { business } = useSiteContent();
  return (
    <a
      href={`https://wa.me/${business.whatsappNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t('home.whatsappChat')}
      className="fixed bottom-6 right-6 z-30 hidden h-14 items-center gap-2 border border-denra-ink/15 bg-denra-paper px-4 text-sm font-medium text-denra-ink shadow-[0_10px_30px_rgba(35,26,18,0.12)] transition-colors hover:bg-denra-ink hover:text-denra-ivory lg:inline-flex"
    >
      <MessageCircle size={20} aria-hidden="true" />
      {t('site.whatsapp')}
    </a>
  );
}
