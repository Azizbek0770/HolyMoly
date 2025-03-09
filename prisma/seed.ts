import { PrismaClient } from "@prisma/client";
// Note: This file runs in Node.js environment where bcrypt works
// For browser compatibility, we use a different approach in the app itself
import { hash } from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await hash("admin", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      name: "Admin User",
      role: "admin",
      phone: "(555) 123-4567",
    },
  });

  // Create client user
  const clientPassword = await hash("client", 10);
  const client = await prisma.user.upsert({
    where: { email: "client@example.com" },
    update: {},
    create: {
      email: "client@example.com",
      name: "Client User",
      role: "client",
      phone: "(555) 987-6543",
      loyaltyPoints: 450,
      membershipTier: "Silver",
    },
  });

  // Create delivery user
  const deliveryPassword = await hash("delivery", 10);
  const delivery = await prisma.user.upsert({
    where: { email: "delivery@example.com" },
    update: {},
    create: {
      email: "delivery@example.com",
      name: "Delivery User",
      role: "delivery",
      phone: "(555) 456-7890",
    },
  });

  // Create addresses for client
  await prisma.address.createMany({
    data: [
      {
        userId: client.id,
        name: "Home",
        address: "123 Main St, Apt 4B",
        city: "New York",
        state: "NY",
        zip: "10001",
        isDefault: true,
      },
      {
        userId: client.id,
        name: "Work",
        address: "456 Office Blvd, Suite 100",
        city: "New York",
        state: "NY",
        zip: "10002",
        isDefault: false,
      },
    ],
  });

  // Create payment methods for client
  await prisma.paymentMethod.createMany({
    data: [
      {
        userId: client.id,
        type: "Visa",
        last4: "4242",
        expiry: "12/25",
        isDefault: true,
      },
      {
        userId: client.id,
        type: "Mastercard",
        last4: "5555",
        expiry: "10/24",
        isDefault: false,
      },
    ],
  });

  // Create food items
  const foodItems = await prisma.foodItem.createMany({
    data: [
      {
        name: "Margherita Pizza",
        description: "Classic pizza with tomato sauce, mozzarella, and basil",
        price: 12.99,
        category: "Pizza",
        image:
          "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=600&q=75",
        rating: 4.5,
        preparationTime: 20,
      },
      {
        name: "Pepperoni Pizza",
        description:
          "Classic pizza with tomato sauce, mozzarella, and pepperoni",
        price: 14.99,
        category: "Pizza",
        image:
          "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&q=75",
        rating: 4.7,
        preparationTime: 20,
      },
      {
        name: "Cheeseburger",
        description:
          "Juicy beef patty with cheese, lettuce, tomato, and special sauce",
        price: 9.99,
        category: "Burgers",
        image:
          "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=75",
        rating: 4.3,
        preparationTime: 15,
      },
      {
        name: "Bacon Burger",
        description:
          "Juicy beef patty with bacon, cheese, lettuce, and special sauce",
        price: 11.99,
        category: "Burgers",
        image:
          "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=600&q=75",
        rating: 4.6,
        preparationTime: 15,
      },
      {
        name: "California Roll",
        description: "Crab, avocado, and cucumber wrapped in seaweed and rice",
        price: 14.99,
        category: "Sushi",
        image:
          "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&q=75",
        rating: 4.7,
        preparationTime: 25,
      },
      {
        name: "Dragon Roll",
        description: "Eel, crab, and cucumber topped with avocado",
        price: 16.99,
        category: "Sushi",
        image:
          "https://images.unsplash.com/photo-1617196034183-421b4917c92d?w=600&q=75",
        rating: 4.8,
        preparationTime: 25,
      },
      {
        name: "Caesar Salad",
        description:
          "Romaine lettuce, croutons, parmesan cheese with Caesar dressing",
        price: 8.99,
        category: "Salads",
        image:
          "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=600&q=75",
        rating: 4.2,
        preparationTime: 10,
      },
      {
        name: "Greek Salad",
        description:
          "Tomatoes, cucumbers, olives, feta cheese with olive oil dressing",
        price: 9.99,
        category: "Salads",
        image:
          "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&q=75",
        rating: 4.4,
        preparationTime: 10,
      },
    ],
  });

  console.log("Database seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
