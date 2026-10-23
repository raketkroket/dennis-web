import { useLanguage } from '../i18n/useLanguage';
import { usePageTitle } from '../i18n/format';
import { GuidanceSection, RelatedProjects, ScopeSection, ServiceHero, useCategoryProjects } from '../components/service/ServiceBlocks';
import FaqSection from '../components/FaqSection';
import CTASection from '../components/CTASection';

export default function Badkamerrenovatie() {
  const { t } = useLanguage();
  const projects = useCategoryProjects('badkamer');
  usePageTitle(t('bathroomPage.title'), t('bathroomPage.description'));

  return (
    <>
      <ServiceHero eyebrow={t('bathroomPage.eyebrow')} title={t('bathroomPage.title')} description={t('bathroomPage.description')} category="badkamer" project={projects[0]} />
      <ScopeSection title={t('bathroomPage.featuresTitle')} description={t('bathroomPage.featuresDescription')} items={t('bathroomPage.features').split('|')} project={projects[1]} />
      <GuidanceSection eyebrow={t('bathroomPage.guidanceEyebrow')} title={t('bathroomPage.guidanceTitle')} paragraphs={[t('bathroomPage.guidanceFirst'), t('bathroomPage.guidanceSecond')]} conclusion={t('bathroomPage.guidanceConclusion')} />
      <RelatedProjects title={t('bathroomPage.projectsTitle')} category="badkamer" projects={projects.slice(2)} />
      <FaqSection pages={['badkamer']} tone="stone" />
      <CTASection service="badkamer" />
    </>
  );
}
