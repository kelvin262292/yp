import React, { createContext, useState, useEffect } from "react";
import { Language, translations, TranslationKey } from "@/lib/i18n";

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  translations: Record<TranslationKey, string>;
}

export const LanguageContext = createContext<LanguageContextType>({
  language: 'vi',
  setLanguage: () => {},
  translations: translations.vi
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to Vietnamese
  const [language, setLanguageState] = useState<Language>('vi');
  
  // Try to load saved language on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('yapee_language') as Language | null;
    if (savedLanguage && ['vi', 'en', 'zh'].includes(savedLanguage)) {
      setLanguageState(savedLanguage);
      document.documentElement.lang = savedLanguage;
    } else {
      // If no saved language, try to detect browser language
      const browserLang = navigator.language.split('-')[0];
      if (browserLang === 'vi' || browserLang === 'en' || browserLang === 'zh') {
        setLanguageState(browserLang as Language);
        document.documentElement.lang = browserLang;
      }
    }
  }, []);
  
  // Set language and save to localStorage
  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    localStorage.setItem('yapee_language', newLanguage);
    document.documentElement.lang = newLanguage;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        translations: translations[language]
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};
