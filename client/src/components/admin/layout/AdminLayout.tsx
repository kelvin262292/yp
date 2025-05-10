import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useLanguage } from '@/context/LanguageContext';
import {
  ChevronRight,
  PanelRight,
  X,
  LogOut,
  User,
  Settings,
  ChevronDown,
  LayoutDashboard,
  ShoppingBag,
  Package,
  FolderTree,
  Tags,
  Truck,
  CreditCard,
  BarChart2,
  Users,
  Menu,
  Globe,
  Bell,
  Search,
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface SideNavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active: boolean;
  end?: boolean;
}

interface SideNavGroupProps {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const SideNavItem: React.FC<SideNavItemProps> = ({ icon, label, href, active, end = false }) => {
  return (
    <Link href={href}>
      <a className={`
        flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors
        ${active 
          ? 'bg-primary text-primary-foreground font-medium' 
          : 'text-gray-700 hover:bg-gray-100'}
        ${end ? 'mt-auto' : ''}
      `}>
        {icon}
        <span>{label}</span>
      </a>
    </Link>
  );
};

const SideNavGroup: React.FC<SideNavGroupProps> = ({ icon, label, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full"
    >
      <CollapsibleTrigger asChild>
        <button className="flex items-center justify-between w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
          <div className="flex items-center gap-3">
            {icon}
            <span>{label}</span>
          </div>
          <ChevronDown
            size={16}
            className={`transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
          />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pl-9 space-y-1 mt-1">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
};

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location] = useLocation();
  const { t, language, setLanguage } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/admin' && location === '/admin') {
      return true;
    }
    if (path !== '/admin' && location.startsWith(path)) {
      return true;
    }
    return false;
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="px-3 py-4 border-b">
        <div className="flex items-center justify-between mb-4 lg:mb-6">
          <Link href="/admin">
            <a className="flex items-center gap-2 font-bold text-xl text-primary">
              <span className="flex items-center justify-center w-8 h-8 rounded-md bg-primary text-white">Y</span>
              <span>Yapee Admin</span>
            </a>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={18} />
          </Button>
        </div>
        <div className="relative mb-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder={t('admin.searchProducts')}
            className="w-full pl-8"
          />
        </div>
      </div>
      
      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <SideNavItem 
          icon={<LayoutDashboard size={18} />} 
          label={t('admin.dashboard')} 
          href="/admin" 
          active={isActive('/admin')}
        />
        
        <SideNavGroup 
          icon={<ShoppingBag size={18} />} 
          label={t('admin.products')}
          defaultOpen={isActive('/admin/products')}
        >
          <Link href="/admin/products">
            <a className={`
              flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors
              ${isActive('/admin/products') && !location.includes('/new') && !location.includes('/edit')
                ? 'bg-primary/10 text-primary font-medium' 
                : 'text-gray-700 hover:bg-gray-100'}
            `}>
              <ChevronRight size={16} />
              <span>{t('admin.allProducts')}</span>
            </a>
          </Link>
          <Link href="/admin/products/yapee-mall">
            <a className={`
              flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors
              ${location.includes('/admin/products/yapee-mall')
                ? 'bg-primary/10 text-primary font-medium' 
                : 'text-gray-700 hover:bg-gray-100'}
            `}>
              <ChevronRight size={16} />
              <span>{t('admin.yapeeProducts')}</span>
            </a>
          </Link>
          <Link href="/admin/products/new">
            <a className={`
              flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors
              ${location === '/admin/products/new'
                ? 'bg-primary/10 text-primary font-medium' 
                : 'text-gray-700 hover:bg-gray-100'}
            `}>
              <ChevronRight size={16} />
              <span>{t('admin.addProduct')}</span>
            </a>
          </Link>
        </SideNavGroup>
        
        <SideNavItem 
          icon={<FolderTree size={18} />} 
          label={t('admin.categories')} 
          href="/admin/categories" 
          active={isActive('/admin/categories')}
        />
        
        <SideNavItem 
          icon={<Tags size={18} />} 
          label={t('admin.brands')} 
          href="/admin/brands" 
          active={isActive('/admin/brands')}
        />
        
        <SideNavGroup 
          icon={<Package size={18} />} 
          label={t('admin.orders')}
          defaultOpen={isActive('/admin/orders')}
        >
          <Link href="/admin/orders">
            <a className={`
              flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors
              ${isActive('/admin/orders') && !location.includes('/pending') && !location.includes('/processing') && !location.includes('/shipping') && !location.includes('/delivered') && !location.includes('/cancelled')
                ? 'bg-primary/10 text-primary font-medium' 
                : 'text-gray-700 hover:bg-gray-100'}
            `}>
              <ChevronRight size={16} />
              <span>{t('admin.allOrders')}</span>
            </a>
          </Link>
          <Link href="/admin/orders/pending">
            <a className={`
              flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors
              ${location.includes('/admin/orders/pending')
                ? 'bg-primary/10 text-primary font-medium' 
                : 'text-gray-700 hover:bg-gray-100'}
            `}>
              <ChevronRight size={16} />
              <span>{t('admin.pendingOrders')}</span>
            </a>
          </Link>
          <Link href="/admin/orders/processing">
            <a className={`
              flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors
              ${location.includes('/admin/orders/processing')
                ? 'bg-primary/10 text-primary font-medium' 
                : 'text-gray-700 hover:bg-gray-100'}
            `}>
              <ChevronRight size={16} />
              <span>{t('admin.processingOrders')}</span>
            </a>
          </Link>
          <Link href="/admin/orders/shipping">
            <a className={`
              flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors
              ${location.includes('/admin/orders/shipping')
                ? 'bg-primary/10 text-primary font-medium' 
                : 'text-gray-700 hover:bg-gray-100'}
            `}>
              <ChevronRight size={16} />
              <span>{t('admin.shippingOrders')}</span>
            </a>
          </Link>
          <Link href="/admin/orders/delivered">
            <a className={`
              flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors
              ${location.includes('/admin/orders/delivered')
                ? 'bg-primary/10 text-primary font-medium' 
                : 'text-gray-700 hover:bg-gray-100'}
            `}>
              <ChevronRight size={16} />
              <span>{t('admin.completedOrders')}</span>
            </a>
          </Link>
          <Link href="/admin/orders/cancelled">
            <a className={`
              flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors
              ${location.includes('/admin/orders/cancelled')
                ? 'bg-primary/10 text-primary font-medium' 
                : 'text-gray-700 hover:bg-gray-100'}
            `}>
              <ChevronRight size={16} />
              <span>{t('admin.cancelledOrders')}</span>
            </a>
          </Link>
        </SideNavGroup>
        
        <SideNavItem 
          icon={<Truck size={18} />} 
          label={t('admin.shipping')} 
          href="/admin/shipping" 
          active={isActive('/admin/shipping')}
        />
        
        <SideNavItem 
          icon={<CreditCard size={18} />} 
          label={t('admin.payments')} 
          href="/admin/payments" 
          active={isActive('/admin/payments')}
        />
        
        <SideNavItem 
          icon={<BarChart2 size={18} />} 
          label={t('admin.reports')} 
          href="/admin/reports" 
          active={isActive('/admin/reports')}
        />
        
        <SideNavItem 
          icon={<Users size={18} />} 
          label={t('admin.users')} 
          href="/admin/users" 
          active={isActive('/admin/users')}
        />
        
        <SideNavItem 
          icon={<Settings size={18} />} 
          label={t('admin.settings')} 
          href="/admin/settings" 
          active={isActive('/admin/settings')}
          end
        />
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar for large screens */}
      <aside className="hidden lg:block h-full w-64 border-r bg-white">
        {sidebarContent}
      </aside>
      
      {/* Sidebar for mobile */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-64">
          {sidebarContent}
        </SheetContent>
      </Sheet>
      
      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="h-16 flex items-center justify-between px-4 border-b bg-white">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </Button>
          
          <div className="flex items-center gap-4 ml-auto">
            <Button variant="ghost" size="icon" className="text-gray-500">
              <Bell size={18} />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-500"
                >
                  <Globe size={18} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{t('select-language')}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => setLanguage('vi')}
                    className={language === 'vi' ? 'bg-gray-100' : ''}
                  >
                    {t('vietnamese')}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setLanguage('en')}
                    className={language === 'en' ? 'bg-gray-100' : ''}
                  >
                    {t('english')}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setLanguage('zh')}
                    className={language === 'zh' ? 'bg-gray-100' : ''}
                  >
                    {t('chinese')}
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/admin-avatar.png" />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline-block text-sm font-medium">Admin</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Admin</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <User size={16} className="mr-2" />
                    {t('my-account')}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings size={16} className="mr-2" />
                    {t('admin.settings')}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LogOut size={16} className="mr-2" />
                    {t('logout')}
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;