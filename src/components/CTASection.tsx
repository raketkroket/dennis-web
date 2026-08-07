import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Phone } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="py-24 bg-transparent" aria-label="Call to action">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="denra-line" />
            <span className="denra-label">Klaar om te beginnen?</span>
            <div className="denra-line" />
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-semibold text-[#1d1712] leading-tight mb-6">
            Uw droomrenovatie<br />begint hier
          </h2>
          <p className="text-[#5f544a] leading-relaxed mb-10 max-w-lg mx-auto">
            Vraag vrijblijvend een offerte aan of bereken direct uw renovatieprijs. Wij nemen binnen 24 uur contact met u op.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/configurator"
              className="inline-flex items-center justify-center gap-2 bg-[#1d1712] text-[#F6F0E8] font-medium px-8 py-4 rounded-sm tracking-[0.16em] uppercase hover:bg-[#0f0d0b] transition-all duration-200 text-sm"
            >
              Prijs berekenen
              <ArrowRight size={16} />
            </Link>
            <a
              href="tel:+31614966756"
              className="inline-flex items-center justify-center gap-2 border border-[#5c5147]/18 text-[#1d1712] font-medium px-8 py-4 rounded-sm tracking-[0.16em] uppercase hover:bg-[#1d1712] hover:text-white transition-all duration-200 text-sm"
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