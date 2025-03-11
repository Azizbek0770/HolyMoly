// Helper functions for authentication

export type UserRole = "admin" | "client" | "delivery";

export interface User {
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

// Mock user data
export function getMockUser(role: UserRole): User {
  const users: Record<UserRole, User> = {
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
  return users[role];
}

// Mock sign in function
export async function mockSignIn(
  email: string,
  password: string,
  role: UserRole,
) {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Simplified login for development
  // Allow login with just the role name or with email
  if (email === role || email === `${role}@example.com`) {
    if (password === role) {
      return { user: getMockUser(role), error: null };
    }
  }

  return { user: null, error: "Invalid credentials" };
}

// Mock sign up function
export async function mockSignUp(
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

// Mock sign out function
export async function mockSignOut() {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500));

  return { error: null };
}

// Mock get current user function
export async function mockGetCurrentUser() {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500));

  // In a real app, you would check for a stored token and fetch the user
  return null;
}
