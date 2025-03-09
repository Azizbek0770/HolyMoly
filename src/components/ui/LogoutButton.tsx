import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface LogoutButtonProps extends React.ComponentProps<typeof Button> {
  redirectTo?: string;
  showIcon?: boolean;
  fullWidth?: boolean;
}

export default function LogoutButton({
  redirectTo = "/",
  showIcon = true,
  fullWidth = false,
  className,
  variant = "ghost",
  size = "default",
  ...props
}: LogoutButtonProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const result = await logout();
      if (result.success) {
        navigate(redirectTo);
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={`${fullWidth ? "w-full justify-start" : ""} ${className || ""}`}
      onClick={handleLogout}
      disabled={isLoggingOut}
      {...props}
    >
      {isLoggingOut ? (
        <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      ) : (
        showIcon && <LogOut className="h-4 w-4 mr-2" />
      )}
      {isLoggingOut ? "Logging out..." : "Sign Out"}
    </Button>
  );
}
