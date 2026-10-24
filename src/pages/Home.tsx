import { useMemo } from 'react';
import HeroSection from '../components/HeroSection';
import TrustBar from '../components/TrustBar';
import ServicesSection from '../components/ServicesSection';
import ProjectsSection from '../components/ProjectsSection';
import ProcessSection from '../components/ProcessSection';
import CalculatorTeaser from '../components/CalculatorTeaser';
import ReviewsSection from '../components/ReviewsSection';
import FaqSection from '../components/FaqSection';
import CTASection from '../components/CTASection';
import { useSiteContent } from '../content/SiteContentProvider';
import { projectCategories, type ProjectCategory } from '../content/defaults';
import type { Project } from '../content/types';
import { usePageTitle } from '../i18n/format';
import { useLanguage } from '../i18n/useLanguage';

// Photos too small to fill a large tile on a sharp screen stay off the homepage.
const largeEnough = (project: Project) => (project.cover?.image.width ?? 0) >= 700;

export default function Home() {
  const { projects } = useSiteContent();
  const { t } = useLanguage();
  usePageTitle('Badkamer & WC Renovatie Flevoland & Noord-Holland | Denra Badkamers', t('marketing.heroDescription'));

  // Each project photo appears once on the homepage: one per service,
  // then the project selection. Dennis steers this with the
  // "Uitgelicht" switch and the order on the Projecten admin page.
  const { showcases, selection } = useMemo(() => {
    const candidates = projects.filter((project) => project.cover && largeEnough(project));
    const featured = candidates.filter((project) => project.isFeatured);
    const used = new Set<string>();
    const take = (project?: Project) => {
      if (project) used.add(project.id);
      return project;
    };
    const ordered = [...featured, ...candidates.filter((project) => !project.isFeatured)];
    const byCategory: Partial<Record<ProjectCategory, Project>> = {};
    for (const category of projectCategories) {
      byCategory[category] = take(ordered.find((project) => project.category === category && !used.has(project.id)));
    }
    return {
      showcases: byCategory,
      selection: ordered.filter((project) => !used.has(project.id)).slice(0, 6),
    };
  }, [projects]);

  return (
    <>
      <HeroSection />
      <TrustBar />
      <ServicesSection showcases={showcases} />
      <ProjectsSection projects={selection} />
      <ProcessSection />
      <CalculatorTeaser />
      <ReviewsSection preview />
      <FaqSection pages={['algemeen']} tone="stone" />
      <CTASection />
    </>
  );
}
