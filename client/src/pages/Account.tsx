import { useState, useEffect } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import { Helmet } from "react-helmet";
import { useLocation, Redirect } from "wouter";
import { useToast } from "@/hooks/use-toast";
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
  const { isAuthenticated, login, register, isLoading, user, logout } = useAuth();
  const { toast } = useToast();
  const [currentTab, setCurrentTab] = useState<AccountTab>("login");
  const [location, setLocation] = useLocation();
  
  // Form states
  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
  });
  
  const [registerForm, setRegisterForm] = useState({
    username: "",
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  
  // Handle redirect after login
  const params = new URLSearchParams(window.location.search);
  const redirectPath = params.get("redirect") || "/account";
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !location.includes("?")) {
      setLocation("/");
    }
  }, [isAuthenticated, location]);
  
  // Login form handlers
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setLoginForm({
      ...loginForm,
      [id]: value,
    });
  };
  
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!loginForm.username || !loginForm.password) {
      toast({
        title: "Lỗi đăng nhập",
        description: "Vui lòng nhập đầy đủ thông tin",
        variant: "destructive",
      });
      return;
    }
    
    const success = await login(loginForm.username, loginForm.password);
    if (success) {
      // Redirect to the path that required authentication
      setTimeout(() => {
        setLocation(redirectPath);
      }, 500);
    }
  };
  
  // Register form handlers
  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setRegisterForm({
      ...registerForm,
      [id === "register-email" ? "email" : id === "register-password" ? "password" : id === "full-name" ? "fullName" : id]: value,
    });
  };
  
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!registerForm.username || !registerForm.password || !registerForm.confirmPassword) {
      toast({
        title: "Lỗi đăng ký",
        description: "Vui lòng nhập đầy đủ thông tin bắt buộc",
        variant: "destructive",
      });
      return;
    }
    
    if (registerForm.password !== registerForm.confirmPassword) {
      toast({
        title: "Lỗi đăng ký",
        description: "Mật khẩu xác nhận không khớp",
        variant: "destructive",
      });
      return;
    }
    
    // Create user object
    const userData = {
      username: registerForm.username,
      password: registerForm.password,
      fullName: registerForm.fullName,
      email: registerForm.email,
      phone: registerForm.phone,
    };
    
    const success = await register(userData);
    if (success) {
      // Switch to login tab after successful registration
      setCurrentTab("login");
      
      // Reset form
      setRegisterForm({
        username: "",
        fullName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });
    }
  };
  
  const handleLogout = () => {
    logout();
  };
  
  // Show user profile if authenticated
  if (isAuthenticated && user) {
    return (
      <>
        <Helmet>
          <title>{t("my-account")} - Yapee</title>
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
            
            <div className="max-w-4xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>{t("my-account")}</CardTitle>
                  <CardDescription>
                    {t("welcome")}, {user.fullName || user.username}!
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-medium mb-4">{t("account-information")}</h3>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-500">{t("username")}</p>
                          <p className="font-medium">{user.username}</p>
                        </div>
                        {user.fullName && (
                          <div>
                            <p className="text-sm text-gray-500">{t("full-name")}</p>
                            <p className="font-medium">{user.fullName}</p>
                          </div>
                        )}
                        {user.email && (
                          <div>
                            <p className="text-sm text-gray-500">{t("email")}</p>
                            <p className="font-medium">{user.email}</p>
                          </div>
                        )}
                        {user.phone && (
                          <div>
                            <p className="text-sm text-gray-500">{t("phone")}</p>
                            <p className="font-medium">{user.phone}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">{t("account-actions")}</h3>
                      <div className="space-y-4">
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                          onClick={() => setLocation("/account/orders")}
                        >
                          {t("my-orders")}
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                          onClick={() => setLocation("/account/edit")}
                        >
                          {t("edit-profile")}
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                          onClick={() => setLocation("/account/change-password")}
                        >
                          {t("change-password")}
                        </Button>
                        <Button
                          variant="destructive"
                          className="w-full justify-start"
                          onClick={handleLogout}
                        >
                          {t("logout")}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </>
    );
  }
  
  // ... existing login and register UI, modified with form submission ...
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
                  <form onSubmit={handleLoginSubmit}>
                  <CardHeader>
                    <CardTitle>{t("login-title")}</CardTitle>
                    <CardDescription>{t("login-description")}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="username">{t("username")}</Label>
                      <Input 
                          id="username" 
                        type="text" 
                          placeholder="john_doe" 
                          value={loginForm.username}
                          onChange={handleLoginChange}
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
                          value={loginForm.password}
                          onChange={handleLoginChange}
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col">
                      <Button 
                        type="submit" 
                        className="w-full bg-primary hover:bg-primary/90"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="flex items-center">
                            <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            {t("logging-in")}
                          </div>
                        ) : t("login")}
                    </Button>
                    <div className="mt-4 text-center text-sm">
                      <span className="text-gray-600">{t("no-account")}</span>{" "}
                      <Button 
                          type="button"
                        variant="link" 
                        className="p-0 h-auto"
                        onClick={() => setCurrentTab("register")}
                      >
                        {t("create-account")}
                      </Button>
                    </div>
                  </CardFooter>
                  </form>
                </Card>
              </TabsContent>
              
              {/* Register Form */}
              <TabsContent value="register">
                <Card>
                  <form onSubmit={handleRegisterSubmit}>
                  <CardHeader>
                    <CardTitle>{t("register-title")}</CardTitle>
                    <CardDescription>{t("register-description")}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="username">
                          {t("username")} <span className="text-red-500">*</span>
                        </Label>
                        <Input 
                          id="username" 
                          type="text" 
                          placeholder="john_doe" 
                          value={registerForm.username}
                          onChange={handleRegisterChange}
                        />
                      </div>
                    <div className="space-y-2">
                      <Label htmlFor="full-name">{t("full-name")}</Label>
                      <Input 
                        id="full-name" 
                        type="text" 
                        placeholder="John Doe" 
                          value={registerForm.fullName}
                          onChange={handleRegisterChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-email">{t("email")}</Label>
                      <Input 
                        id="register-email" 
                        type="email" 
                        placeholder="john@example.com" 
                          value={registerForm.email}
                          onChange={handleRegisterChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">{t("phone")}</Label>
                      <Input 
                        id="phone" 
                        type="tel" 
                        placeholder="+84 123 456 789" 
                          value={registerForm.phone}
                          onChange={handleRegisterChange}
                      />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="register-password">
                          {t("password")} <span className="text-red-500">*</span>
                        </Label>
                      <Input 
                        id="register-password" 
                        type="password" 
                          value={registerForm.password}
                          onChange={handleRegisterChange}
                      />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">
                          {t("confirm-password")} <span className="text-red-500">*</span>
                        </Label>
                      <Input 
                          id="confirmPassword" 
                        type="password" 
                          value={registerForm.confirmPassword}
                          onChange={handleRegisterChange}
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col">
                      <Button 
                        type="submit"
                        className="w-full bg-primary hover:bg-primary/90"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="flex items-center">
                            <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            {t("registering")}
                          </div>
                        ) : t("register")}
                    </Button>
                    <div className="mt-4 text-center text-sm">
                      <span className="text-gray-600">{t("have-account")}</span>{" "}
                      <Button 
                          type="button"
                        variant="link" 
                        className="p-0 h-auto"
                        onClick={() => setCurrentTab("login")}
                      >
                        {t("login")}
                      </Button>
                    </div>
                  </CardFooter>
                  </form>
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
