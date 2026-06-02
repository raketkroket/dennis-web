import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { sitePhotos } from '../data/sitePhotos';

const projects = [
  {
    id: 1,
    title: 'Luxe badkamer Almere',
    category: 'Complete renovatie',
    image: sitePhotos[2],
    tag: 'Badkamer',
  },
  {
    id: 2,
    title: 'WC-renovatie Amsterdam',
    category: 'Modern en stijlvol',
    image: sitePhotos[3],
    tag: 'WC',
  },
  {
    id: 3,
    title: 'Binnenrenovatie Almere Poort',
    category: 'Stucwerk, vloeren en schilderwerk',
    image: sitePhotos[4],
    tag: 'Binnen',
  },
];

export default function ProjectsSection() {
  return (
    <section className="py-24 bg-white" aria-labelledby="projecten-heading">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-px bg-[#8B6F47]" />
              <span className="text-xs tracking-[0.25em] uppercase text-[#8B6F47] font-medium">Recente projecten</span>
            </div>
            <h2 id="projecten-heading" className="font-serif text-4xl md:text-5xl font-semibold text-[#2C2416] leading-tight">
              Onze gerealiseerde<br />projecten
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link
              to="/projecten"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#8B6F47] border border-[#8B6F47]/40 px-6 py-3 rounded-full hover:bg-[#8B6F47] hover:text-white transition-all duration-200 whitespace-nowrap"
            >
              Bekijk alle projecten
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="group cursor-pointer"
            >
              <Link to="/projecten" className="block">
                <div className="relative overflow-hidden rounded-2xl aspect-[4/3] mb-4">
                  <img
                    src={project.image}
                    alt={project.title}
                    width={800}
                    height={600}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1208]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="absolute top-4 left-4 text-xs tracking-[0.15em] uppercase bg-white/90 text-[#8B6F47] px-3 py-1.5 rounded-full font-medium">
                    {project.tag}
                  </span>
                </div>
                <h3 className="font-serif text-xl font-semibold text-[#2C2416] mb-1 group-hover:text-[#8B6F47] transition-colors duration-200">
                  {project.title}
                </h3>
                <p className="text-sm text-[#8A7A6A]">{project.category}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}