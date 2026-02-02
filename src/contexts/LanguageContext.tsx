import React, { createContext, useContext, useState, useCallback } from 'react';
import { Language, getTranslation, TranslationKey } from '@/lib/translations';

interface LanguageContextType {
  language: Language;
  cycleLanguage: () => void;
  t: (key: TranslationKey) => string;
  languageLabel: string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const languageOrder: Language[] = ['en', 'as', 'hi'];
const languageLabels: Record<Language, string> = {
  en: 'English',
  as: 'অসমীয়া',
  hi: 'हिंदी',
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const cycleLanguage = useCallback(() => {
    setLanguage((current) => {
      const currentIndex = languageOrder.indexOf(current);
      const nextIndex = (currentIndex + 1) % languageOrder.length;
      return languageOrder[nextIndex];
    });
  }, []);

  const t = useCallback(
    (key: TranslationKey) => getTranslation(language, key),
    [language]
  );

  const value = {
    language,
    cycleLanguage,
    t,
    languageLabel: languageLabels[language],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
