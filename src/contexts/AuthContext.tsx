import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  UserRole,
  signIn,
  signUp,
  signOut,
  getCurrentUser,
} from "@/lib/auth";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  register: (
    email: string,
    password: string,
    name: string,
    role: UserRole,
  ) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadUser() {
      setIsLoading(true);
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setIsLoading(false);
    }

    loadUser();
  }, []);

  const login = async (email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    setError(null);

    try {
      const { user, error } = await signIn(email, password, role);

      if (error) {
        setError(error);
        setIsLoading(false);
        return;
      }

      if (user) {
        setUser(user);

        // Redirect based on role
        if (user.role === "admin") {
          navigate("/admin");
        } else if (user.role === "delivery") {
          navigate("/delivery");
        } else {
          navigate("/client");
        }
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during login");
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
      const { success, error } = await signUp(email, password, name, role);

      if (error) {
        setError(error);
        return;
      }

      if (success) {
        // After successful registration, log the user in
        await login(email, password, role);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during registration");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await signOut();

      if (error) {
        setError(error);
        return;
      }

      setUser(null);
      navigate("/");
    } catch (err: any) {
      setError(err.message || "An error occurred during logout");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, error, login, register, logout }}
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
