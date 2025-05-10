import { Switch, Route, useLocation } from "wouter";
import NotFound from "@/pages/not-found";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Home from "@/pages/Home";
import ProductDetail from "@/pages/ProductDetail";
import Cart from "@/pages/Cart";
import Account from "@/pages/Account";

// Info pages
import AboutPage from "@/pages/info/AboutPage";
import CareersPage from "@/pages/info/CareersPage";
import TermsPage from "@/pages/info/TermsPage";
import PrivacyPage from "@/pages/info/PrivacyPage";
import SellerPage from "@/pages/info/SellerPage";
import HelpPage from "@/pages/info/HelpPage";
import ContactPage from "@/pages/info/ContactPage";
import ReturnPolicyPage from "@/pages/info/ReturnPolicyPage";
import ReportPage from "@/pages/info/ReportPage";
import FAQPage from "@/pages/info/FAQPage";

// Admin pages
import AdminDashboard from "@/pages/admin/AdminDashboard";
import ProductList from "@/pages/admin/products/ProductList";
import ProductForm from "@/pages/admin/products/ProductForm";
import CategoryList from "@/pages/admin/categories/CategoryList";
import CategoryForm from "@/pages/admin/categories/CategoryForm";
import BrandList from "@/pages/admin/brands/BrandList";
import BrandForm from "@/pages/admin/brands/BrandForm";
import OrderList from "@/pages/admin/orders/OrderList";
import CustomersList from "@/pages/admin/customers/CustomersList";
import MarketingDashboard from "@/pages/admin/marketing/MarketingDashboard";
import ReportsDashboard from "@/pages/admin/reports/ReportsDashboard";
import SettingsDashboard from "@/pages/admin/settings/SettingsDashboard";
import PaymentsDashboard from "@/pages/admin/payments/PaymentsDashboard";
import ShippingDashboard from "@/pages/admin/shipping/ShippingDashboard";
import UsersList from "@/pages/admin/users/UsersList";

function App() {
  const [location] = useLocation();
  const isAdminRoute = location.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminRoute && <Header />}
      <main className={`flex-grow ${!isAdminRoute ? '' : 'bg-gray-50'}`}>
        <Switch>
          {/* Public Routes */}
          <Route path="/" component={Home} />
          <Route path="/product/:slug" component={ProductDetail} />
          <Route path="/cart" component={Cart} />
          <Route path="/account" component={Account} />
          
          {/* Info Pages */}
          <Route path="/about" component={AboutPage} />
          <Route path="/careers" component={CareersPage} />
          <Route path="/terms" component={TermsPage} />
          <Route path="/privacy" component={PrivacyPage} />
          <Route path="/seller" component={SellerPage} />
          <Route path="/help" component={HelpPage} />
          <Route path="/contact" component={ContactPage} />
          <Route path="/return-policy" component={ReturnPolicyPage} />
          <Route path="/report" component={ReportPage} />
          <Route path="/faq" component={FAQPage} />
          
          {/* Admin Routes */}
          <Route path="/admin" component={AdminDashboard} />
          <Route path="/admin/products" component={ProductList} />
          <Route path="/admin/products/new" component={ProductForm} />
          <Route path="/admin/products/:id/edit" component={ProductForm} />
          <Route path="/admin/categories" component={CategoryList} />
          <Route path="/admin/categories/new" component={CategoryForm} />
          <Route path="/admin/categories/:id/edit" component={CategoryForm} />
          <Route path="/admin/brands" component={BrandList} />
          <Route path="/admin/brands/new" component={BrandForm} />
          <Route path="/admin/brands/:id/edit" component={BrandForm} />
          <Route path="/admin/orders" component={OrderList} />
          <Route path="/admin/orders/pending" component={OrderList} />
          <Route path="/admin/orders/processing" component={OrderList} />
          <Route path="/admin/orders/shipping" component={OrderList} />
          <Route path="/admin/orders/delivered" component={OrderList} />
          <Route path="/admin/orders/cancelled" component={OrderList} />
          <Route path="/admin/customers" component={CustomersList} />
          <Route path="/admin/marketing" component={MarketingDashboard} />
          <Route path="/admin/reports" component={ReportsDashboard} />
          <Route path="/admin/settings" component={SettingsDashboard} />
          <Route path="/admin/payments" component={PaymentsDashboard} />
          <Route path="/admin/shipping" component={ShippingDashboard} />
          <Route path="/admin/users" component={UsersList} />
          
          <Route component={NotFound} />
        </Switch>
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
}

export default App;
