import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

import heroImage from '../../headerimg.png';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden" aria-label="Hero sectie">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Luxe badkamer met vrijstaand bad en warme materialen"
          width={1800}
          height={1200}
          className="w-full h-full object-cover object-center brightness-[0.78] contrast-[0.92] saturate-[0.88]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#120d09]/82 via-[#120d09]/42 to-[#120d09]/18" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#120d09]/58 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-28 md:py-32 w-full">
        <div className="max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="w-10 h-px bg-[#f3ece2]/50" />
            <span className="text-xs tracking-[0.34em] uppercase text-[#f3ece2]/78 font-medium">
              Luxe badkamer- en binnenrenovaties
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold text-[#f4eee5] leading-[0.96] mb-6 max-w-[22rem]"
          >
            Warm architectural luxury.
            <br />
            <span className="text-[#ddd3c5]">Voor badkamers met rust.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-base md:text-lg text-[#fffaf3] font-medium leading-relaxed mb-10 max-w-md"
            style={{ textShadow: '0 2px 8px rgba(18, 13, 9, 0.72)' }}
          >
            Wij creëren badkamers en interieurs met natuurlijke materialen, sterke lijnen en een kalme, hoogwaardige uitstraling.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              to="/configurator"
              className="inline-flex items-center justify-center gap-2 bg-[#f4eee5] text-[#120d09] font-medium px-8 py-4 rounded-sm hover:bg-[#e5dbcd] transition-all duration-200 text-sm tracking-[0.16em] uppercase"
            >
              Prijs berekenen
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 border border-[#f4eee5]/34 text-[#f4eee5] font-medium px-8 py-4 rounded-sm hover:bg-[#f4eee5] hover:text-[#120d09] transition-all duration-200 text-sm tracking-[0.16em] uppercase backdrop-blur-sm"
            >
              Plan adviesgesprek
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 right-8 hidden lg:flex flex-col items-center gap-2"
      >
        <span className="text-[10px] tracking-[0.28em] uppercase text-white/30 rotate-90 origin-center mb-4">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-white/30 to-transparent" />
      </motion.div>
    </section>
  );
}