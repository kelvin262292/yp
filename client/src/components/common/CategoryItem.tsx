import { Link } from "wouter";
import { Category } from "@shared/schema";
import { Language } from "@/lib/i18n";

interface CategoryItemProps {
  category: Category;
  language: Language;
}

const CategoryItem = ({ category, language }: CategoryItemProps) => {
  // Get the appropriate name based on language
  const categoryName = language === 'en' ? category.nameEn : 
                      language === 'zh' ? category.nameZh : 
                      category.name;

  // Map category slug to icon if not provided
  const getIconClass = () => {
    if (category.icon) return category.icon;
    
    const iconMap: Record<string, string> = {
      'dien-thoai': 'fas fa-mobile-alt',
      'dien-tu': 'fas fa-laptop',
      'thoi-trang': 'fas fa-tshirt',
      'lam-dep': 'fas fa-spa',
      'do-gia-dung': 'fas fa-home',
      'me-be': 'fas fa-baby',
      'the-thao': 'fas fa-running',
      'o-to-xe-may': 'fas fa-car'
    };
    
    return iconMap[category.slug] || 'fas fa-tag';
  };

  return (
    <Link href={`/category/${category.slug}`}>
      <div className="flex flex-col items-center p-4 bg-white rounded-lg hover:shadow-md transition cursor-pointer">
        <div className="w-16 h-16 bg-light rounded-full flex items-center justify-center text-primary mb-3">
          <i className={`${getIconClass()} text-2xl`}></i>
        </div>
        <span className="text-center text-sm font-medium">{categoryName}</span>
      </div>
    </Link>
  );
};

export default CategoryItem;
