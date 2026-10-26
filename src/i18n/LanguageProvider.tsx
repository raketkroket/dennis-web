import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { translations, type Language, type TranslationKey } from './translations';
import { LanguageContext } from './languageContext';
import { useSiteContent } from '../content/SiteContentProvider';
import { startedFromPrerender } from '../lib/hydration';

const storageKey = 'denra-language';

function savedLanguage(): Language {
  try {
    return typeof window !== 'undefined' && window.localStorage.getItem(storageKey) === 'en' ? 'en' : 'nl';
  } catch {
    return 'nl';
  }
}

function lookup(language: Language, key: string): string | undefined {
  const [section, entry] = key.split('.');
  const group = (translations[language] as Record<string, Record<string, string>>)[section];
  return group?.[entry];
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Prerendered pages are Dutch; a saved English choice is applied right after.
  const [language, setLanguage] = useState<Language>(() => (startedFromPrerender ? 'nl' : savedLanguage()));
  const { texts } = useSiteContent();

  useEffect(() => {
    if (startedFromPrerender && savedLanguage() === 'en') setLanguage('en');
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, language);
    } catch {
      // Language choice simply is not remembered.
    }
    document.documentElement.lang = language;
  }, [language]);

  // Texts edited in the admin win. When Dennis rewrote the Dutch text and
  // left the English empty, English visitors see his Dutch text rather than
  // the outdated built-in English.
  const t = useCallback((key: TranslationKey) => {
    const override = texts[key];
    if (language === 'nl' && override?.nl) return override.nl;
    if (language === 'en' && override?.en) return override.en;
    if (language === 'en' && override?.nl) return override.nl;
    return lookup(language, key) ?? lookup('nl', key) ?? key;
  }, [language, texts]);

  const value = useMemo(() => ({ language, setLanguage, t }), [language, t]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
