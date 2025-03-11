import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: string[];
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user doesn't have the required role, redirect to appropriate page
  if (!allowedRoles.includes(user.role)) {
    // Redirect based on user's role
    if (user.role === "admin") {
      return <Navigate to="/admin" replace />;
    } else if (user.role === "client") {
      return <Navigate to="/client" replace />;
    } else if (user.role === "delivery") {
      return <Navigate to="/delivery" replace />;
    }

    // Fallback to login if role is unknown
    return <Navigate to="/login" replace />;
  }

  // If user has the required role, render the protected content
  return <>{children}</>;
}
