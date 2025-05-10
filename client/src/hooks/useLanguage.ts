import { useContext, useState, useEffect } from "react";
import { LanguageContext } from "@/context/LanguageContext";
import { TranslationKey } from "@/lib/i18n";

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  
  const { language, setLanguage, translations } = context;
  
  // Translation function
  const t = (key: TranslationKey): string => {
    return translations[key] || key;
  };
  
  return {
    language,
    setLanguage,
    t
  };
};

// Custom hook for debouncing values
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};
