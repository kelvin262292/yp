import React from "react";
import { Switch, Route, useLocation } from "wouter";
import { Toaster } from "./components/ui/toaster";
import { AdminRoute } from "./components/admin/AdminRoute";
import NotFound from "@/pages/not-found";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Home from "@/pages/Home";
import ProductDetail from "@/pages/ProductDetail";
import Cart from "@/pages/Cart";
import Account from "@/pages/Account";
import Checkout from "@/pages/checkout/Checkout";
import CheckoutSuccess from "@/pages/checkout/CheckoutSuccess";

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
import BannerList from "@/pages/admin/banners/BannerList";
import BannerForm from "@/pages/admin/banners/BannerForm";
import OrderList from "@/pages/admin/orders/OrderList";
import AdminOrderDetail from "@/pages/admin/orders/OrderDetail";
import CustomersList from "@/pages/admin/customers/CustomersList";
import MarketingDashboard from "@/pages/admin/marketing/MarketingDashboard";
import ReportsDashboard from "@/pages/admin/reports/ReportsDashboard";
import SettingsDashboard from "@/pages/admin/settings/SettingsDashboard";
import PaymentsDashboard from "@/pages/admin/payments/PaymentsDashboard";
import ShippingDashboard from "@/pages/admin/shipping/ShippingDashboard";
import UsersList from "@/pages/admin/users/UsersList";

// Import the components
import Orders from './pages/account/Orders';
import OrderDetail from './pages/account/OrderDetail';
import SuccessPage from './pages/checkout/SuccessPage';
import CheckoutForm from './components/checkout/CheckoutForm';

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
          <Route path="/checkout" component={CheckoutForm} />
          <Route path="/checkout/success" component={CheckoutSuccess} />
          <Route path="/checkout/success/:id" component={SuccessPage} />
          
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
          
          {/* Admin Routes - All protected by AdminRoute component */}
          <AdminRoute path="/admin" component={AdminDashboard} />
          <AdminRoute path="/admin/products" component={ProductList} />
          <AdminRoute path="/admin/products/new" component={ProductForm} />
          <AdminRoute path="/admin/products/:id/edit" component={ProductForm} />
          <AdminRoute path="/admin/categories" component={CategoryList} />
          <AdminRoute path="/admin/categories/new" component={CategoryForm} />
          <AdminRoute path="/admin/categories/edit/:id" component={CategoryForm} />
          <AdminRoute path="/admin/brands" component={BrandList} />
          <AdminRoute path="/admin/brands/new" component={BrandForm} />
          <AdminRoute path="/admin/brands/edit/:id" component={BrandForm} />
          <AdminRoute path="/admin/orders" component={OrderList} />
          <AdminRoute path="/admin/orders/:id" component={AdminOrderDetail} />
          <AdminRoute path="/admin/orders/pending" component={OrderList} />
          <AdminRoute path="/admin/orders/processing" component={OrderList} />
          <AdminRoute path="/admin/orders/shipping" component={OrderList} />
          <AdminRoute path="/admin/orders/delivered" component={OrderList} />
          <AdminRoute path="/admin/orders/cancelled" component={OrderList} />
          <AdminRoute path="/admin/customers" component={CustomersList} />
          <AdminRoute path="/admin/marketing" component={MarketingDashboard} />
          <AdminRoute path="/admin/reports" component={ReportsDashboard} />
          <AdminRoute path="/admin/settings" component={SettingsDashboard} />
          <AdminRoute path="/admin/payments" component={PaymentsDashboard} />
          <AdminRoute path="/admin/shipping" component={ShippingDashboard} />
          <AdminRoute path="/admin/users" component={UsersList} />
          <AdminRoute path="/admin/banners" component={BannerList} />
          <AdminRoute path="/admin/banners/new" component={BannerForm} />
          <AdminRoute path="/admin/banners/edit/:id" component={BannerForm} />
                  
          {/* Account Routes */}
          <Route path="/account/orders" component={Orders} />
          <Route path="/account/orders/:id" component={OrderDetail} />
          
          <Route component={NotFound} />
        </Switch>
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
}

export default App;
