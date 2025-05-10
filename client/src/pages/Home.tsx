import { Helmet } from "react-helmet";
import { useLanguage } from "@/hooks/useLanguage";
import HeroBanner from "@/components/home/HeroBanner";
import YapeeMall from "@/components/home/YapeeMall";
import FlashDeals from "@/components/home/FlashDeals";
import FeaturedCategories from "@/components/home/FeaturedCategories";
import ProductListings from "@/components/home/ProductListings";
import AppDownloadBanner from "@/components/home/AppDownloadBanner";

const Home = () => {
  const { language } = useLanguage();
  
  // Multi-language meta titles and descriptions
  const metaTitle = {
    vi: "Yapee - Sàn thương mại điện tử hàng đầu Đông Nam Á",
    en: "Yapee - Leading E-commerce Platform in Southeast Asia",
    zh: "Yapee - 东南亚领先电子商务平台"
  };
  
  const metaDescription = {
    vi: "Yapee cung cấp đa dạng sản phẩm chất lượng cao với dịch vụ hoàn hảo, nhiều phương thức thanh toán và chính sách đổi trả miễn phí.",
    en: "Yapee offers a wide range of high-quality products with perfect service, multiple payment methods and a free return policy.",
    zh: "Yapee提供各种高质量产品，完美的服务，多种付款方式和免费退货政策。"
  };

  return (
    <>
      <Helmet>
        <title>{metaTitle[language]}</title>
        <meta name="description" content={metaDescription[language]} />
        <meta property="og:title" content={metaTitle[language]} />
        <meta property="og:description" content={metaDescription[language]} />
      </Helmet>
      
      <HeroBanner />
      <YapeeMall />
      <FlashDeals />
      <FeaturedCategories />
      <ProductListings />
      <AppDownloadBanner />
    </>
  );
};

export default Home;
