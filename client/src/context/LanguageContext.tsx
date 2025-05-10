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
    'admin.productVariantsDescription': 'Thêm các biến thể về màu sắc, kích thước, v.v.',
    'admin.customers': 'Khách hàng',
    'admin.marketing': 'Marketing',
    'admin.reports': 'Báo cáo',
    'admin.settings': 'Cài đặt',
    'admin.banners': 'Banners',
    'admin.heroBanner': 'Hero Banner',
    'admin.bannerManagement': 'Quản lý banner',
    'admin.addBanner': 'Thêm banner',
    'admin.editBanner': 'Sửa banner',
    'admin.bannerTitle': 'Tiêu đề banner',
    'admin.bannerSubtitle': 'Tiêu đề phụ',
    'admin.bannerImage': 'Ảnh banner',
    'admin.bannerLink': 'Liên kết',
    'admin.bannerActive': 'Hoạt động',
    'admin.bannerPosition': 'Vị trí',
    'admin.bannerStartDate': 'Ngày bắt đầu',
    'admin.bannerEndDate': 'Ngày kết thúc',
    'admin.bannerPriority': 'Độ ưu tiên',
    'admin.bannerDesktopImage': 'Ảnh desktop',
    'admin.bannerMobileImage': 'Ảnh mobile'
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
    'admin.productVariantsDescription': 'Add variations such as color, size, etc.',
    'admin.customers': 'Customers',
    'admin.marketing': 'Marketing',
    'admin.reports': 'Reports',
    'admin.settings': 'Settings',
    'admin.banners': 'Banners',
    'admin.heroBanner': 'Hero Banner',
    'admin.bannerManagement': 'Banner Management',
    'admin.addBanner': 'Add Banner',
    'admin.editBanner': 'Edit Banner',
    'admin.bannerTitle': 'Banner Title',
    'admin.bannerSubtitle': 'Subtitle',
    'admin.bannerImage': 'Banner Image',
    'admin.bannerLink': 'Link',
    'admin.bannerActive': 'Active',
    'admin.bannerPosition': 'Position',
    'admin.bannerStartDate': 'Start Date',
    'admin.bannerEndDate': 'End Date',
    'admin.bannerPriority': 'Priority',
    'admin.bannerDesktopImage': 'Desktop Image',
    'admin.bannerMobileImage': 'Mobile Image'
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
    'admin.productVariantsDescription': '添加颜色，尺寸等变体',
    'admin.customers': '客户',
    'admin.marketing': '营销',
    'admin.reports': '报告',
    'admin.settings': '设置',
    'admin.banners': '横幅',
    'admin.heroBanner': '主横幅',
    'admin.bannerManagement': '横幅管理',
    'admin.addBanner': '添加横幅',
    'admin.editBanner': '编辑横幅',
    'admin.bannerTitle': '横幅标题',
    'admin.bannerSubtitle': '副标题',
    'admin.bannerImage': '横幅图片',
    'admin.bannerLink': '链接',
    'admin.bannerActive': '活动',
    'admin.bannerPosition': '位置',
    'admin.bannerStartDate': '开始日期',
    'admin.bannerEndDate': '结束日期',
    'admin.bannerPriority': '优先级',
    'admin.bannerDesktopImage': '桌面图片',
    'admin.bannerMobileImage': '移动图片'
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
