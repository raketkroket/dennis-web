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
    image: sitePhotos[0],
    tag: 'Badkamer',
    location: 'Almere',
  },
  {
    id: 2,
    title: 'Japandi badkamer Amsterdam',
    category: 'Houten detail & zachte neutraliteit',
    image: sitePhotos[1],
    tag: 'Badkamer',
    location: 'Amsterdam',
  },
  {
    id: 3,
    title: 'Moderne badkamer Lelystad',
    category: 'Inloopdouche & premium afwerking',
    image: sitePhotos[3],
    tag: 'Badkamer',
    location: 'Lelystad',
  },
  {
    id: 4,
    title: 'Binnenrenovatie Almere Poort',
    category: 'Stucwerk, vloeren & schilderwerk',
    image: sitePhotos[5],
    tag: 'Binnen',
    location: 'Almere',
  },
  {
    id: 5,
    title: 'Woonkamer renovatie Almere',
    category: 'Licht, luxe & functioneel',
    image: sitePhotos[6],
    tag: 'Binnen',
    location: 'Almere',
  },
  {
    id: 6,
    title: 'WC-renovatie Amsterdam',
    category: 'Modern en stijlvol',
    image: sitePhotos[8],
    tag: 'WC',
    location: 'Amsterdam',
  },
];

export default function ProjectsSection() {
  return (
    <section className="py-24 lg:py-28 bg-transparent" aria-labelledby="projecten-heading">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="denra-line" />
              <span className="denra-label">Recente projecten</span>
            </div>
            <h2 id="projecten-heading" className="font-serif text-4xl md:text-5xl font-semibold text-[#1d1712] leading-tight">
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
                className="inline-flex items-center gap-2 text-sm font-medium text-[#1d1712] border border-[#5c5147]/18 px-6 py-3 rounded-sm tracking-[0.16em] uppercase hover:bg-[#d8d0c4] transition-all duration-200 whitespace-nowrap"
            >
              Bekijk alle projecten
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-7">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="group cursor-pointer"
            >
              <Link to="/projecten" className="block h-full">
                <div className="relative overflow-hidden rounded-[18px] aspect-[4/3] mb-4 border border-[#d9cdb8] bg-[#efe6dc] shadow-[0_12px_30px_rgba(29,23,18,0.03)]">
                  <img
                    src={project.image}
                    alt={project.title}
                    width={800}
                    height={600}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                  <span className="absolute top-4 left-4 text-[10px] tracking-[0.18em] uppercase bg-[#f7f1ea]/90 text-[#3c342c] px-3 py-1.5 rounded-sm font-medium">
                    {project.tag}
                  </span>
                  <span className="absolute top-4 right-4 text-[10px] tracking-[0.18em] uppercase bg-[#f7f1ea]/90 text-[#3c342c] px-3 py-1.5 rounded-sm font-medium">
                    {project.location}
                  </span>
                </div>
                <div className="px-1">
                  <h3 className="font-serif text-xl md:text-[1.6rem] font-semibold text-[#1d1712] mb-1 leading-tight group-hover:text-[#3c342c] transition-colors duration-200">
                    {project.title}
                  </h3>
                  <p className="text-sm text-[#5f544a] leading-relaxed">{project.category}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}