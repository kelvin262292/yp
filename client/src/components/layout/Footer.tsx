import { Link } from "wouter";
import { useLanguage } from "@/hooks/useLanguage";

const Footer = () => {
  const { t } = useLanguage();
  
  return (
    <footer className="bg-primary text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Yapee */}
          <div>
            <h3 className="font-poppins font-semibold text-xl mb-4">{t("about-yapee")}</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-white/80 hover:text-white">{t("about-us")}</Link></li>
              <li><Link href="/careers" className="text-white/80 hover:text-white">{t("careers")}</Link></li>
              <li><Link href="/terms" className="text-white/80 hover:text-white">{t("terms")}</Link></li>
              <li><Link href="/privacy" className="text-white/80 hover:text-white">{t("privacy")}</Link></li>
              <li><Link href="/seller" className="text-white/80 hover:text-white">{t("seller-center")}</Link></li>
            </ul>
          </div>
          
          {/* Customer Service */}
          <div>
            <h3 className="font-poppins font-semibold text-xl mb-4">{t("customer-service")}</h3>
            <ul className="space-y-2">
              <li><Link href="/help" className="text-white/80 hover:text-white">{t("help-center")}</Link></li>
              <li><Link href="/contact" className="text-white/80 hover:text-white">{t("contact-us")}</Link></li>
              <li><Link href="/return-policy" className="text-white/80 hover:text-white">{t("return-policy")}</Link></li>
              <li><Link href="/report" className="text-white/80 hover:text-white">{t("report-issue")}</Link></li>
              <li><Link href="/faq" className="text-white/80 hover:text-white">{t("faq")}</Link></li>
            </ul>
          </div>
          
          {/* Payment Methods */}
          <div>
            <h3 className="font-poppins font-semibold text-xl mb-4">{t("payment-methods")}</h3>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white p-2 rounded">
                <img src="https://images.unsplash.com/photo-1536859355448-76f92ebdc33d?auto=format&fit=crop&w=50&h=30" alt="Visa" className="h-6 w-auto" />
              </div>
              <div className="bg-white p-2 rounded">
                <img src="https://images.unsplash.com/photo-1556742393-d75f468bfcb0?auto=format&fit=crop&w=50&h=30" alt="Mastercard" className="h-6 w-auto" />
              </div>
              <div className="bg-white p-2 rounded">
                <img src="https://images.unsplash.com/photo-1601581975053-7c899da7347e?auto=format&fit=crop&w=50&h=30" alt="PayPal" className="h-6 w-auto" />
              </div>
              <div className="bg-white p-2 rounded">
                <i className="fas fa-money-bill-wave text-primary text-xl"></i>
              </div>
              <div className="bg-white p-2 rounded">
                <i className="fas fa-credit-card text-primary text-xl"></i>
              </div>
              <div className="bg-white p-2 rounded">
                <i className="fas fa-wallet text-primary text-xl"></i>
              </div>
            </div>
            <h3 className="font-poppins font-semibold text-xl mb-4 mt-6">{t("shipping-partners")}</h3>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white p-2 rounded">
                <span className="text-primary font-semibold text-sm">GHN</span>
              </div>
              <div className="bg-white p-2 rounded">
                <span className="text-primary font-semibold text-sm">Ninja</span>
              </div>
              <div className="bg-white p-2 rounded">
                <span className="text-primary font-semibold text-sm">Grab</span>
              </div>
            </div>
          </div>
          
          {/* Follow Us */}
          <div>
            <h3 className="font-poppins font-semibold text-xl mb-4">{t("follow-us")}</h3>
            <div className="flex space-x-4 mb-6">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="bg-white text-primary rounded-full w-10 h-10 flex items-center justify-center hover:bg-light transition">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="bg-white text-primary rounded-full w-10 h-10 flex items-center justify-center hover:bg-light transition">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="bg-white text-primary rounded-full w-10 h-10 flex items-center justify-center hover:bg-light transition">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="bg-white text-primary rounded-full w-10 h-10 flex items-center justify-center hover:bg-light transition">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
            <h3 className="font-poppins font-semibold text-xl mb-4">{t("app-download")}</h3>
            <div className="bg-white p-4 rounded-lg flex items-center justify-center">
              <img src="https://images.unsplash.com/photo-1555421689-3f034debb7a6?auto=format&fit=crop&w=100&h=100" alt="QR Code" className="w-24 h-24" />
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/20 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/60 text-sm mb-4 md:mb-0">{t("copyright")}</p>
            <div className="flex space-x-4">
              <button onClick={() => document.querySelector('html')?.scrollTo({ top: 0, behavior: 'smooth' })}>
                <i className="fas fa-arrow-up text-white/80 hover:text-white"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
