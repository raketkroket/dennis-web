import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-end overflow-hidden" aria-label="Hero sectie">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="headerimg.png"
          alt="Luxe badkamer met vrijstaand bad en houten accenten"
          width={1800}
          height={1200}
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A1208]/80 via-[#1A1208]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1208]/60 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pb-24 pt-40 w-full">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="w-8 h-px bg-[#8B6F47]" />
            <span className="text-xs tracking-[0.3em] uppercase text-[#C4A882] font-medium">
              Luxe badkamer- en binnenrenovaties
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-serif text-5xl md:text-6xl lg:text-7xl font-semibold text-white leading-[1.05] mb-6"
          >
            Vakmanschap.
            <br />
            <span className="text-[#C4A882]">Tot in detail.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-base md:text-lg text-[#D4C5A9]/80 leading-relaxed mb-10 max-w-lg"
          >
            Wij creëren badkamers en interieurs die rust, luxe en functionaliteit perfect combineren.
            Van ontwerp tot complete realisatie.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              to="/configurator"
              className="inline-flex items-center justify-center gap-2 bg-[#8B6F47] text-white font-medium px-8 py-4 rounded-full hover:bg-[#7A5F3A] hover:scale-105 transition-all duration-200 text-sm tracking-wide"
            >
              Prijs berekenen
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 border border-white/40 text-white font-medium px-8 py-4 rounded-full hover:bg-white/10 hover:border-white/70 transition-all duration-200 text-sm tracking-wide backdrop-blur-sm"
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
        <span className="text-[10px] tracking-[0.25em] uppercase text-white/40 rotate-90 origin-center mb-4">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-white/40 to-transparent" />
      </motion.div>
    </section>
  );
}