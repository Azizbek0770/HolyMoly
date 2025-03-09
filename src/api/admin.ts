import prisma from "@/lib/db";

export async function getDashboardStats() {
  try {
    // Get total revenue
    const revenueResult = await prisma.order.aggregate({
      _sum: {
        total: true,
      },
      where: {
        status: { in: ["delivered"] },
      },
    });

    // Get total users count
    const userCount = await prisma.user.count({
      where: {
        role: "client",
      },
    });

    // Get total orders count
    const orderCount = await prisma.order.count();

    // Get average delivery time (in minutes)
    const deliveredOrders = await prisma.order.findMany({
      where: {
        status: "delivered",
        actualDelivery: { not: null },
      },
      select: {
        createdAt: true,
        actualDelivery: true,
      },
    });

    let avgDeliveryTime = 0;
    if (deliveredOrders.length > 0) {
      const totalMinutes = deliveredOrders.reduce((sum, order) => {
        if (order.actualDelivery) {
          const diffMs =
            order.actualDelivery.getTime() - order.createdAt.getTime();
          const diffMinutes = Math.floor(diffMs / 60000);
          return sum + diffMinutes;
        }
        return sum;
      }, 0);
      avgDeliveryTime = Math.round(totalMinutes / deliveredOrders.length);
    }

    // Get recent orders
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
        items: {
          include: {
            foodItem: true,
          },
        },
      },
    });

    // Get monthly sales data for chart
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlySales = await prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('month', created_at) as month,
        SUM(total) as revenue,
        COUNT(*) as orders
      FROM orders
      WHERE created_at >= ${sixMonthsAgo}
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY month ASC
    `;

    return {
      totalRevenue: revenueResult._sum.total || 0,
      activeUsers: userCount,
      totalOrders: orderCount,
      avgDeliveryTime,
      recentOrders,
      monthlySales,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw new Error("Failed to fetch dashboard statistics");
  }
}

export async function getAllFoodItems({
  search,
  category,
  page = 1,
  limit = 10,
}: {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
}) {
  try {
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (category && category !== "All") {
      where.category = category;
    }

    const skip = (page - 1) * limit;

    const [foodItems, totalCount] = await Promise.all([
      prisma.foodItem.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.foodItem.count({ where }),
    ]);

    return {
      items: foodItems,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  } catch (error) {
    console.error("Error fetching all food items:", error);
    throw new Error("Failed to fetch food items");
  }
}

export async function createFoodItem({
  name,
  description,
  price,
  category,
  image,
  preparationTime = 15,
}: {
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  preparationTime?: number;
}) {
  try {
    const foodItem = await prisma.foodItem.create({
      data: {
        name,
        description,
        price,
        category,
        image,
        preparationTime,
        available: true,
      },
    });

    return foodItem;
  } catch (error) {
    console.error("Error creating food item:", error);
    throw new Error("Failed to create food item");
  }
}

export async function updateFoodItem({
  id,
  name,
  description,
  price,
  category,
  image,
  available,
  preparationTime,
}: {
  id: string;
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  image?: string;
  available?: boolean;
  preparationTime?: number;
}) {
  try {
    const updateData: any = {};

    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = price;
    if (category !== undefined) updateData.category = category;
    if (image !== undefined) updateData.image = image;
    if (available !== undefined) updateData.available = available;
    if (preparationTime !== undefined)
      updateData.preparationTime = preparationTime;

    const foodItem = await prisma.foodItem.update({
      where: { id },
      data: updateData,
    });

    return foodItem;
  } catch (error) {
    console.error("Error updating food item:", error);
    throw new Error("Failed to update food item");
  }
}

export async function deleteFoodItem(id: string) {
  try {
    await prisma.foodItem.delete({
      where: { id },
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting food item:", error);
    throw new Error("Failed to delete food item");
  }
}

export async function getAllUsers({
  role,
  search,
  page = 1,
  limit = 10,
}: {
  role?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  try {
    const where: any = {};

    if (role) {
      where.role = role;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    const skip = (page - 1) * limit;

    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          phone: true,
          createdAt: true,
          loyaltyPoints: true,
          membershipTier: true,
          _count: {
            select: {
              orders: true,
            },
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    return {
      users,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw new Error("Failed to fetch users");
  }
}

export async function getAllOrders({
  status,
  search,
  page = 1,
  limit = 10,
}: {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  try {
    const where: any = {};

    if (status && status !== "all") {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { id: { contains: search } },
        { user: { name: { contains: search, mode: "insensitive" } } },
        { user: { email: { contains: search, mode: "insensitive" } } },
      ];
    }

    const skip = (page - 1) * limit;

    const [orders, totalCount] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          items: {
            include: {
              foodItem: true,
            },
          },
          deliveryPerson: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      prisma.order.count({ where }),
    ]);

    return {
      orders,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  } catch (error) {
    console.error("Error fetching all orders:", error);
    throw new Error("Failed to fetch orders");
  }
}
