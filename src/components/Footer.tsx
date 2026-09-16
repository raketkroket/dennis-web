import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, MessageCircle, Phone, Mail, MapPin } from 'lucide-react';
import logo from '../../fotos/Denralogo.png';
import tiktokIcon from '../../fotos/tiktokicon.png';
import { useLanguage } from '../i18n/useLanguage';

const locaties = [
  'Almere',
  'Amsterdam',
  'Amstelveen',
  'Lelystad',
  "'t Gooi",
  'Haarlem',
  'Blaricum',
  'Hilversum',
  'Laren',
  'Weesp',
  'Muiden',
  'Eemnes',
  'Diemen',
  'Muiderberg',
  'Naarden',
  'Amersfoort',
];
const bedrijfsAdres = 'Almere, Noord-Holland, Nederland';

export default function Footer() {
  const { t } = useLanguage();
  const diensten = [
    { label: t('form.bathroom'), path: '/badkamerrenovatie' }, { label: t('form.toilet'), path: '/wc-renovatie' }, { label: t('form.interior'), path: '/binnenrenovatie' }, { label: t('form.plastering'), path: '/binnenrenovatie' }, { label: t('form.floors'), path: '/binnenrenovatie' }, { label: t('form.painting'), path: '/binnenrenovatie' }, { label: t('form.ceiling'), path: '/binnenrenovatie' },
  ];
  const informatie = [
    { label: t('nav.about'), path: '/over-ons' }, { label: t('nav.projects'), path: '/projecten' }, { label: t('common.calculatePrice'), path: '/configurator' }, { label: t('shared.faq'), path: '/over-ons' }, { label: t('nav.contact'), path: '/contact' },
  ];
  return (
    <footer className="bg-transparent text-[#5f544a] border-t border-[#5c5147]/12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="mb-5 flex flex-col items-start gap-3">
              <img src={logo} alt="DENRA Badkamers" className="h-12 w-auto object-contain" />
              <div className="flex items-center gap-3">
                <span className="denra-line" />
                <div className="denra-label">{t('shared.footerTagline')}</div>
              </div>
            </div>
            <p className="text-sm text-[#5f544a] leading-relaxed max-w-sm mb-6">
              {t('shared.footerDescription')}
            </p>
            <p className="text-xs text-[#71665b] mb-6">
              {t('shared.performedBy')} <span className="text-[#1d1712] font-medium">Denra Montage en Onderhoud</span>
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://instagram.com/@denrabadkamers"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="DENRA Instagram"
                className="w-10 h-10 rounded-sm border border-[#5c5147]/15 flex items-center justify-center text-[#71665b] hover:border-[#5c5147]/30 hover:text-[#1d1712] transition-all duration-200"
              >
                <Instagram size={16} />
              </a>
              <a
                href="https://facebook.com/denrabadkamers"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="DENRA Facebook"
                className="w-10 h-10 rounded-sm border border-[#5c5147]/15 flex items-center justify-center text-[#71665b] hover:border-[#5c5147]/30 hover:text-[#1d1712] transition-all duration-200"
              >
                <Facebook size={16} />
              </a>
              <a
                href="https://wa.me/31614966756"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t('common.whatsappDenra')}
                className="w-10 h-10 rounded-sm border border-[#5c5147]/15 flex items-center justify-center text-[#71665b] hover:border-[#5c5147]/30 hover:text-[#1d1712] transition-all duration-200"
              >
                <MessageCircle size={16} />
              </a>
              <a
                href="https://www.tiktok.com/@denrabadkamers.nl"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="DENRA op TikTok"
                className="w-10 h-10 rounded-sm overflow-hidden transition-opacity duration-200 hover:opacity-75"
              >
                <img src={tiktokIcon} alt="" className="w-full h-full object-cover" />
              </a>
            </div>
          </div>

          {/* Diensten */}
          <div>
            <h3 className="denra-label mb-5">{t('shared.services')}</h3>
            <ul className="space-y-3">
              {diensten.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.path}
                    className="text-sm text-[#5f544a] hover:text-[#1d1712] transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Informatie */}
          <div>
            <h3 className="denra-label mb-5">{t('shared.legalInformation')}</h3>
            <ul className="space-y-3">
              {informatie.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.path}
                    className="text-sm text-[#5f544a] hover:text-[#1d1712] transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="denra-label mb-5">{t('nav.contact')}</h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="tel:+31614966756"
                  className="flex items-center gap-3 text-sm text-[#5f544a] hover:text-[#1d1712] transition-colors duration-200"
                >
                  <Phone size={14} className="text-[#5c5147] shrink-0" />
                  +31 6 14 96 67 56
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@denrabadkamers.nl"
                  className="flex items-center gap-3 text-sm text-[#5f544a] hover:text-[#1d1712] transition-colors duration-200"
                >
                  <Mail size={14} className="text-[#5c5147] shrink-0" />
                  info@denrabadkamers.nl
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm text-[#5f544a]">
                <MapPin size={14} className="text-[#5c5147] shrink-0 mt-0.5" />
                <span>{bedrijfsAdres}</span>
              </li>
            </ul>
            <div className="mt-6">
              <h4 className="denra-label mb-3">{t('shared.regions')}</h4>
              <div className="flex flex-wrap gap-1.5">
                {locaties.map((loc) => (
                  <span
                    key={loc}
                    className="text-xs text-[#5f544a] bg-[#e5ddcf] border border-[#5c5147]/12 px-2.5 py-1 rounded-sm"
                  >
                    {loc}
                  </span>
                ))}
              </div>
            </div>
            <a
              href="https://wa.me/31614966756"
              target="_blank"
              rel="noopener noreferrer"
              className="denra-button-primary mt-6 w-full"
            >
              <MessageCircle size={16} />
              {t('common.whatsappUs')}
            </a>
            <Link
              to="/algemene-voorwaarden"
              className="denra-button-secondary mt-3 w-full"
            >
              {t('shared.terms')}
            </Link>
          </div>
        </div>
      </div>

      {/* Sub-footer */}
      <div className="border-t border-[#5c5147]/12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#71665b]">
            &copy; 2026 DENRA. {t('shared.allRightsReserved')}
          </p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="text-xs text-[#71665b] hover:text-[#1d1712] transition-colors duration-200">
              {t('shared.privacy')}
            </Link>
            <Link to="/algemene-voorwaarden" className="text-xs text-[#71665b] hover:text-[#1d1712] transition-colors duration-200">
              {t('shared.terms')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}