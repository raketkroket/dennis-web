import React from 'react';
import { motion } from 'framer-motion';

const stats = [
  { value: '100+', label: 'Tevreden klanten', color: 'text-[#8B6F47]' },
  { value: '5+ jaar', label: 'Ervaring', color: 'text-[#8B6F47]' },
  { value: 'Premium', label: 'Materialen', color: 'text-[#8B6F47]' },
  { value: 'Garantie', label: 'Op al ons werk', color: 'text-[#8B6F47]' },
  { value: '5 sterren', label: 'Google reviews', color: 'text-[#8B6F47]' },
];

export default function StatsSection() {
  return (
    <section className="py-20 bg-[#FAF8F5] border-y border-[#E8DDD0]/60" aria-label="Statistieken">
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
              <div className={`font-serif text-3xl md:text-4xl font-semibold mb-2 ${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-sm text-[#8A7A6A]">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}