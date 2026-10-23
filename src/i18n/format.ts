import { useCallback, useEffect } from 'react';
import { useLanguage } from './useLanguage';

/** Replaces {name} placeholders: fill('Stap {step}', { step: 2 }) → 'Stap 2'. */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, name: string) => (name in values ? String(values[name]) : match));
}

/** Picks the Dutch or English variant; English falls back to Dutch when empty. */
export function useLocalized() {
  const { language } = useLanguage();
  return useCallback((nl: string, en?: string | null) => (language === 'en' && en ? en : nl), [language]);
}

export function usePageTitle(title: string, description?: string) {
  useEffect(() => {
    document.title = title.includes('Denra') ? title : `${title} | Denra Badkamers`;
    if (description) document.querySelector('meta[name="description"]')?.setAttribute('content', description);
  }, [title, description]);
}
