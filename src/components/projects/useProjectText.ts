import { useCallback } from 'react';
import type { ProjectCategory } from '../../content/defaults';
import type { Project } from '../../content/types';
import { useLanguage } from '../../i18n/useLanguage';
import { useLocalized } from '../../i18n/format';

export const categoryPaths: Record<ProjectCategory, string> = {
  badkamer: '/badkamerrenovatie',
  toilet: '/wc-renovatie',
  interieur: '/binnenrenovatie',
};

/** Contact-form service value that matches a project category. */
export const categoryService: Record<ProjectCategory, string> = {
  badkamer: 'badkamer',
  toilet: 'wc',
  interieur: 'binnen',
};

export function useProjectText() {
  const { t } = useLanguage();
  const pick = useLocalized();

  const categoryLabel = useCallback((category: ProjectCategory, plural = false) => {
    if (plural) return category === 'badkamer' ? t('site.bathrooms') : category === 'toilet' ? t('site.toilets') : t('site.interior');
    return category === 'badkamer' ? t('portfolioPage.bathroom') : category === 'toilet' ? t('portfolioPage.toilet') : t('portfolioPage.interior');
  }, [t]);

  const categoryNoun = useCallback((category: ProjectCategory) => (
    category === 'badkamer' ? t('site.categoryBathroom') : category === 'toilet' ? t('site.categoryToilet') : t('site.categoryInterior')
  ), [t]);

  const title = useCallback((project: Project) => pick(project.titleNl, project.titleEn), [pick]);
  const summary = useCallback((project: Project) => pick(project.summaryNl, project.summaryEn), [pick]);

  return { categoryLabel, categoryNoun, title, summary, pick };
}
