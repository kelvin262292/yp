import { Helmet } from "react-helmet";
import AdminLayout from "@/components/admin/layout/AdminLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const MarketingDashboard = () => {
  const { t } = useLanguage();

  return (
    <AdminLayout>
      <Helmet>
        <title>Marketing | Yapee Admin</title>
      </Helmet>

      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Marketing</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Marketing & Khuyến mãi</CardTitle>
            <CardDescription>
              Quản lý các chương trình marketing và khuyến mãi của hệ thống
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Tính năng đang phát triển</AlertTitle>
              <AlertDescription>
                Tính năng quản lý marketing đang được phát triển và sẽ có sẵn trong phiên bản tới.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default MarketingDashboard;