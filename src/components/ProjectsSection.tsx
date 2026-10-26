import React from 'react';
import { Link } from 'react-router-dom';
import { m } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useSiteContent } from '../content/SiteContentProvider';
import { useLocalized } from '../i18n/format';

export default function ProjectsSection() {
  const pick = useLocalized();
  const { projects: allProjects } = useSiteContent();
  // The projects Dennis marks as featured in the admin, in his order.
  const projects = allProjects.filter((project) => project.isFeatured && project.cover).slice(0, 6).map((project) => ({
    id: project.id,
    title: pick(project.titleNl, project.titleEn),
    category: pick(project.summaryNl, project.summaryEn),
    image: project.cover?.image.src ?? '',
    srcSet: project.cover?.image.srcSet,
    alt: project.cover ? pick(project.cover.altNl, project.cover.altEn) : '',
    tag: project.category === 'badkamer' ? 'Badkamer' : project.category === 'toilet' ? 'WC' : 'Binnen',
  }));
  return (
    <section className="py-24 lg:py-28 bg-transparent" aria-labelledby="projecten-heading">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
          <m.div
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
          </m.div>
          <m.div
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
          </m.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-7">
          {projects.map((project, i) => (
            <m.div
              key={project.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="group cursor-pointer"
            >
              <Link to="/projecten" className="block h-full">
                <div className="relative overflow-hidden rounded-[18px] aspect-[4/3] mb-4 border border-[#d9cdb8] bg-[#efe6dc] shadow-[0_12px_30px_rgba(29,23,18,0.03)]">
                  <img loading="lazy" decoding="async"
                    src={project.image}
                    srcSet={project.srcSet}
                    sizes="(min-width: 1280px) 400px, (min-width: 640px) 50vw, 100vw"
                    alt={project.alt || project.title}
                    width={800}
                    height={600}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                  <span className="absolute top-4 left-4 text-[10px] tracking-[0.18em] uppercase bg-[#f7f1ea]/90 text-[#3c342c] px-3 py-1.5 rounded-sm font-medium">
                    {project.tag}
                  </span>
                </div>
                <div className="px-1">
                  <h3 className="font-serif text-xl md:text-[1.6rem] font-semibold text-[#1d1712] mb-1 leading-tight group-hover:text-[#3c342c] transition-colors duration-200">
                    {project.title}
                  </h3>
                  <p className="text-sm text-[#5f544a] leading-relaxed">{project.category}</p>
                </div>
              </Link>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
}