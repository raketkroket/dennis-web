import { useEffect, useState, type ReactNode } from 'react';
import { translations, type Language, type TranslationKey } from './translations';
import { LanguageContext } from './languageContext';

const storageKey = 'denra-language';

function initialLanguage(): Language {
  return typeof window !== 'undefined' && window.localStorage.getItem(storageKey) === 'en' ? 'en' : 'nl';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(initialLanguage);

  useEffect(() => {
    window.localStorage.setItem(storageKey, language);
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: TranslationKey) => {
    const [section, entry] = key.split('.') as [keyof typeof translations.nl, string];
    return translations[language][section][entry as never] as string;
  };

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>;
}
