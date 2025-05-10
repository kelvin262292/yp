import React, { createContext, useState, useEffect } from "react";
import { Language, translations, TranslationKey } from "@/lib/i18n";

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  translations: Record<TranslationKey, string>;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Get language from localStorage or default to Vietnamese
  const getInitialLanguage = (): Language => {
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('yapee_language') as Language | null;
      if (savedLanguage && ['vi', 'en', 'zh'].includes(savedLanguage)) {
        return savedLanguage as Language;
      }
      
      // If no saved language, try to detect browser language
      const browserLang = navigator.language.split('-')[0];
      if (browserLang === 'vi' || browserLang === 'en' || browserLang === 'zh') {
        return browserLang as Language;
      }
    }
    
    return 'vi'; // Default to Vietnamese
  };
  
  const [language, setLanguageState] = useState<Language>(getInitialLanguage());
  
  // Set language and save to localStorage
  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    localStorage.setItem('yapee_language', newLanguage);
    
    // Also update html lang attribute
    document.documentElement.lang = newLanguage;
  };
  
  // Update html lang attribute on initial load
  useEffect(() => {
    document.documentElement.lang = language;
  }, []);
  
  // Get translations for current language
  const getCurrentTranslations = (): Record<TranslationKey, string> => {
    return translations[language];
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        translations: getCurrentTranslations()
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};
