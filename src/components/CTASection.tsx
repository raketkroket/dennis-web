import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Phone } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="py-24 bg-white" aria-label="Call to action">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-6 h-px bg-[#D5C0A7]" />
            <span className="text-xs tracking-[0.25em] uppercase text-[#D5C0A7] font-medium">Klaar om te beginnen?</span>
            <div className="w-6 h-px bg-[#D5C0A7]" />
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-semibold text-[#2C2416] leading-tight mb-6">
            Uw droomrenovatie<br />begint hier
          </h2>
          <p className="text-[#6B5D50] leading-relaxed mb-10 max-w-lg mx-auto">
            Vraag vrijblijvend een offerte aan of bereken direct uw renovatieprijs. Wij nemen binnen 24 uur contact met u op.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/configurator"
              className="inline-flex items-center justify-center gap-2 bg-[#D5C0A7] text-[#2C2416] font-medium px-8 py-4 rounded-full hover:bg-[#C7AF94] hover:scale-105 transition-all duration-200 text-sm tracking-wide"
            >
              Prijs berekenen
              <ArrowRight size={16} />
            </Link>
            <a
              href="tel:+31612345678"
              className="inline-flex items-center justify-center gap-2 border border-[#2C2416]/20 text-[#2C2416] font-medium px-8 py-4 rounded-full hover:bg-[#2C2416] hover:text-white transition-all duration-200 text-sm tracking-wide"
            >
              <Phone size={16} />
              Bel ons direct
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}