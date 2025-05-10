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

const ReportsDashboard = () => {
  const { t } = useLanguage();

  return (
    <AdminLayout>
      <Helmet>
        <title>Báo cáo | Yapee Admin</title>
      </Helmet>

      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Báo cáo & Thống kê</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Báo cáo hệ thống</CardTitle>
            <CardDescription>
              Xem báo cáo và thống kê chi tiết về hệ thống
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Tính năng đang phát triển</AlertTitle>
              <AlertDescription>
                Tính năng báo cáo đang được phát triển và sẽ có sẵn trong phiên bản tới.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default ReportsDashboard;