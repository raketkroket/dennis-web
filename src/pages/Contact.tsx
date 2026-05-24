import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ContactForm from '../components/ContactForm';
import WhatsAppButton from '../components/WhatsAppButton';

const contactInfo = [
  { icon: Phone, label: 'Telefoon', value: '06 123 45 678', href: 'tel:+31612345678' },
  { icon: Mail, label: 'E-mail', value: 'info@nivora.nl', href: 'mailto:info@nivora.nl' },
  { icon: MapPin, label: 'Werkgebied', value: 'Almere & Amsterdam', href: undefined },
  { icon: Clock, label: 'Bereikbaar', value: 'Ma–Za: 08:00–18:00', href: undefined },
];

export default function Contact() {
  return (
    <>
      <Header />
      <main>
        <section className="pt-40 pb-24 bg-[#FAF8F5]" aria-label="Contact">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16">
              {/* Left */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-6 h-px bg-[#8B6F47]" />
                  <span className="text-xs tracking-[0.25em] uppercase text-[#8B6F47] font-medium">Neem contact op</span>
                </div>
                <h1 className="font-serif text-5xl md:text-6xl font-semibold text-[#2C2416] leading-tight mb-6">
                  Laten we kennismaken
                </h1>
                <p className="text-[#6B5D50] leading-relaxed mb-10 max-w-md">
                  Heeft u een renovatieproject in gedachten? Neem vrijblijvend contact op. Wij reageren binnen 24 uur.
                </p>

                <div className="space-y-5 mb-10">
                  {contactInfo.map((item) => (
                    <div key={item.label} className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[#8B6F47]/10 flex items-center justify-center shrink-0">
                        <item.icon size={18} className="text-[#8B6F47]" />
                      </div>
                      <div>
                        <p className="text-xs text-[#8A7A6A] mb-0.5">{item.label}</p>
                        {item.href ? (
                          <a href={item.href} className="text-sm font-medium text-[#2C2416] hover:text-[#8B6F47] transition-colors duration-200">
                            {item.value}
                          </a>
                        ) : (
                          <p className="text-sm font-medium text-[#2C2416]">{item.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="rounded-2xl overflow-hidden aspect-[16/9]">
                  <img
                    src="https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=800&q=80"
                    alt="Nivora showroom interieur"
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
                className="bg-white rounded-3xl p-8 md:p-10 border border-[#E8DDD0]/60 shadow-sm"
              >
                <h2 className="font-serif text-2xl font-semibold text-[#2C2416] mb-2">Stuur ons een bericht</h2>
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