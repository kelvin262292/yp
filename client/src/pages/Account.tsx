import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { Helmet } from "react-helmet";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type AccountTab = "login" | "register";

const Account = () => {
  const { t } = useLanguage();
  const [currentTab, setCurrentTab] = useState<AccountTab>("login");
  
  return (
    <>
      <Helmet>
        <title>{t("account")} - Yapee</title>
        <meta name="description" content={t("account-description")} />
      </Helmet>
      
      <div className="bg-light py-8">
        <div className="container mx-auto px-4">
          {/* Breadcrumbs */}
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">{t("home")}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/account">{t("account")}</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          <div className="max-w-md mx-auto">
            <Tabs defaultValue="login" onValueChange={(value) => setCurrentTab(value as AccountTab)}>
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="login">{t("login")}</TabsTrigger>
                <TabsTrigger value="register">{t("register")}</TabsTrigger>
              </TabsList>
              
              {/* Login Form */}
              <TabsContent value="login">
                <Card>
                  <CardHeader>
                    <CardTitle>{t("login-title")}</CardTitle>
                    <CardDescription>{t("login-description")}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">{t("email-or-username")}</Label>
                      <Input 
                        id="email" 
                        type="text" 
                        placeholder="john@example.com" 
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">{t("password")}</Label>
                        <Button variant="link" className="p-0 h-auto text-xs">
                          {t("forgot-password")}
                        </Button>
                      </div>
                      <Input 
                        id="password" 
                        type="password" 
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col">
                    <Button className="w-full bg-primary hover:bg-primary/90">
                      {t("login")}
                    </Button>
                    <div className="mt-4 text-center text-sm">
                      <span className="text-gray-600">{t("no-account")}</span>{" "}
                      <Button 
                        variant="link" 
                        className="p-0 h-auto"
                        onClick={() => setCurrentTab("register")}
                      >
                        {t("create-account")}
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              {/* Register Form */}
              <TabsContent value="register">
                <Card>
                  <CardHeader>
                    <CardTitle>{t("register-title")}</CardTitle>
                    <CardDescription>{t("register-description")}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="full-name">{t("full-name")}</Label>
                      <Input 
                        id="full-name" 
                        type="text" 
                        placeholder="John Doe" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-email">{t("email")}</Label>
                      <Input 
                        id="register-email" 
                        type="email" 
                        placeholder="john@example.com" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">{t("phone")}</Label>
                      <Input 
                        id="phone" 
                        type="tel" 
                        placeholder="+84 123 456 789" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-password">{t("password")}</Label>
                      <Input 
                        id="register-password" 
                        type="password" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">{t("confirm-password")}</Label>
                      <Input 
                        id="confirm-password" 
                        type="password" 
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col">
                    <Button className="w-full bg-primary hover:bg-primary/90">
                      {t("register")}
                    </Button>
                    <div className="mt-4 text-center text-sm">
                      <span className="text-gray-600">{t("have-account")}</span>{" "}
                      <Button 
                        variant="link" 
                        className="p-0 h-auto"
                        onClick={() => setCurrentTab("login")}
                      >
                        {t("login")}
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
};

export default Account;
