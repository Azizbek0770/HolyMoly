import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { Spinner } from "@/components/ui/spinner";
import {
  MapPin,
  Clock,
  Phone,
  Navigation,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";

type Order = {
  id: string;
  status: string;
  createdAt: string;
  estimatedDelivery: string;
  actualDelivery?: string;
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  deliveryNotes?: string;
  user: {
    id: string;
    name: string;
    phone: string;
  };
  address: {
    address: string;
    city: string;
    state: string;
    zip: string;
  };
  items: {
    id: string;
    quantity: number;
    price: number;
    foodItem: {
      id: string;
      name: string;
      image: string;
    };
  }[];
  statusUpdates: {
    id: string;
    status: string;
    notes?: string;
    createdAt: string;
  }[];
};

// Mock data for delivery orders
const mockOrders: Order[] = [
  {
    id: "ORD-1236",
    status: "processing",
    createdAt: new Date(Date.now() - 30 * 60000).toISOString(),
    estimatedDelivery: new Date(Date.now() + 45 * 60000).toISOString(),
    subtotal: 32.75,
    tax: 3.28,
    deliveryFee: 2.99,
    total: 39.02,
    deliveryNotes: "Please leave at the door. Ring doorbell.",
    user: {
      id: "u3",
      name: "Emily Chen",
      phone: "(555) 123-4567",
    },
    address: {
      address: "123 Main St, Apt 4B",
      city: "New York",
      state: "NY",
      zip: "10001",
    },
    items: [
      {
        id: "oi1",
        quantity: 2,
        price: 14.99,
        foodItem: {
          id: "6",
          name: "California Roll",
          image:
            "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=300&q=75",
        },
      },
      {
        id: "oi2",
        quantity: 1,
        price: 2.77,
        foodItem: {
          id: "7",
          name: "Miso Soup",
          image:
            "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=300&q=75",
        },
      },
    ],
    statusUpdates: [
      {
        id: "su1",
        status: "pending",
        notes: "Order placed",
        createdAt: new Date(Date.now() - 35 * 60000).toISOString(),
      },
      {
        id: "su2",
        status: "processing",
        notes: "Restaurant is preparing your order",
        createdAt: new Date(Date.now() - 30 * 60000).toISOString(),
      },
    ],
  },
  {
    id: "ORD-1235",
    status: "in-transit",
    createdAt: new Date(Date.now() - 45 * 60000).toISOString(),
    estimatedDelivery: new Date(Date.now() + 15 * 60000).toISOString(),
    subtotal: 18.5,
    tax: 1.85,
    deliveryFee: 2.99,
    total: 23.34,
    user: {
      id: "u2",
      name: "John Smith",
      phone: "(555) 987-6543",
    },
    address: {
      address: "456 Park Ave, Suite 10",
      city: "New York",
      state: "NY",
      zip: "10022",
    },
    items: [
      {
        id: "oi3",
        quantity: 1,
        price: 9.99,
        foodItem: {
          id: "3",
          name: "Cheeseburger",
          image:
            "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&q=75",
        },
      },
      {
        id: "oi4",
        quantity: 1,
        price: 8.51,
        foodItem: {
          id: "8",
          name: "French Fries",
          image:
            "https://images.unsplash.com/photo-1576107232684-1279f390859f?w=300&q=75",
        },
      },
    ],
    statusUpdates: [
      {
        id: "su3",
        status: "pending",
        notes: "Order placed",
        createdAt: new Date(Date.now() - 50 * 60000).toISOString(),
      },
      {
        id: "su4",
        status: "processing",
        notes: "Restaurant is preparing your order",
        createdAt: new Date(Date.now() - 45 * 60000).toISOString(),
      },
      {
        id: "su5",
        status: "in-transit",
        notes: "Driver has picked up your order",
        createdAt: new Date(Date.now() - 20 * 60000).toISOString(),
      },
    ],
  },
  {
    id: "ORD-1234",
    status: "delivered",
    createdAt: new Date(Date.now() - 120 * 60000).toISOString(),
    estimatedDelivery: new Date(Date.now() - 60 * 60000).toISOString(),
    actualDelivery: new Date(Date.now() - 65 * 60000).toISOString(),
    subtotal: 24.99,
    tax: 2.5,
    deliveryFee: 2.99,
    total: 30.48,
    user: {
      id: "u1",
      name: "Sarah Johnson",
      phone: "(555) 555-5555",
    },
    address: {
      address: "789 Broadway, Apt 5C",
      city: "New York",
      state: "NY",
      zip: "10003",
    },
    items: [
      {
        id: "oi5",
        quantity: 1,
        price: 12.99,
        foodItem: {
          id: "1",
          name: "Margherita Pizza",
          image:
            "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=300&q=75",
        },
      },
      {
        id: "oi6",
        quantity: 1,
        price: 5.99,
        foodItem: {
          id: "9",
          name: "Garlic Bread",
          image:
            "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=300&q=75",
        },
      },
      {
        id: "oi7",
        quantity: 1,
        price: 6.01,
        foodItem: {
          id: "10",
          name: "Coke",
          image:
            "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=300&q=75",
        },
      },
    ],
    statusUpdates: [
      {
        id: "su6",
        status: "pending",
        notes: "Order placed",
        createdAt: new Date(Date.now() - 125 * 60000).toISOString(),
      },
      {
        id: "su7",
        status: "processing",
        notes: "Restaurant is preparing your order",
        createdAt: new Date(Date.now() - 120 * 60000).toISOString(),
      },
      {
        id: "su8",
        status: "in-transit",
        notes: "Driver has picked up your order",
        createdAt: new Date(Date.now() - 90 * 60000).toISOString(),
      },
      {
        id: "su9",
        status: "delivered",
        notes: "Order has been delivered",
        createdAt: new Date(Date.now() - 65 * 60000).toISOString(),
      },
    ],
  },
];

export default function DeliveryOrdersPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { addNotification } = useNotifications();
  const [activeTab, setActiveTab] = useState("pending");
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingOrderId, setProcessingOrderId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    fetchOrders(activeTab);
  }, [activeTab]);

  const fetchOrders = async (status: string) => {
    setIsLoading(true);
    try {
      // In a real app, you would call the API with the delivery person's ID
      // const response = await getDeliveryOrders(user?.id, status);
      // setOrders(response);

      // For now, we'll filter the mock data based on status
      await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate API delay

      let filteredOrders: Order[] = [];
      if (status === "pending") {
        filteredOrders = mockOrders.filter(
          (order) => order.status === "processing",
        );
      } else if (status === "active") {
        filteredOrders = mockOrders.filter(
          (order) => order.status === "in-transit",
        );
      } else if (status === "completed") {
        filteredOrders = mockOrders.filter((order) =>
          ["delivered", "cancelled"].includes(order.status),
        );
      } else {
        filteredOrders = mockOrders;
      }

      setOrders(filteredOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast({
        title: "Error",
        description: "Failed to load orders. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (
    orderId: string,
    newStatus: string,
    notes?: string,
  ) => {
    setProcessingOrderId(orderId);
    try {
      // In a real app, you would call the API to update the order status
      // await updateOrderStatus({ orderId, status: newStatus, notes, deliveryPersonId: user?.id });

      // For now, we'll update the local state
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay

      // Update the order status in the local state
      setOrders((prevOrders) =>
        prevOrders.map((order) => {
          if (order.id === orderId) {
            const updatedStatusUpdates = [
              ...order.statusUpdates,
              {
                id: `su${Date.now()}`,
                status: newStatus,
                notes: notes || `Order ${newStatus}`,
                createdAt: new Date().toISOString(),
              },
            ];

            // If the order is delivered, set the actual delivery time
            const updatedOrder = {
              ...order,
              status: newStatus,
              statusUpdates: updatedStatusUpdates,
            };

            if (newStatus === "delivered") {
              updatedOrder.actualDelivery = new Date().toISOString();
            }

            return updatedOrder;
          }
          return order;
        }),
      );

      // If the status is updated, show a notification
      addNotification({
        type: "system",
        title: `Order ${newStatus}`,
        message: `Order ${orderId} has been ${newStatus}`,
      });

      toast({
        title: "Status updated",
        description: `Order status has been updated to ${newStatus}`,
      });

      // Refresh the orders list after a status change
      fetchOrders(activeTab);
    } catch (error) {
      console.error("Error updating order status:", error);
      toast({
        title: "Error",
        description: "Failed to update order status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessingOrderId(null);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "outline";
      case "processing":
        return "secondary";
      case "in-transit":
        return "default";
      case "delivered":
        return "success";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const formatAddress = (address: Order["address"]) => {
    return `${address.address}, ${address.city}, ${address.state} ${address.zip}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Delivery Orders</h1>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
          >
            Online
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pending">Pending Pickup</TabsTrigger>
          <TabsTrigger value="active">Active Deliveries</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="all">All Orders</TabsTrigger>
        </TabsList>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner size="lg" />
          </div>
        ) : (
          <TabsContent value={activeTab} className="mt-6 space-y-6">
            {orders.length === 0 ? (
              <div className="text-center py-12 bg-muted/20 rounded-lg">
                <p className="text-muted-foreground">No orders found</p>
              </div>
            ) : (
              orders.map((order) => (
                <Card key={order.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          Order #{order.id}
                          <Badge variant={getStatusBadgeVariant(order.status)}>
                            {order.status.charAt(0).toUpperCase() +
                              order.status.slice(1)}
                          </Badge>
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Placed: {formatDateTime(order.createdAt)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          ${order.total.toFixed(2)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {order.items.reduce(
                            (sum, item) => sum + item.quantity,
                            0,
                          )}{" "}
                          items
                        </p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pb-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-semibold mb-2 flex items-center gap-2">
                          <MapPin className="h-4 w-4" /> Delivery Address
                        </h3>
                        <p className="text-sm">
                          {formatAddress(order.address)}
                        </p>

                        <div className="mt-4">
                          <h3 className="font-semibold mb-2 flex items-center gap-2">
                            <Phone className="h-4 w-4" /> Customer
                          </h3>
                          <p className="text-sm">
                            {order.user.name} - {order.user.phone}
                          </p>
                        </div>

                        {order.deliveryNotes && (
                          <div className="mt-4 p-2 bg-muted/30 rounded-md">
                            <p className="text-sm font-medium">
                              Delivery Notes:
                            </p>
                            <p className="text-sm">{order.deliveryNotes}</p>
                          </div>
                        )}
                      </div>

                      <div>
                        <h3 className="font-semibold mb-2">Order Items</h3>
                        <ul className="space-y-2">
                          {order.items.map((item) => (
                            <li
                              key={item.id}
                              className="flex items-center gap-2"
                            >
                              <div className="h-10 w-10 rounded-md overflow-hidden flex-shrink-0">
                                <img
                                  src={item.foodItem.image}
                                  alt={item.foodItem.name}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium">
                                  {item.foodItem.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Qty: {item.quantity}
                                </p>
                              </div>
                              <p className="text-sm font-medium">
                                ${(item.price * item.quantity).toFixed(2)}
                              </p>
                            </li>
                          ))}
                        </ul>

                        <div className="mt-4">
                          <h3 className="font-semibold mb-2 flex items-center gap-2">
                            <Clock className="h-4 w-4" /> Delivery Time
                          </h3>
                          <p className="text-sm">
                            {order.status === "delivered"
                              ? `Delivered: ${formatDateTime(order.actualDelivery!)}`
                              : `Estimated: ${formatDateTime(order.estimatedDelivery)}`}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="pt-4 flex flex-wrap gap-2">
                    {order.status === "processing" && (
                      <Button
                        onClick={() =>
                          handleUpdateStatus(
                            order.id,
                            "in-transit",
                            "Driver has picked up the order",
                          )
                        }
                        disabled={processingOrderId === order.id}
                        className="flex-1"
                      >
                        {processingOrderId === order.id ? (
                          <>
                            <Spinner size="sm" className="mr-2" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Accept & Pickup
                          </>
                        )}
                      </Button>
                    )}

                    {order.status === "in-transit" && (
                      <>
                        <Button
                          variant="default"
                          onClick={() =>
                            handleUpdateStatus(
                              order.id,
                              "delivered",
                              "Order has been delivered",
                            )
                          }
                          disabled={processingOrderId === order.id}
                          className="flex-1"
                        >
                          {processingOrderId === order.id ? (
                            <>
                              <Spinner size="sm" className="mr-2" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Mark as Delivered
                            </>
                          )}
                        </Button>
                        <Button variant="outline">
                          <Navigation className="h-4 w-4 mr-2" />
                          Navigate
                        </Button>
                        <Button variant="outline">
                          <Phone className="h-4 w-4 mr-2" />
                          Call Customer
                        </Button>
                      </>
                    )}

                    {order.status === "processing" && (
                      <Button
                        variant="outline"
                        onClick={() =>
                          handleUpdateStatus(
                            order.id,
                            "cancelled",
                            "Driver rejected the order",
                          )
                        }
                        disabled={processingOrderId === order.id}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    )}

                    {(order.status === "delivered" ||
                      order.status === "cancelled") && (
                      <Button variant="outline" className="flex-1">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Report Issue
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))
            )}
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
