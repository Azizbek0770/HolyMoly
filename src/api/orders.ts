import prisma from "@/lib/db";
import { CartItem } from "@/contexts/CartContext";

export async function createOrder({
  userId,
  items,
  addressId,
  paymentMethodId,
  deliveryNotes,
  subtotal,
  tax,
  deliveryFee,
  total,
}: {
  userId: string;
  items: CartItem[];
  addressId: string;
  paymentMethodId: string;
  deliveryNotes?: string;
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
}) {
  try {
    // Create the order with a transaction to ensure all operations succeed or fail together
    const order = await prisma.$transaction(async (tx) => {
      // Create the order
      const newOrder = await tx.order.create({
        data: {
          userId,
          status: "pending",
          subtotal,
          tax,
          deliveryFee,
          total,
          addressId,
          paymentMethodId,
          deliveryNotes,
          estimatedDelivery: new Date(Date.now() + 45 * 60 * 1000), // 45 minutes from now
          items: {
            create: items.map((item) => ({
              foodItemId: item.id,
              quantity: item.quantity,
              price: item.price,
            })),
          },
          statusUpdates: {
            create: {
              status: "pending",
              notes: "Order placed",
            },
          },
        },
        include: {
          items: {
            include: {
              foodItem: true,
            },
          },
          address: true,
          paymentMethod: true,
        },
      });

      // Update user loyalty points (10 points per $1 spent)
      await tx.user.update({
        where: { id: userId },
        data: {
          loyaltyPoints: {
            increment: Math.floor(total * 10),
          },
        },
      });

      return newOrder;
    });

    return order;
  } catch (error) {
    console.error("Error creating order:", error);
    throw new Error("Failed to create order");
  }
}

export async function getUserOrders(userId: string, status?: string) {
  try {
    const where: any = { userId };

    if (status) {
      if (status === "active") {
        where.status = { in: ["pending", "processing", "in-transit"] };
      } else if (status === "completed") {
        where.status = { in: ["delivered", "cancelled"] };
      } else {
        where.status = status;
      }
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            foodItem: true,
          },
        },
        address: true,
        paymentMethod: true,
        statusUpdates: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return orders;
  } catch (error) {
    console.error("Error fetching user orders:", error);
    throw new Error("Failed to fetch user orders");
  }
}

export async function getOrderById(id: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            foodItem: true,
          },
        },
        address: true,
        paymentMethod: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        deliveryPerson: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
        statusUpdates: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    return order;
  } catch (error) {
    console.error("Error fetching order:", error);
    throw new Error("Failed to fetch order");
  }
}

export async function updateOrderStatus({
  orderId,
  status,
  notes,
  deliveryPersonId,
}: {
  orderId: string;
  status: string;
  notes?: string;
  deliveryPersonId?: string;
}) {
  try {
    const updateData: any = { status };

    // If delivery person is assigned
    if (deliveryPersonId) {
      updateData.deliveryPersonId = deliveryPersonId;
    }

    // If order is delivered, set actual delivery time
    if (status === "delivered") {
      updateData.actualDelivery = new Date();
    }

    const order = await prisma.$transaction(async (tx) => {
      // Update the order status
      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: updateData,
        include: {
          items: true,
          user: true,
        },
      });

      // Create a status update record
      await tx.orderStatus.create({
        data: {
          orderId,
          status,
          notes,
        },
      });

      return updatedOrder;
    });

    return order;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw new Error("Failed to update order status");
  }
}

export async function getDeliveryOrders(
  deliveryPersonId: string,
  status?: string,
) {
  try {
    const where: any = {};

    if (deliveryPersonId) {
      where.deliveryPersonId = deliveryPersonId;
    } else {
      // For orders not yet assigned to a delivery person
      where.deliveryPersonId = null;
      where.status = "processing"; // Only show processing orders for assignment
    }

    if (status) {
      if (status === "pending") {
        where.status = "processing"; // Pending for delivery = processing in system
        where.deliveryPersonId = null;
      } else if (status === "active") {
        where.status = { in: ["in-transit"] };
        if (deliveryPersonId) {
          where.deliveryPersonId = deliveryPersonId;
        }
      } else if (status === "completed") {
        where.status = { in: ["delivered", "cancelled"] };
        if (deliveryPersonId) {
          where.deliveryPersonId = deliveryPersonId;
        }
      } else {
        where.status = status;
      }
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            foodItem: true,
          },
        },
        address: true,
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
        statusUpdates: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return orders;
  } catch (error) {
    console.error("Error fetching delivery orders:", error);
    throw new Error("Failed to fetch delivery orders");
  }
}
