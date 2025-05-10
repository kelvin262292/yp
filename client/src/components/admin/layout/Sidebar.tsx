import React, { useState } from 'react';
import { useLocation, Link } from 'wouter';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Package, 
  Tag, 
  ShoppingBag, 
  Users, 
  Settings, 
  PieChart, 
  ScrollText,
  ChevronDown,
  Layers,
  Truck,
  CreditCard,
  MessageSquare,
  Bell,
  BadgePercent,
  PanelLeft,
  ImageIcon
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';

interface MenuItemProps {
  path: string;
  icon: React.ReactNode;
  title: string;
  subItems?: { path: string; title: string }[];
  selected: boolean;
  onToggleSubmenu?: () => void;
  submenuOpen?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({ 
  path, 
  icon, 
  title, 
  subItems, 
  selected, 
  onToggleSubmenu, 
  submenuOpen 
}) => {
  const hasSubItems = subItems && subItems.length > 0;
  const [location] = useLocation();
  
  return (
    <div className={`mb-1 ${hasSubItems ? '' : ''}`}>
      {hasSubItems ? (
        <div 
          onClick={onToggleSubmenu}
          className={cn(
            'flex items-center py-2 px-4 cursor-pointer rounded-md transition-colors',
            (submenuOpen || selected) ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-slate-100'
          )}
        >
          <div className="flex items-center flex-1">
            <span className="mr-3">{icon}</span>
            <span>{title}</span>
          </div>
          <ChevronDown 
            size={16} 
            className={cn('transition-transform', submenuOpen ? 'transform rotate-180' : '')} 
          />
        </div>
      ) : (
        <Link href={path}>
          <div 
            className={cn(
              'flex items-center py-2 px-4 rounded-md transition-colors cursor-pointer',
              selected ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-slate-100'
            )}
          >
            <span className="mr-3">{icon}</span>
            <span>{title}</span>
          </div>
        </Link>
      )}
      
      {hasSubItems && submenuOpen && (
        <div className="ml-12 mt-1 space-y-1">
          {subItems.map((subItem, index) => (
            <Link key={index} href={subItem.path}>
              <div 
                className={cn(
                  'block py-1.5 px-4 rounded-md text-sm transition-colors cursor-pointer',
                  location === subItem.path ? 'text-primary font-medium' : 'hover:bg-slate-100'
                )}
              >
                {subItem.title}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

const Sidebar = () => {
  const [location] = useLocation();
  const { t } = useLanguage();
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({
    'products': true,
    'orders': location.includes('/admin/orders'),
  });
  
  const toggleSubmenu = (key: string) => {
    setOpenSubmenus(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  const isSelected = (path: string): boolean => {
    if (path === '/admin' && location === '/admin') return true;
    if (path !== '/admin' && location.startsWith(path)) return true;
    return false;
  };
  
  return (
    <div className="w-64 bg-white border-r h-full flex flex-col">
      <div className="p-4 border-b">
        <Link href="/">
          <div className="flex items-center cursor-pointer">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center text-white font-bold mr-2">Y</div>
            <div className="font-bold text-xl">Yapee Admin</div>
          </div>
        </Link>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4 px-2">
        <MenuItem 
          path="/admin" 
          icon={<LayoutDashboard size={18} />} 
          title={t('admin.dashboard')}
          selected={isSelected('/admin') && location === '/admin'}
        />
        
        <MenuItem 
          path="/admin/products" 
          icon={<Package size={18} />} 
          title={t('admin.products')}
          subItems={[
            { path: '/admin/products', title: 'Tất cả sản phẩm' },
            { path: '/admin/products/new', title: 'Thêm sản phẩm mới' },
          ]}
          selected={isSelected('/admin/products')}
          onToggleSubmenu={() => toggleSubmenu('products')}
          submenuOpen={openSubmenus['products']}
        />
        
        <MenuItem 
          path="/admin/categories" 
          icon={<Tag size={18} />} 
          title={t('admin.categories')}
          subItems={[
            { path: '/admin/categories', title: 'Danh sách danh mục' },
            { path: '/admin/categories/new', title: 'Thêm danh mục mới' },
          ]}
          selected={isSelected('/admin/categories')}
          onToggleSubmenu={() => toggleSubmenu('categories')}
          submenuOpen={openSubmenus['categories']}
        />
        
        <MenuItem 
          path="/admin/brands" 
          icon={<Layers size={18} />} 
          title="Thương hiệu"
          subItems={[
            { path: '/admin/brands', title: 'Danh sách thương hiệu' },
            { path: '/admin/brands/new', title: 'Thêm thương hiệu mới' },
          ]}
          selected={isSelected('/admin/brands')}
          onToggleSubmenu={() => toggleSubmenu('brands')}
          submenuOpen={openSubmenus['brands']}
        />
        
        <MenuItem 
          path="/admin/orders" 
          icon={<ShoppingBag size={18} />} 
          title={t('admin.orders')}
          subItems={[
            { path: '/admin/orders', title: 'Tất cả đơn hàng' },
            { path: '/admin/orders/pending', title: 'Chờ xử lý' },
            { path: '/admin/orders/processing', title: 'Đang xử lý' },
            { path: '/admin/orders/shipping', title: 'Đang giao hàng' },
            { path: '/admin/orders/delivered', title: 'Đã giao hàng' },
            { path: '/admin/orders/cancelled', title: 'Đã hủy' },
          ]}
          selected={isSelected('/admin/orders')}
          onToggleSubmenu={() => toggleSubmenu('orders')}
          submenuOpen={openSubmenus['orders']}
        />
        
        <MenuItem 
          path="/admin/shipping" 
          icon={<Truck size={18} />} 
          title="Vận chuyển"
          selected={isSelected('/admin/shipping')}
        />
        
        <MenuItem 
          path="/admin/payments" 
          icon={<CreditCard size={18} />} 
          title="Thanh toán"
          selected={isSelected('/admin/payments')}
        />
        
        <div className="mt-6 mb-2 px-4 text-xs font-semibold text-gray-500 uppercase">
          Khách hàng & Marketing
        </div>
        
        <MenuItem 
          path="/admin/users" 
          icon={<Users size={18} />} 
          title="Quản lý người dùng"
          selected={isSelected('/admin/users')}
        />
        
        <MenuItem 
          path="/admin/customers" 
          icon={<Users size={18} />} 
          title={t('admin.customers')}
          selected={isSelected('/admin/customers')}
        />
        
        <MenuItem 
          path="/admin/marketing" 
          icon={<BadgePercent size={18} />} 
          title={t('admin.marketing')}
          selected={isSelected('/admin/marketing')}
        />
        
        <MenuItem 
          path="/admin/banners" 
          icon={<ImageIcon size={18} />} 
          title={t('admin.banners')}
          selected={isSelected('/admin/banners')}
        />
        
        <MenuItem 
          path="/admin/reports" 
          icon={<PieChart size={18} />} 
          title={t('admin.reports')}
          selected={isSelected('/admin/reports')}
        />
        
        <div className="mt-6 mb-2 px-4 text-xs font-semibold text-gray-500 uppercase">
          Quản lý hệ thống
        </div>
        
        <MenuItem 
          path="/admin/settings" 
          icon={<Settings size={18} />} 
          title={t('admin.settings')}
          selected={isSelected('/admin/settings')}
        />
      </div>
      
      <div className="p-4 border-t flex items-center">
        <Button variant="outline" size="sm" className="flex items-center w-full justify-center gap-1">
          <PanelLeft size={14} />
          <span>Thu gọn</span>
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;