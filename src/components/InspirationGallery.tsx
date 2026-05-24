import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const images = [
  { src: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&q=80', alt: 'Vrijstaand bad in luxe badkamer', span: 'col-span-1 row-span-2' },
  { src: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=600&q=80', alt: 'Marmeren badkamer detail', span: 'col-span-1' },
  { src: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&q=80', alt: 'Moderne WC renovatie', span: 'col-span-1' },
  { src: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80', alt: 'Luxe woonkamer interieur', span: 'col-span-1' },
  { src: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80', alt: 'Moderne badkamer met inloopdouche', span: 'col-span-1' },
  { src: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=600&q=80', alt: 'Houten badkamer meubel detail', span: 'col-span-1' },
];

export default function InspirationGallery() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <section className="py-24 bg-[#FAF8F5]" aria-labelledby="inspiratie-heading">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="w-6 h-px bg-[#D5C0A7]" />
            <span className="text-xs tracking-[0.25em] uppercase text-[#D5C0A7] font-medium">Inspiratie</span>
            <div className="w-6 h-px bg-[#D5C0A7]" />
          </div>
          <h2 id="inspiratie-heading" className="font-serif text-4xl md:text-5xl font-semibold text-[#2C2416] leading-tight">
            Laat je inspireren
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 auto-rows-[220px]">
          {images.map((img, i) => (
            <motion.button
              key={img.src}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className={`${img.span} overflow-hidden rounded-2xl group cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#D5C0A7] focus:ring-offset-2`}
              onClick={() => setSelected(img.src)}
              aria-label={`Bekijk foto: ${img.alt}`}
            >
              <img
                src={img.src}
                alt={img.alt}
                width={600}
                height={400}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </motion.button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-6"
            onClick={() => setSelected(null)}
          >
            <button
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors duration-200"
              onClick={() => setSelected(null)}
              aria-label="Sluiten"
            >
              <X size={20} />
            </button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={selected}
              alt="Vergroot afbeelding"
              width={1200}
              height={800}
              className="max-w-full max-h-[85vh] object-contain rounded-xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}