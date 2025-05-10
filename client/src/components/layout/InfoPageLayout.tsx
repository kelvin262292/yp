import React from 'react';
import { Helmet } from 'react-helmet';
import { useLanguage } from '@/hooks/useLanguage';

interface InfoPageLayoutProps {
  title: string;
  children: React.ReactNode;
}

const InfoPageLayout: React.FC<InfoPageLayoutProps> = ({ title, children }) => {
  const { t } = useLanguage();
  
  return (
    <div className="bg-gray-50 py-12">
      <Helmet>
        <title>{title} | Yapee</title>
        <meta name="description" content={`${title} - Yapee - Thương mại điện tử hàng đầu Việt Nam`} />
      </Helmet>
      
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="bg-primary text-white p-6">
            <h1 className="text-2xl md:text-3xl font-semibold">{title}</h1>
          </div>
          <div className="p-6 md:p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoPageLayout;