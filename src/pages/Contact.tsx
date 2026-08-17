import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ContactForm from '../components/ContactForm';
import WhatsAppButton from '../components/WhatsAppButton';
import { sitePhotos } from '../data/sitePhotos';

const contactInfo = [
  { icon: Phone, label: 'Telefoon', value: '+31 6 14 96 67 56', href: 'tel:+31614966756' },
  { icon: Mail, label: 'E-mail', value: 'info@denra.nl', href: 'mailto:info@denra.nl' },
  { icon: MapPin, label: 'Bedrijfsadres', value: 'Almere, Noord-Holland, Nederland', href: undefined },
  { icon: Clock, label: 'Bereikbaar', value: 'Ma–Za: 08:00–18:00', href: undefined },
];

export default function Contact() {
  return (
    <>
      <Header />
      <main>
        <section className="pt-40 pb-24 bg-[#f6f0e8]" aria-label="Contact">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16">
              {/* Left */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="denra-line" />
                  <span className="denra-label">Neem contact op</span>
                </div>
                <h1 className="font-serif text-5xl md:text-6xl font-semibold text-[#231A12] leading-tight mb-6">
                  Laten we kennismaken
                </h1>
                <p className="text-[#6B5D50] leading-relaxed mb-10 max-w-md">
                  Heeft u een renovatieproject in gedachten? Neem vrijblijvend contact op. Wij reageren binnen 24 uur.
                </p>

                <div className="space-y-5 mb-10">
                  {contactInfo.map((item) => (
                    <div key={item.label} className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-sm bg-[#f4ede4] border border-[#cfbca7]/55 flex items-center justify-center shrink-0">
                        <item.icon size={18} className="text-[#7a6552]" />
                      </div>
                      <div>
                        <p className="text-xs text-[#8A7A6A] mb-0.5">{item.label}</p>
                        {item.href ? (
                          <a href={item.href} className="text-sm font-medium text-[#231A12] hover:text-[#7a6552] transition-colors duration-200">
                            {item.value}
                          </a>
                        ) : (
                          <p className="text-sm font-medium text-[#231A12]">{item.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="rounded-2xl overflow-hidden aspect-[16/9]">
                  <img
                    src={sitePhotos[10]}
                    alt="DENRA showroom interieur"
                    width={800}
                    height={450}
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>

              {/* Right — Form */}
              <motion.div
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="bg-[#faf6f0] rounded-sm p-8 md:p-10 border border-[#cfbca7]/55"
              >
                  <h2 className="font-serif text-2xl font-semibold text-[#231A12] mb-2">Stuur ons een bericht</h2>
                <p className="text-sm text-[#8A7A6A] mb-8">Wij nemen binnen 24 uur contact met u op.</p>
                <ContactForm />
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}