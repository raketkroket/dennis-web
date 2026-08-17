import React from 'react';
import { motion } from 'framer-motion';

const stats = [
  { value: '100+', label: 'Tevreden klanten' },
  { value: '10+ jaar', label: 'Ervaring' },
  { value: 'Premium', label: 'Materialen' },
  { value: 'Strak', label: 'Ontwerp' },
  { value: '5 sterren', label: 'Google reviews' },
];

export default function StatsSection() {
  return (
    <section className="py-20 bg-transparent border-y border-[#5c5147]/12" aria-label="Statistieken">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              <div className="denra-line mx-auto mb-4" />
              <div className="font-serif text-3xl md:text-4xl font-semibold mb-2 text-[#1d1712]">
                {stat.value}
              </div>
              <div className="text-sm text-[#5f544a]">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}