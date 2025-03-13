import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  User,
  UserRole,
  mockSignIn,
  mockSignUp,
  mockSignOut,
  mockGetCurrentUser,
} from "@/lib/auth-utils";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (
    email: string,
    password: string,
    role: UserRole,
  ) => Promise<{ success: boolean; user: User | null }>;
  register: (
    email: string,
    password: string,
    name: string,
    role: UserRole,
  ) => Promise<{ success: boolean }>;
  logout: () => Promise<{ success: boolean }>;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadUser() {
      setIsLoading(true);
      try {
        const currentUser = await mockGetCurrentUser();
        setUser(currentUser);
      } catch (err) {
        console.error("Error loading user:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();
  }, []);

  const login = async (email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    setError(null);

    try {
      const { user, error } = await mockSignIn(email, password, role);

      if (error) {
        setError(error);
        setIsLoading(false);
        return { success: false, user: null };
      }

      if (user) {
        setUser(user);
        return { success: true, user };
      }

      return { success: false, user: null };
    } catch (err: any) {
      setError(err.message || "An error occurred during login");
      return { success: false, user: null };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    role: UserRole,
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const { success, error } = await mockSignUp(email, password, name, role);

      if (error) {
        setError(error);
        return { success: false };
      }

      if (success) {
        // After successful registration, log the user in
        const loginResult = await login(email, password, role);
        return { success: loginResult.success };
      }

      return { success: false };
    } catch (err: any) {
      setError(err.message || "An error occurred during registration");
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await mockSignOut();

      if (error) {
        setError(error);
        return { success: false };
      }

      setUser(null);
      return { success: true };
    } catch (err: any) {
      setError(err.message || "An error occurred during logout");
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  // Function to update User data in context
  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, error, login, register, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
