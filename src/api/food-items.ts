import prisma from "@/lib/db";

export async function getFoodItems({
  category,
  search,
  minPrice,
  maxPrice,
  sortBy,
  page = 1,
  limit = 20,
}: {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  page?: number;
  limit?: number;
}) {
  try {
    // Build the where clause based on filters
    const where: any = { available: true };

    if (category && category !== "All" && category !== "Popular") {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { category: { contains: search, mode: "insensitive" } },
      ];
    }

    if (minPrice !== undefined) {
      where.price = { ...where.price, gte: minPrice };
    }

    if (maxPrice !== undefined) {
      where.price = { ...where.price, lte: maxPrice };
    }

    // Handle "Popular" category filter
    if (category === "Popular") {
      where.rating = { gte: 4.5 };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Determine sort order
    let orderBy: any = { rating: "desc" }; // default sort

    if (sortBy === "price-low") {
      orderBy = { price: "asc" };
    } else if (sortBy === "price-high") {
      orderBy = { price: "desc" };
    } else if (sortBy === "rating") {
      orderBy = { rating: "desc" };
    } else if (sortBy === "time") {
      orderBy = { preparationTime: "asc" };
    }

    // Get total count for pagination
    const totalCount = await prisma.foodItem.count({ where });

    // Get food items with pagination and sorting
    const foodItems = await prisma.foodItem.findMany({
      where,
      orderBy,
      skip,
      take: limit,
    });

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
    console.error("Error fetching food items:", error);
    throw new Error("Failed to fetch food items");
  }
}

export async function getFoodItemById(id: string) {
  try {
    const foodItem = await prisma.foodItem.findUnique({
      where: { id },
      include: {
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 5,
        },
      },
    });

    return foodItem;
  } catch (error) {
    console.error("Error fetching food item:", error);
    throw new Error("Failed to fetch food item");
  }
}

export async function getCategories() {
  try {
    const categories = await prisma.foodItem.groupBy({
      by: ["category"],
      _count: {
        category: true,
      },
    });

    return categories.map((cat) => ({
      name: cat.category,
      count: cat._count.category,
    }));
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error("Failed to fetch categories");
  }
}

export async function searchFoodItems(query: string) {
  try {
    const results = await prisma.foodItem.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          { category: { contains: query, mode: "insensitive" } },
        ],
        available: true,
      },
      take: 10,
    });

    // Also get matching categories
    const categories = await prisma.foodItem.groupBy({
      by: ["category"],
      where: {
        category: { contains: query, mode: "insensitive" },
      },
    });

    return {
      foodItems: results,
      categories: categories.map((c) => c.category),
    };
  } catch (error) {
    console.error("Error searching food items:", error);
    throw new Error("Failed to search food items");
  }
}
