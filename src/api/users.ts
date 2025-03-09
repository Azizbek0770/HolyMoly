import prisma from "@/lib/db";
import { hash, compare } from "@/lib/bcrypt-browser";

export async function createUser({
  email,
  password,
  name,
  role = "client",
  phone,
}: {
  email: string;
  password: string;
  name: string;
  role?: string;
  phone?: string;
}) {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Hash the password
    const hashedPassword = await hash(password, 10);

    // Create the user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role,
        phone,
        membershipTier: "Bronze", // Default tier for new users
      },
    });

    // Remove password from returned user object
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

export async function authenticateUser(email: string, password: string) {
  try {
    // Find the user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      throw new Error("Invalid credentials");
    }

    // Compare passwords
    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new Error("Invalid credentials");
    }

    // Remove password from returned user object
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    console.error("Error authenticating user:", error);
    throw error;
  }
}

export async function getUserProfile(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        addresses: true,
        paymentMethods: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Remove password from returned user object
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
}

export async function updateUserProfile({
  userId,
  name,
  phone,
  email,
  bio,
  birthdate,
  avatar,
}: {
  userId: string;
  name?: string;
  phone?: string;
  email?: string;
  bio?: string;
  birthdate?: string;
  avatar?: string;
}) {
  try {
    const updateData: any = {};

    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (bio) updateData.bio = bio;
    if (birthdate) updateData.birthdate = birthdate;
    if (avatar) updateData.avatar = avatar;
    if (email) {
      // Check if email is already in use by another user
      const existingUser = await prisma.user.findFirst({
        where: {
          email,
          id: { not: userId },
        },
      });

      if (existingUser) {
        throw new Error("Email is already in use");
      }

      updateData.email = email;
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    // Remove password from returned user object
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
}

export async function changePassword({
  userId,
  currentPassword,
  newPassword,
}: {
  userId: string;
  currentPassword: string;
  newPassword: string;
}) {
  try {
    // Get the user with password
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.password) {
      throw new Error("User not found");
    }

    // Verify current password
    const passwordMatch = await compare(currentPassword, user.password);

    if (!passwordMatch) {
      throw new Error("Current password is incorrect");
    }

    // Hash the new password
    const hashedPassword = await hash(newPassword, 10);

    // Update the password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { success: true };
  } catch (error) {
    console.error("Error changing password:", error);
    throw error;
  }
}

export async function addAddress({
  userId,
  name,
  address,
  city,
  state,
  zip,
  isDefault = false,
}: {
  userId: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  isDefault?: boolean;
}) {
  try {
    // If this address is set as default, unset any existing default
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    const newAddress = await prisma.address.create({
      data: {
        userId,
        name,
        address,
        city,
        state,
        zip,
        isDefault,
      },
    });

    return newAddress;
  } catch (error) {
    console.error("Error adding address:", error);
    throw error;
  }
}

export async function addPaymentMethod({
  userId,
  type,
  last4,
  expiry,
  isDefault = false,
}: {
  userId: string;
  type: string;
  last4: string;
  expiry: string;
  isDefault?: boolean;
}) {
  try {
    // If this payment method is set as default, unset any existing default
    if (isDefault) {
      await prisma.paymentMethod.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    const newPaymentMethod = await prisma.paymentMethod.create({
      data: {
        userId,
        type,
        last4,
        expiry,
        isDefault,
      },
    });

    return newPaymentMethod;
  } catch (error) {
    console.error("Error adding payment method:", error);
    throw error;
  }
}

export async function getUserFavorites(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        favorites: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user.favorites;
  } catch (error) {
    console.error("Error fetching user favorites:", error);
    throw error;
  }
}

export async function toggleFavorite(userId: string, foodItemId: string) {
  try {
    // Check if the item is already a favorite
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        favorites: {
          where: { id: foodItemId },
        },
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // If the item is already a favorite, remove it
    if (user.favorites.length > 0) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          favorites: {
            disconnect: { id: foodItemId },
          },
        },
      });
      return { isFavorite: false };
    }

    // Otherwise, add it as a favorite
    await prisma.user.update({
      where: { id: userId },
      data: {
        favorites: {
          connect: { id: foodItemId },
        },
      },
    });
    return { isFavorite: true };
  } catch (error) {
    console.error("Error toggling favorite:", error);
    throw error;
  }
}
