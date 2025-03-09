import { Button, ButtonProps } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function LogoutButton({ className, ...props }: ButtonProps) {
  const { logout, isLoading } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <Button
      variant="ghost"
      className={`w-full justify-start text-destructive ${className}`}
      onClick={handleLogout}
      disabled={isLoading}
      {...props}
    >
      <LogOut className="h-5 w-5 mr-2" />
      {isLoading ? "Logging out..." : "Logout"}
    </Button>
  );
}
