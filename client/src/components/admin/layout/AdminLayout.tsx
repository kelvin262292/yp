import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { 
  ChevronDown, 
  ChevronUp, 
  Home, 
  Package2, 
  FolderTree, 
  ShoppingCart, 
  BarChart3, 
  Users, 
  Settings, 
  Bell, 
  LogOut, 
  Menu, 
  X,
  Tags,
  Truck,
  Wallet
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  path: string;
  active: boolean;
  hasSubItems?: boolean;
  isOpen?: boolean;
  toggleOpen?: () => void;
}

interface SidebarSubItemProps {
  label: string;
  path: string;
  active: boolean;
}

const SidebarItem = ({ icon, label, path, active, hasSubItems, isOpen, toggleOpen }: SidebarItemProps) => {
  return (
    <li>
      {hasSubItems ? (
        <button 
          className={cn(
            "flex items-center justify-between w-full px-3 py-2 rounded-md",
            active ? "bg-primary text-white" : "hover:bg-gray-100"
          )}
          onClick={toggleOpen}
        >
          <div className="flex items-center gap-2">
            {icon}
            <span>{label}</span>
          </div>
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      ) : (
        <Link 
          href={path}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-md",
            active ? "bg-primary text-white" : "hover:bg-gray-100"
          )}
        >
          {icon}
          <span>{label}</span>
        </Link>
      )}
    </li>
  );
};

