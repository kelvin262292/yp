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

const SettingsDashboard = () => {
  const { t } = useLanguage();

  return (
    <AdminLayout>
      <Helmet>
        <title>Cài đặt | Yapee Admin</title>
      </Helmet>

      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Cài đặt hệ thống</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Cài đặt hệ thống</CardTitle>
            <CardDescription>
              Quản lý cài đặt và cấu hình toàn bộ hệ thống
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Tính năng đang phát triển</AlertTitle>
              <AlertDescription>
                Tính năng cài đặt hệ thống đang được phát triển và sẽ có sẵn trong phiên bản tới.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default SettingsDashboard;