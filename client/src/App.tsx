import { Switch, Route, useLocation } from "wouter";
import NotFound from "@/pages/not-found";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Home from "@/pages/Home";
import ProductDetail from "@/pages/ProductDetail";
import Cart from "@/pages/Cart";
import Account from "@/pages/Account";

// Admin pages
import AdminDashboard from "@/pages/admin/AdminDashboard";
import ProductList from "@/pages/admin/products/ProductList";
import ProductForm from "@/pages/admin/products/ProductForm";
import CategoryList from "@/pages/admin/categories/CategoryList";
import OrderList from "@/pages/admin/orders/OrderList";

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
          
          {/* Admin Routes */}
          <Route path="/admin" component={AdminDashboard} />
          <Route path="/admin/products" component={ProductList} />
          <Route path="/admin/products/new" component={ProductForm} />
          <Route path="/admin/products/:id/edit" component={ProductForm} />
          <Route path="/admin/categories" component={CategoryList} />
          <Route path="/admin/orders" component={OrderList} />
          <Route path="/admin/orders/pending" component={OrderList} />
          <Route path="/admin/orders/processing" component={OrderList} />
          <Route path="/admin/orders/shipping" component={OrderList} />
          <Route path="/admin/orders/delivered" component={OrderList} />
          <Route path="/admin/orders/cancelled" component={OrderList} />
          
          <Route component={NotFound} />
        </Switch>
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
}

export default App;
