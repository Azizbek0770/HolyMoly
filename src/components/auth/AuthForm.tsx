import { useState } from "react";
import { motion } from "framer-motion";
import { Spinner } from "@/components/ui/spinner";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/lib/auth-utils";

export default function AuthForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login, register, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [selectedRole, setSelectedRole] = useState<UserRole>("client");

  // Login form state
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // Register form state
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Form errors
  const [loginErrors, setLoginErrors] = useState<Record<string, string>>({});
  const [registerErrors, setRegisterErrors] = useState<Record<string, string>>(
    {},
  );

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [id]: value,
    }));

    // Clear error when user types
    if (loginErrors[id]) {
      setLoginErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setRegisterData((prev) => ({
      ...prev,
      [id]: value,
    }));

    // Clear error when user types
    if (registerErrors[id]) {
      setRegisterErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  const validateLoginForm = () => {
    const errors: Record<string, string> = {};

    if (!loginData.email.trim()) {
      errors.email = "Email is required";
    }

    if (!loginData.password.trim()) {
      errors.password = "Password is required";
    }

    setLoginErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateRegisterForm = () => {
    const errors: Record<string, string> = {};

    if (!registerData.name.trim()) {
      errors.name = "Name is required";
    }

    if (!registerData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(registerData.email)) {
      errors.email = "Invalid email format";
    }

    if (!registerData.password.trim()) {
      errors.password = "Password is required";
    } else if (registerData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (!registerData.confirmPassword.trim()) {
      errors.confirmPassword = "Please confirm your password";
    } else if (registerData.password !== registerData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setRegisterErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateLoginForm()) {
      return;
    }

    try {
      const result = await login(
        loginData.email,
        loginData.password,
        selectedRole,
      );

      if (result.success) {
        toast({
          title: "Login successful",
          description: `Welcome back, ${result.user?.name}!`,
        });

        // Redirect based on role
        if (result.user?.role === "admin") {
          navigate("/admin");
        } else if (result.user?.role === "client") {
          navigate("/client");
        } else if (result.user?.role === "delivery") {
          navigate("/delivery");
        }
      } else {
        toast({
          title: "Login failed",
          description: "Invalid credentials. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: "An error occurred during login. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateRegisterForm()) {
      return;
    }

    try {
      const result = await register(
        registerData.email,
        registerData.password,
        registerData.name,
        selectedRole,
      );

      if (result.success) {
        toast({
          title: "Registration successful",
          description: "Your account has been created successfully.",
        });

        // Redirect based on role
        if (selectedRole === "admin") {
          navigate("/admin");
        } else if (selectedRole === "client") {
          navigate("/client");
        } else if (selectedRole === "delivery") {
          navigate("/delivery");
        }
      } else {
        toast({
          title: "Registration failed",
          description: "Failed to create account. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
        description: "An error occurred during registration. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div
      className="flex items-center justify-center min-h-screen bg-muted/30 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {activeTab === "login" ? "Sign In" : "Create an Account"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={(value) =>
              setActiveTab(value as "login" | "register")
            }
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <div className="mb-4">
              <Label>Select Role</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <Button
                  type="button"
                  variant={selectedRole === "client" ? "default" : "outline"}
                  className="w-full"
                  onClick={() => setSelectedRole("client")}
                >
                  Client
                </Button>
                <Button
                  type="button"
                  variant={selectedRole === "admin" ? "default" : "outline"}
                  className="w-full"
                  onClick={() => setSelectedRole("admin")}
                >
                  Admin
                </Button>
                <Button
                  type="button"
                  variant={selectedRole === "delivery" ? "default" : "outline"}
                  className="w-full"
                  onClick={() => setSelectedRole("delivery")}
                >
                  Delivery
                </Button>
              </div>
            </div>

            {/* Login Form */}
            <div className={activeTab === "login" ? "block" : "hidden"}>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={loginData.email}
                    onChange={handleLoginChange}
                    className={loginErrors.email ? "border-red-500" : ""}
                  />
                  {loginErrors.email && (
                    <p className="text-red-500 text-xs mt-1">
                      {loginErrors.email}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    className={loginErrors.password ? "border-red-500" : ""}
                  />
                  {loginErrors.password && (
                    <p className="text-red-500 text-xs mt-1">
                      {loginErrors.password}
                    </p>
                  )}
                </div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full"
                >
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <Spinner size="sm" className="mr-2" />
                        Signing in...
                      </span>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </motion.div>
              </form>
            </div>

            {/* Register Form */}
            <div className={activeTab === "register" ? "block" : "hidden"}>
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={registerData.name}
                    onChange={handleRegisterChange}
                    className={registerErrors.name ? "border-red-500" : ""}
                  />
                  {registerErrors.name && (
                    <p className="text-red-500 text-xs mt-1">
                      {registerErrors.name}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={registerData.email}
                    onChange={handleRegisterChange}
                    className={registerErrors.email ? "border-red-500" : ""}
                  />
                  {registerErrors.email && (
                    <p className="text-red-500 text-xs mt-1">
                      {registerErrors.email}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={registerData.password}
                    onChange={handleRegisterChange}
                    className={registerErrors.password ? "border-red-500" : ""}
                  />
                  {registerErrors.password && (
                    <p className="text-red-500 text-xs mt-1">
                      {registerErrors.password}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={registerData.confirmPassword}
                    onChange={handleRegisterChange}
                    className={
                      registerErrors.confirmPassword ? "border-red-500" : ""
                    }
                  />
                  {registerErrors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">
                      {registerErrors.confirmPassword}
                    </p>
                  )}
                </div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full"
                >
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <Spinner size="sm" className="mr-2" />
                        Creating account...
                      </span>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </motion.div>
              </form>
            </div>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-muted-foreground text-center w-full">
            {activeTab === "login" ? (
              <>
                Don't have an account?{" "}
                <button
                  type="button"
                  className="underline text-primary"
                  onClick={() => setActiveTab("register")}
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  className="underline text-primary"
                  onClick={() => setActiveTab("login")}
                >
                  Sign in
                </button>
              </>
            )}
          </div>
          <div className="text-xs text-muted-foreground text-center w-full">
            <p>For testing, use these credentials:</p>
            <p>
              Admin: <code>admin@example.com / admin</code>
            </p>
            <p>
              Client: <code>client@example.com / client</code>
            </p>
            <p>
              Delivery: <code>delivery@example.com / delivery</code>
            </p>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
