import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { useLanguage } from "@/hooks/useLanguage";
import { useCart } from "@/hooks/useCart";
import SearchBar from "@/components/common/SearchBar";
import LanguageSelector from "@/components/layout/LanguageSelector";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMediaQuery } from "@/hooks/use-mobile";

const Header = () => {
  const { t } = useLanguage();
  const { cartItems } = useCart();
  const [, navigate] = useLocation();
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for sticky header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Total items in cart
  const totalCartItems = cartItems.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Language Selector Modal */}
      <LanguageSelector
        isOpen={showLanguageModal}
        onClose={() => setShowLanguageModal(false)}
      />

      {/* Top Navigation Bar */}
      <div className="bg-primary text-white text-xs py-1">
        <div className="container mx-auto px-4 flex flex-wrap justify-between items-center">
          <div className="flex space-x-4">
            <button className="hover:text-secondary transition">
              {t("feedback")}
            </button>
            <button className="hover:text-secondary transition hidden sm:block">
              {t("app")}
            </button>
            <button className="hover:text-secondary transition hidden sm:block">
              {t("sell")}
            </button>
          </div>
          <div className="flex space-x-4">
            <button className="hover:text-secondary transition hidden sm:block">
              {t("customer-care")}
            </button>
            <button className="hover:text-secondary transition hidden sm:block">
              {t("track-order")}
            </button>
            <button
              onClick={() => setShowLanguageModal(true)}
              className="hover:text-secondary transition flex items-center"
            >
              <i className="fas fa-globe mr-1"></i>
              <span>{t("language")}</span>
            </button>
            <button className="hover:text-secondary transition">
              {t("login")}
            </button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div 
        className={`bg-white py-4 ${scrolled ? 'shadow-md' : 'shadow-sm'} transition-shadow duration-300`}
      >
        <div className="container mx-auto px-4 flex flex-wrap items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="text-primary font-poppins font-bold text-3xl">
              Yapee
            </div>
          </Link>

          {/* Search Bar */}
          <div className="w-full md:w-1/2 my-4 md:my-0 order-3 md:order-2">
            <SearchBar />
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-6 order-2 md:order-3">
            <Link href="/wishlist" className="text-yapee-gray hover:text-primary">
              <i className="fas fa-heart text-xl"></i>
            </Link>

            <div className="relative">
              <DropdownMenu>
                <DropdownMenuTrigger className="focus:outline-none">
                  <i className="fas fa-user text-xl text-gray-600 hover:text-primary transition-colors"></i>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48">
                  <DropdownMenuItem onClick={() => navigate("/account")}>
                    {t("my-account")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/orders")}>
                    {t("my-orders")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/wishlist")}>
                    {t("my-wishlist")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => console.log("Logout clicked")}>
                    {t("logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <Link href="/cart" className="text-yapee-gray hover:text-primary relative">
              <i className="fas fa-shopping-cart text-xl"></i>
              {totalCartItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalCartItems > 99 ? "99+" : totalCartItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      <nav className="bg-white shadow-sm py-3 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-6 overflow-x-auto pb-2 scrollbar-hide">
            <Link href="/category/phones" className="text-gray-600 hover:text-primary whitespace-nowrap flex flex-col items-center">
              <i className="fas fa-mobile-alt mb-1"></i>
              <span className="text-sm">{t("category-phones")}</span>
            </Link>
            <Link href="/category/electronics" className="text-gray-600 hover:text-primary whitespace-nowrap flex flex-col items-center">
              <i className="fas fa-laptop mb-1"></i>
              <span className="text-sm">{t("category-electronics")}</span>
            </Link>
            <Link href="/category/fashion" className="text-gray-600 hover:text-primary whitespace-nowrap flex flex-col items-center">
              <i className="fas fa-tshirt mb-1"></i>
              <span className="text-sm">{t("category-fashion")}</span>
            </Link>
            <Link href="/category/beauty" className="text-gray-600 hover:text-primary whitespace-nowrap flex flex-col items-center">
              <i className="fas fa-spa mb-1"></i>
              <span className="text-sm">{t("category-beauty")}</span>
            </Link>
            <Link href="/category/home" className="text-gray-600 hover:text-primary whitespace-nowrap flex flex-col items-center">
              <i className="fas fa-home mb-1"></i>
              <span className="text-sm">{t("category-home")}</span>
            </Link>
            <Link href="/category/kids" className="text-gray-600 hover:text-primary whitespace-nowrap flex flex-col items-center">
              <i className="fas fa-baby mb-1"></i>
              <span className="text-sm">{t("category-kids")}</span>
            </Link>
            <Link href="/category/sports" className="text-gray-600 hover:text-primary whitespace-nowrap flex flex-col items-center">
              <i className="fas fa-running mb-1"></i>
              <span className="text-sm">{t("category-sports")}</span>
            </Link>
            <Link href="/category/automotive" className="text-gray-600 hover:text-primary whitespace-nowrap flex flex-col items-center">
              <i className="fas fa-car mb-1"></i>
              <span className="text-sm">{t("category-automotive")}</span>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