const SidebarSubItem = ({ label, path, active }: SidebarSubItemProps) => {
  return (
    <li>
      <Link 
        href={path}
        className={cn(
          "flex items-center pl-9 pr-3 py-2 rounded-md",
          active ? "bg-primary/10 text-primary font-medium" : "hover:bg-gray-100"
        )}
      >
        <span>{label}</span>
      </Link>
    </li>
  );
};

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [location] = useLocation();
  const { t } = useLanguage();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({
    'products': true,
    'orders': false,
    'users': false,
    'settings': false
  });

  const toggleSubmenu = (key: string) => {
    setOpenSubmenus(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm fixed top-0 left-0 w-full z-10">
        <div className="flex justify-between items-center px-4 py-2">
          <div className="flex items-center gap-2">
            <button 
              className="md:hidden p-2 rounded-md hover:bg-gray-100"
              onClick={() => setMobileSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <Link href="/admin" className="flex items-center gap-2">
              <img src="/logo.png" alt="Yapee Admin" className="h-8" />
              <span className="text-lg font-bold text-primary hidden md:block">Yapee Admin</span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-full hover:bg-gray-100 relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500"></span>
            </button>
            <div className="flex items-center gap-2">
              <img 
                src="https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff"
                alt="Admin" 
                className="w-8 h-8 rounded-full" 
              />
              <span className="hidden md:block font-medium">Admin</span>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar - Mobile */}
      <div 
        className={cn(
          "fixed inset-0 z-20 bg-black/50 md:hidden transition-opacity",
          mobileSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setMobileSidebarOpen(false)}
      >
        <div 
          className={cn(
            "fixed top-0 left-0 h-full w-64 bg-white shadow-lg transition-transform",
            mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
          onClick={e => e.stopPropagation()}
        >
          <div className="p-4 flex justify-between items-center border-b">
            <Link href="/admin" className="flex items-center gap-2">
              <img src="/logo.png" alt="Yapee Admin" className="h-6" />
              <span className="text-lg font-bold text-primary">Yapee Admin</span>
            </Link>
            <button 
              className="p-1 rounded-md hover:bg-gray-100"
              onClick={() => setMobileSidebarOpen(false)}
            >
              <X size={20} />
            </button>
          </div>
          <div className="py-4 px-2">
            <ul className="space-y-1">
              {/* Mobile Menu Items - Same as desktop */}
              <SidebarItem 
                icon={<Home size={20} />} 
                label={t('admin.dashboard')} 
                path="/admin" 
                active={location === "/admin"}
              />
              <SidebarItem 
                icon={<Package2 size={20} />} 
                label={t('admin.products')} 
                path="#" 
                active={location.includes("/admin/products")}
                hasSubItems
                isOpen={openSubmenus.products}
                toggleOpen={() => toggleSubmenu('products')}
              />
              {openSubmenus.products && (
                <ul className="mt-1 space-y-1">
                  <SidebarSubItem 
                    label={t('admin.allProducts')} 
                    path="/admin/products" 
                    active={location === "/admin/products"}
                  />
                  <SidebarSubItem 
                    label={t('admin.addProduct')} 
                    path="/admin/products/new" 
                    active={location === "/admin/products/new"}
                  />
                  <SidebarSubItem 
                    label={t('admin.yapeeProducts')} 
                    path="/admin/products/yapee-mall" 
                    active={location === "/admin/products/yapee-mall"}
                  />
                </ul>
              )}
              <SidebarItem 
                icon={<FolderTree size={20} />} 
                label={t('admin.categories')} 
                path="/admin/categories" 
                active={location === "/admin/categories"}
              />
              <SidebarItem 
                icon={<Tags size={20} />} 
                label={t('admin.brands')} 
                path="/admin/brands" 
                active={location === "/admin/brands"}
              />
              <SidebarItem 
                icon={<ShoppingCart size={20} />} 
                label={t('admin.orders')} 
                path="#" 
                active={location.includes("/admin/orders")}
                hasSubItems
                isOpen={openSubmenus.orders}
                toggleOpen={() => toggleSubmenu('orders')}
              />
              {openSubmenus.orders && (
                <ul className="mt-1 space-y-1">
                  <SidebarSubItem 
                    label={t('admin.allOrders')} 
                    path="/admin/orders" 
                    active={location === "/admin/orders"}
                  />
                  <SidebarSubItem 
                    label={t('admin.pendingOrders')} 
                    path="/admin/orders/pending" 
                    active={location === "/admin/orders/pending"}
                  />
                  <SidebarSubItem 
                    label={t('admin.shippingOrders')} 
                    path="/admin/orders/shipping" 
                    active={location === "/admin/orders/shipping"}
                  />
                  <SidebarSubItem 
                    label={t('admin.completedOrders')} 
                    path="/admin/orders/completed" 
                    active={location === "/admin/orders/completed"}
                  />
                  <SidebarSubItem 
                    label={t('admin.cancelledOrders')} 
                    path="/admin/orders/cancelled" 
                    active={location === "/admin/orders/cancelled"}
                  />
                </ul>
              )}
              <SidebarItem 
                icon={<Truck size={20} />} 
                label={t('admin.shipping')} 
                path="/admin/shipping" 
                active={location === "/admin/shipping"}
              />
              <SidebarItem 
                icon={<Wallet size={20} />} 
                label={t('admin.payments')} 
                path="/admin/payments" 
                active={location === "/admin/payments"}
              />
              <SidebarItem 
                icon={<BarChart3 size={20} />} 
                label={t('admin.reports')} 
                path="/admin/reports" 
                active={location === "/admin/reports"}
              />
              <SidebarItem 
                icon={<Users size={20} />} 
                label={t('admin.users')} 
                path="/admin/users" 
                active={location === "/admin/users"}
              />
              <SidebarItem 
                icon={<Settings size={20} />} 
                label={t('admin.settings')} 
                path="/admin/settings" 
                active={location === "/admin/settings"}
              />
              <li className="pt-4 mt-4 border-t">
                <Link 
                  href="/admin/logout" 
                  className="flex items-center gap-2 px-3 py-2 text-red-600 rounded-md hover:bg-red-50"
                >
                  <LogOut size={20} />
                  <span>{t('admin.logout')}</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="md:flex pt-12">
        {/* Sidebar - Desktop */}
        <aside className="hidden md:block w-64 fixed left-0 top-12 h-[calc(100vh-48px)] bg-white shadow-sm overflow-y-auto">
          <div className="py-4 px-2">
            <ul className="space-y-1">
              <SidebarItem 
                icon={<Home size={20} />} 
                label={t('admin.dashboard')} 
                path="/admin" 
                active={location === "/admin"}
              />
              <SidebarItem 
                icon={<Package2 size={20} />} 
                label={t('admin.products')} 
                path="#" 
                active={location.includes("/admin/products")}
                hasSubItems
                isOpen={openSubmenus.products}
                toggleOpen={() => toggleSubmenu('products')}
              />
              {openSubmenus.products && (
                <ul className="mt-1 space-y-1">
                  <SidebarSubItem 
                    label={t('admin.allProducts')} 
                    path="/admin/products" 
                    active={location === "/admin/products"}
                  />
                  <SidebarSubItem 
                    label={t('admin.addProduct')} 
                    path="/admin/products/new" 
                    active={location === "/admin/products/new"}
                  />
                  <SidebarSubItem 
                    label={t('admin.yapeeProducts')} 
                    path="/admin/products/yapee-mall" 
                    active={location === "/admin/products/yapee-mall"}
                  />
                </ul>
              )}
              <SidebarItem 
                icon={<FolderTree size={20} />} 
                label={t('admin.categories')} 
                path="/admin/categories" 
                active={location === "/admin/categories"}
              />
              <SidebarItem 
                icon={<Tags size={20} />} 
                label={t('admin.brands')} 
                path="/admin/brands" 
                active={location === "/admin/brands"}
              />
              <SidebarItem 
                icon={<ShoppingCart size={20} />} 
                label={t('admin.orders')} 
                path="#" 
                active={location.includes("/admin/orders")}
                hasSubItems
                isOpen={openSubmenus.orders}
                toggleOpen={() => toggleSubmenu('orders')}
              />
              {openSubmenus.orders && (
                <ul className="mt-1 space-y-1">
                  <SidebarSubItem 
                    label={t('admin.allOrders')} 
                    path="/admin/orders" 
                    active={location === "/admin/orders"}
                  />
                  <SidebarSubItem 
                    label={t('admin.pendingOrders')} 
                    path="/admin/orders/pending" 
                    active={location === "/admin/orders/pending"}
                  />
                  <SidebarSubItem 
                    label={t('admin.shippingOrders')} 
                    path="/admin/orders/shipping" 
                    active={location === "/admin/orders/shipping"}
                  />
                  <SidebarSubItem 
                    label={t('admin.completedOrders')} 
                    path="/admin/orders/completed" 
                    active={location === "/admin/orders/completed"}
                  />
                  <SidebarSubItem 
                    label={t('admin.cancelledOrders')} 
                    path="/admin/orders/cancelled" 
                    active={location === "/admin/orders/cancelled"}
                  />
                </ul>
              )}
              <SidebarItem 
                icon={<Truck size={20} />} 
                label={t('admin.shipping')} 
                path="/admin/shipping" 
                active={location === "/admin/shipping"}
              />
              <SidebarItem 
                icon={<Wallet size={20} />} 
                label={t('admin.payments')} 
                path="/admin/payments" 
                active={location === "/admin/payments"}
              />
              <SidebarItem 
                icon={<BarChart3 size={20} />} 
                label={t('admin.reports')} 
                path="/admin/reports" 
                active={location === "/admin/reports"}
              />
              <SidebarItem 
                icon={<Users size={20} />} 
                label={t('admin.users')} 
                path="/admin/users" 
                active={location === "/admin/users"}
              />
              <SidebarItem 
                icon={<Settings size={20} />} 
                label={t('admin.settings')} 
                path="/admin/settings" 
                active={location === "/admin/settings"}
              />
              <li className="pt-4 mt-4 border-t">
                <Link 
                  href="/admin/logout" 
                  className="flex items-center gap-2 px-3 py-2 text-red-600 rounded-md hover:bg-red-50"
                >
                  <LogOut size={20} />
                  <span>{t('admin.logout')}</span>
                </Link>
              </li>
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 md:ml-64 p-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;