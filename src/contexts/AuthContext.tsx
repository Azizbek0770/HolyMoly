import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  phone?: string;
  loyaltyPoints?: number;
  membershipTier?: string;
  bio?: string;
  birthdate?: string;
  avatar?: string;
  createdAt?: string;
}

type UserRole = "admin" | "client" | "delivery";

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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      const { success, error } = await signUp(email, password, name, role);

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
      const { error } = await signOut();

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

  // Function to update user data in context
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

// Mock authentication functions
async function signIn(email: string, password: string, role: UserRole) {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Mock users
  const users = {
    admin: {
      id: "admin-123",
      email: "admin@example.com",
      name: "Admin User",
      role: "admin",
      createdAt: new Date().toISOString(),
    },
    client: {
      id: "client-123",
      email: "client@example.com",
      name: "Client User",
      role: "client",
      phone: "(555) 123-4567",
      loyaltyPoints: 450,
      membershipTier: "Silver",
      createdAt: new Date().toISOString(),
    },
    delivery: {
      id: "delivery-123",
      email: "delivery@example.com",
      name: "Delivery User",
      role: "delivery",
      phone: "(555) 987-6543",
      createdAt: new Date().toISOString(),
    },
  };

  // Check if email and role match
  if (email === `${role}@example.com` && password === role) {
    return { user: users[role], error: null };
  }

  return { user: null, error: "Invalid credentials" };
}

async function signUp(
  email: string,
  password: string,
  name: string,
  role: UserRole,
) {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // In a real app, you would create a new user in the database
  return { success: true, error: null };
}

async function signOut() {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500));

  return { error: null };
}

async function getCurrentUser() {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500));

  // In a real app, you would check for a stored token and fetch the user
  return null;
}
