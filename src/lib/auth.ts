import { supabase, mockAuthEnabled } from "./supabase";

export type UserRole = "client" | "admin" | "delivery";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export async function signIn(
  email: string,
  password: string,
  role: UserRole,
): Promise<{ user: User | null; error: string | null }> {
  try {
    // Use mock data for development when Supabase is not configured
    if (mockAuthEnabled) {
      console.log("Using mock authentication");

      // Mock admin login
      if (
        (email === "admin@example.com" && password === "password") ||
        (email === "admin" && password === "admin")
      ) {
        const user = {
          id: "mock-admin-id",
          email: "admin@example.com",
          name: "Admin User",
          role: "admin" as UserRole,
        };
        localStorage.setItem("mockUser", JSON.stringify(user));
        return { user, error: null };
      }

      // Mock client login
      if (
        (email === "client@example.com" && password === "password") ||
        (email === "client" && password === "client")
      ) {
        const user = {
          id: "mock-client-id",
          email: "client@example.com",
          name: "Client User",
          role: "client" as UserRole,
        };
        localStorage.setItem("mockUser", JSON.stringify(user));
        return { user, error: null };
      }

      // Mock delivery login
      if (
        (email === "delivery@example.com" && password === "password") ||
        (email === "delivery" && password === "delivery")
      ) {
        const user = {
          id: "mock-delivery-id",
          email: "delivery@example.com",
          name: "Delivery User",
          role: "delivery" as UserRole,
        };
        localStorage.setItem("mockUser", JSON.stringify(user));
        return { user, error: null };
      }

      // Mock login failure
      return { user: null, error: "Invalid credentials" };
    }

    // Real Supabase authentication
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    if (!data.user) {
      return { user: null, error: "No user found" };
    }

    // Fetch user profile from profiles table
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .single();

    if (profileError) {
      console.error("Error fetching profile:", profileError);
      return { user: null, error: "Error fetching user profile" };
    }

    // Check if user has the role they're trying to sign in with
    // Admin role is determined from the database, not from selection
    if (profileData.role === "admin") {
      // If user is admin in DB, they can access admin portal regardless of selected role
      return {
        user: {
          id: data.user.id,
          email: data.user.email || "",
          name: profileData.full_name || "",
          role: "admin",
        },
        error: null,
      };
    } else if (
      profileData.role !== role &&
      role !== "client" &&
      role !== "delivery"
    ) {
      // If user is trying to access a role they don't have
      return { user: null, error: "You don't have permission for this role" };
    }

    return {
      user: {
        id: data.user.id,
        email: data.user.email || "",
        name: profileData.full_name || "",
        role: profileData.role as UserRole,
      },
      error: null,
    };
  } catch (error: any) {
    console.error("Sign in error:", error);
    return {
      user: null,
      error: error.message || "An error occurred during sign in",
    };
  }
}

export async function signUp(
  email: string,
  password: string,
  name: string,
  role: UserRole,
): Promise<{ success: boolean; error: string | null }> {
  try {
    // Admin registration is not allowed through the public form
    if (role === "admin") {
      return { success: false, error: "Admin registration is not allowed" };
    }

    // Use mock data for development when Supabase is not configured
    if (mockAuthEnabled) {
      console.log("Using mock registration");
      // Create a mock user and store in localStorage for immediate login
      const mockUser = {
        id: `mock-${role}-${Date.now()}`,
        email,
        name,
        role,
      };
      localStorage.setItem("mockUser", JSON.stringify(mockUser));
      return { success: true, error: null };
    }

    // Create the user in Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    if (data.user) {
      // Create a profile for the user
      const { error: profileError } = await supabase.from("profiles").insert([
        {
          id: data.user.id,
          full_name: name,
          role: role,
          email: email,
        },
      ]);

      if (profileError) throw profileError;

      return { success: true, error: null };
    }

    return { success: false, error: "Failed to create user" };
  } catch (error: any) {
    console.error("Sign up error:", error);
    return {
      success: false,
      error: error.message || "An error occurred during sign up",
    };
  }
}

export async function signOut(): Promise<{ error: string | null }> {
  try {
    // Use mock data for development when Supabase is not configured
    if (mockAuthEnabled) {
      console.log("Using mock sign out");
      localStorage.removeItem("mockUser");
      return { error: null };
    }

    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error: any) {
    return { error: error.message || "An error occurred during sign out" };
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    // Use mock data for development when Supabase is not configured
    if (mockAuthEnabled) {
      console.log("Using mock getCurrentUser");

      // Check if we have a stored user in localStorage
      const storedUser = localStorage.getItem("mockUser");
      if (storedUser) {
        return JSON.parse(storedUser);
      }

      return null;
    }

    const { data } = await supabase.auth.getUser();

    if (!data.user) return null;

    // Fetch user profile
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .single();

    if (profileError) {
      console.error("Error fetching profile:", profileError);
      return null;
    }

    return {
      id: data.user.id,
      email: data.user.email || "",
      name: profileData.full_name || "",
      role: profileData.role as UserRole,
    };
  } catch (error) {
    console.error("Get current user error:", error);
    return null;
  }
}
