import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, MessageCircle, Phone, Mail, MapPin } from 'lucide-react';

const diensten = [
  { label: 'Badkamerrenovatie', path: '/badkamerrenovatie' },
  { label: 'WC-renovatie', path: '/wc-renovatie' },
  { label: 'Binnenrenovatie', path: '/binnenrenovatie' },
  { label: 'Stucwerk', path: '/binnenrenovatie' },
  { label: 'Vloeren leggen', path: '/binnenrenovatie' },
  { label: 'Schilderwerk', path: '/binnenrenovatie' },
  { label: 'Verlaagd plafond & spotjes', path: '/binnenrenovatie' },
];

const informatie = [
  { label: 'Over ons', path: '/over-ons' },
  { label: 'Projecten', path: '/projecten' },
  { label: 'Prijs berekenen', path: '/configurator' },
  { label: 'Veelgestelde vragen', path: '/over-ons' },
  { label: 'Contact', path: '/contact' },
];

const locaties = ['Almere', 'Amsterdam', 'Amstelveen', 'Lelystad', "'t Gooi", 'Haarlem'];

export default function Footer() {
  return (
    <footer className="bg-white text-[#6B5D50] border-t border-[#E8DDD0]/70">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <span className="font-serif text-2xl font-semibold text-[#2C2416] tracking-wide">NIVORA</span>
              <div className="text-[10px] tracking-[0.25em] text-[#8B6F47] uppercase font-medium mt-0.5">
                Luxe Renovaties
              </div>
            </div>
            <p className="text-sm text-[#6B5D50] leading-relaxed max-w-xs mb-6">
              Luxe badkamer- en binnenrenovaties in Almere en Amsterdam. Vakmanschap tot in detail.
            </p>
            <p className="text-xs text-[#8A7A6A] mb-6">
              Uitvoering door <span className="text-[#2C2416] font-medium">Denra Montage en Onderhoud</span>
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Nivora op Instagram"
                className="w-9 h-9 rounded-full border border-[#E8DDD0] flex items-center justify-center text-[#8A7A6A] hover:border-[#D5C0A7] hover:text-[#8B6F47] transition-all duration-200"
              >
                <Instagram size={16} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Nivora op Facebook"
                className="w-9 h-9 rounded-full border border-[#E8DDD0] flex items-center justify-center text-[#8A7A6A] hover:border-[#D5C0A7] hover:text-[#8B6F47] transition-all duration-200"
              >
                <Facebook size={16} />
              </a>
              <a
                href="https://wa.me/31612345678"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Nivora op WhatsApp"
                className="w-9 h-9 rounded-full border border-[#E8DDD0] flex items-center justify-center text-[#8A7A6A] hover:border-[#D5C0A7] hover:text-[#8B6F47] transition-all duration-200"
              >
                <MessageCircle size={16} />
              </a>
            </div>
          </div>

          {/* Diensten */}
          <div>
            <h3 className="text-xs tracking-[0.2em] uppercase text-[#8B6F47] font-medium mb-6">Diensten</h3>
            <ul className="space-y-3">
              {diensten.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.path}
                    className="text-sm text-[#6B5D50] hover:text-[#8B6F47] transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Informatie */}
          <div>
            <h3 className="text-xs tracking-[0.2em] uppercase text-[#8B6F47] font-medium mb-6">Informatie</h3>
            <ul className="space-y-3">
              {informatie.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.path}
                    className="text-sm text-[#6B5D50] hover:text-[#8B6F47] transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs tracking-[0.2em] uppercase text-[#8B6F47] font-medium mb-6">Contact</h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="tel:+31612345678"
                  className="flex items-center gap-3 text-sm text-[#6B5D50] hover:text-[#8B6F47] transition-colors duration-200"
                >
                  <Phone size={14} className="text-[#8B6F47] shrink-0" />
                  06 123 45 678
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@nivora.nl"
                  className="flex items-center gap-3 text-sm text-[#6B5D50] hover:text-[#8B6F47] transition-colors duration-200"
                >
                  <Mail size={14} className="text-[#8B6F47] shrink-0" />
                  info@nivora.nl
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm text-[#6B5D50]">
                <MapPin size={14} className="text-[#8B6F47] shrink-0 mt-0.5" />
                Almere & Amsterdam
              </li>
            </ul>
            <div className="mt-6">
              <h4 className="text-xs tracking-[0.15em] uppercase text-[#8B6F47] font-medium mb-3">Locaties</h4>
              <div className="flex flex-wrap gap-1.5">
                {locaties.map((loc) => (
                  <span
                    key={loc}
                    className="text-xs text-[#6B5D50] bg-[#FAF8F5] border border-[#E8DDD0] px-2.5 py-1 rounded-full"
                  >
                    {loc}
                  </span>
                ))}
              </div>
            </div>
            <a
              href="https://wa.me/31612345678"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex items-center justify-center gap-2 bg-[#8B6F47] text-white text-sm font-medium px-5 py-3 rounded-full hover:bg-[#7A5F3A] hover:scale-105 transition-all duration-200 w-full"
            >
              <MessageCircle size={16} />
              WhatsApp ons
            </a>
          </div>
        </div>
      </div>

      {/* Sub-footer */}
      <div className="border-t border-[#E8DDD0]/70">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#8A7A6A]">
            &copy; 2026 Nivora. Alle rechten voorbehouden.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="text-xs text-[#8A7A6A] hover:text-[#8B6F47] transition-colors duration-200">
              Privacyverklaring
            </Link>
            <Link to="/algemene-voorwaarden" className="text-xs text-[#8A7A6A] hover:text-[#8B6F47] transition-colors duration-200">
              Algemene voorwaarden
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}