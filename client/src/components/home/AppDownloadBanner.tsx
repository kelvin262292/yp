import { useLanguage } from "@/hooks/useLanguage";

const AppDownloadBanner = () => {
  const { t } = useLanguage();
  
  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="bg-primary rounded-lg overflow-hidden">
          <div className="flex flex-col md:flex-row items-center">
            <div className="w-full md:w-1/2 p-8">
              <h2 className="text-white text-2xl font-poppins font-semibold mb-4">
                {t("app-download-title")}
              </h2>
              <p className="text-white/80 mb-6">
                {t("app-download-desc")}
              </p>
              <div className="flex space-x-4">
                <a href="#" className="bg-white rounded-lg px-4 py-2 flex items-center hover:bg-light transition">
                  <i className="fab fa-apple text-2xl mr-2"></i>
                  <div>
                    <div className="text-xs">Download on the</div>
                    <div className="font-semibold">App Store</div>
                  </div>
                </a>
                <a href="#" className="bg-white rounded-lg px-4 py-2 flex items-center hover:bg-light transition">
                  <i className="fab fa-google-play text-2xl mr-2"></i>
                  <div>
                    <div className="text-xs">GET IT ON</div>
                    <div className="font-semibold">Google Play</div>
                  </div>
                </a>
              </div>
            </div>
            <div className="w-full md:w-1/2 p-8 flex justify-center">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=320&h=600" 
                  alt="Yapee App" 
                  className="rounded-xl shadow-lg max-w-[250px]" 
                />
                <div className="absolute -top-4 -right-4 bg-secondary text-white rounded-full p-4 shadow-lg">
                  <div className="text-center">
                    <div className="text-sm font-semibold">{t("exclusive-app")}</div>
                    <div className="text-xl font-bold">20%</div>
                    <div className="text-xs">{t("off")}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppDownloadBanner;
