import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useLanguage } from "@/hooks/useLanguage";
import { Language } from "@/lib/i18n";

interface LanguageSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

const LanguageSelector = ({ isOpen, onClose }: LanguageSelectorProps) => {
  const { language, setLanguage, t } = useLanguage();

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-primary">
            {t("select-language")}
          </DialogTitle>
          <DialogDescription>
            Chọn ngôn ngữ hiển thị cho ứng dụng Yapee
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-4 mt-4">
          <button
            onClick={() => handleLanguageChange("vi")}
            className={`flex items-center p-3 border rounded-lg hover:bg-light transition ${
              language === "vi" ? "border-primary bg-light" : ""
            }`}
          >
            <img
              src="https://pixabay.com/get/g95e3dd63609205cfde842016b72b2e6208603eafcbe72ca20496115bc202705afeb161d35b633b8c6d1c6e752497370f3bf73d39cfe45e0cb95afee8e5a648a8_1280.jpg"
              alt="Việt Nam"
              className="w-6 h-6 mr-3"
            />
            <span>{t("vietnamese")}</span>
          </button>
          <button
            onClick={() => handleLanguageChange("en")}
            className={`flex items-center p-3 border rounded-lg hover:bg-light transition ${
              language === "en" ? "border-primary bg-light" : ""
            }`}
          >
            <img
              src="https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?auto=format&fit=crop&w=40&h=40"
              alt="English"
              className="w-6 h-6 mr-3"
            />
            <span>{t("english")}</span>
          </button>
          <button
            onClick={() => handleLanguageChange("zh")}
            className={`flex items-center p-3 border rounded-lg hover:bg-light transition ${
              language === "zh" ? "border-primary bg-light" : ""
            }`}
          >
            <img
              src="https://pixabay.com/get/gd159c62416ee6e06c3dc481e01659e779978617abed622a26ac8762f6ade07dfa1a1093705cac9912fee48d1eab9b8dc43d308e687b851f5d361235bc4a5e602_1280.jpg"
              alt="中文"
              className="w-6 h-6 mr-3"
            />
            <span>{t("chinese")}</span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LanguageSelector;
