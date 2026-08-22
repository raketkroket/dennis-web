import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, MessageCircle, Phone, Mail, MapPin } from 'lucide-react';
import logo from '../../fotos/Denralogo.png';

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
const bedrijfsAdres = 'Almere, Noord-Holland, Nederland';

export default function Footer() {
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
                <div className="denra-label">Warm architectural luxury</div>
              </div>
            </div>
            <p className="text-sm text-[#5f544a] leading-relaxed max-w-sm mb-6">
              Luxe badkamer- en binnenrenovaties in Almere en Amsterdam. Rustige afwerking, sterke detaillering en een heldere manier van werken.
            </p>
            <p className="text-xs text-[#71665b] mb-6">
              Uitvoering door <span className="text-[#1d1712] font-medium">Denra Montage en Onderhoud</span>
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="DENRA op Instagram"
                className="w-10 h-10 rounded-sm border border-[#5c5147]/15 flex items-center justify-center text-[#71665b] hover:border-[#5c5147]/30 hover:text-[#1d1712] transition-all duration-200"
              >
                <Instagram size={16} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="DENRA op Facebook"
                className="w-10 h-10 rounded-sm border border-[#5c5147]/15 flex items-center justify-center text-[#71665b] hover:border-[#5c5147]/30 hover:text-[#1d1712] transition-all duration-200"
              >
                <Facebook size={16} />
              </a>
              <a
                href="https://wa.me/31614966756"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="DENRA op WhatsApp"
                className="w-10 h-10 rounded-sm border border-[#5c5147]/15 flex items-center justify-center text-[#71665b] hover:border-[#5c5147]/30 hover:text-[#1d1712] transition-all duration-200"
              >
                <MessageCircle size={16} />
              </a>
            </div>
          </div>

          {/* Diensten */}
          <div>
            <h3 className="denra-label mb-6">Diensten</h3>
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
            <h3 className="denra-label mb-6">Informatie</h3>
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
            <h3 className="denra-label mb-6">Contact</h3>
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
              <h4 className="denra-label mb-3">Locaties</h4>
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
              className="mt-6 flex items-center justify-center gap-2 bg-[#1d1712] text-[#F6F0E8] text-sm font-medium px-5 py-3 rounded-sm tracking-[0.14em] uppercase hover:bg-[#0f0d0b] transition-all duration-200 w-full"
            >
              <MessageCircle size={16} />
              WhatsApp ons
            </a>
          </div>
        </div>
      </div>

      {/* Sub-footer */}
      <div className="border-t border-[#5c5147]/12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#71665b]">
            &copy; 2026 DENRA. Alle rechten voorbehouden.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="text-xs text-[#71665b] hover:text-[#1d1712] transition-colors duration-200">
              Privacyverklaring
            </Link>
            <Link to="/algemene-voorwaarden" className="text-xs text-[#71665b] hover:text-[#1d1712] transition-colors duration-200">
              Algemene voorwaarden
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}