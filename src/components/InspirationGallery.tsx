import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { sitePhotos } from '../data/sitePhotos';

const images = [
  { src: sitePhotos[3], alt: 'Badkamer projectfoto', span: 'col-span-1 row-span-2' },
  { src: sitePhotos[4], alt: 'Badkamer projectfoto', span: 'col-span-1' },
  { src: sitePhotos[5], alt: 'Binnenrenovatie projectfoto', span: 'col-span-1' },
  { src: sitePhotos[6], alt: 'Binnenrenovatie projectfoto', span: 'col-span-1' },
  { src: sitePhotos[8], alt: 'WC projectfoto', span: 'col-span-1' },
  { src: sitePhotos[9], alt: 'WC projectfoto', span: 'col-span-1' },
];

export default function InspirationGallery() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <section className="py-24 bg-transparent" aria-labelledby="inspiratie-heading">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="denra-line" />
            <span className="denra-label">Inspiratie</span>
            <div className="denra-line" />
          </div>
          <h2 id="inspiratie-heading" className="font-serif text-4xl md:text-5xl font-semibold text-[#1d1712] leading-tight">
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
              className={`${img.span} overflow-hidden rounded-sm group cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#5c5147] focus:ring-offset-2`}
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
            className="fixed inset-0 z-50 bg-[#120d09]/92 flex items-center justify-center p-6"
            onClick={() => setSelected(null)}
          >
            <button
              className="absolute top-6 right-6 w-10 h-10 rounded-sm bg-white/8 flex items-center justify-center text-white hover:bg-white/16 transition-colors duration-200"
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
              className="max-w-full max-h-[85vh] object-contain rounded-sm"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}