import React, { createContext, useState, useEffect, useContext } from "react";
import { Language, translations, TranslationKey } from "@/lib/i18n";

// Create a full translations record with all the keys defined in TranslationKey
const fullTranslations: Record<Language, Record<string, string>> = {
  vi: {
    ...translations.vi,
    'contact-details': 'Thông tin liên hệ',
    'all-rights-reserved': 'Tất cả quyền được bảo lưu',
    'admin.total': 'Tổng cộng',
    'admin.description': 'Mô tả',
    'admin.category': 'Danh mục',
    'admin.brand': 'Thương hiệu',
    'admin.selectCategory': 'Chọn danh mục',
    'admin.selectBrand': 'Chọn thương hiệu',
    'admin.noCategories': 'Không có danh mục nào',
    'admin.noBrands': 'Không có thương hiệu nào',
    'admin.originalPrice': 'Giá gốc',
    'admin.originalPriceDescription': 'Giá trước khi giảm giá (nếu có)',
    'admin.stock': 'Kho hàng',
    'admin.productVariants': 'Biến thể sản phẩm',
    'admin.productVariantsDescription': 'Thêm các biến thể về màu sắc, kích thước, v.v.'
  },
  en: {
    ...translations.en,
    'contact-details': 'Contact Details',
    'all-rights-reserved': 'All Rights Reserved',
    'admin.total': 'Total',
    'admin.description': 'Description',
    'admin.category': 'Category',
    'admin.brand': 'Brand',
    'admin.selectCategory': 'Select a category',
    'admin.selectBrand': 'Select a brand',
    'admin.noCategories': 'No categories available',
    'admin.noBrands': 'No brands available',
    'admin.originalPrice': 'Original Price',
    'admin.originalPriceDescription': 'Price before discount (if any)',
    'admin.stock': 'Stock',
    'admin.productVariants': 'Product Variants',
    'admin.productVariantsDescription': 'Add variations such as color, size, etc.'
  },
  zh: {
    ...translations.zh,
    'contact-details': '联系方式',
    'all-rights-reserved': '版权所有',
    'admin.total': '总计',
    'admin.description': '描述',
    'admin.category': '类别',
    'admin.brand': '品牌',
    'admin.selectCategory': '选择类别',
    'admin.selectBrand': '选择品牌',
    'admin.noCategories': '没有可用的类别',
    'admin.noBrands': '没有可用的品牌',
    'admin.originalPrice': '原价',
    'admin.originalPriceDescription': '折扣前价格（如果有）',
    'admin.stock': '库存',
    'admin.productVariants': '产品变体',
    'admin.productVariantsDescription': '添加颜色，尺寸等变体'
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  translations: Record<string, string>;
  t: (key: TranslationKey) => string;
}

export const LanguageContext = createContext<LanguageContextType>({
  language: 'vi',
  setLanguage: () => {},
  translations: fullTranslations.vi,
  t: (key) => key as string
});

export const useLanguage = () => useContext(LanguageContext);

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

  // Helper function to get translation text
  const t = (key: TranslationKey): string => {
    const currentTranslations = fullTranslations[language];
    return currentTranslations[key] || key as string;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        translations: fullTranslations[language],
        t
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};
