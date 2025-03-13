import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNotifications } from "@/contexts/NotificationContext";
import { Clock, ArrowRight, Star } from "lucide-react";

type Order = {
  id: string;
  date: string;
  restaurant: string;
  items: string[];
  total: number;
  status: "delivered" | "in-progress" | "cancelled";
  deliveryTime?: string;
};

const mockOrders: Order[] = [
  {
    id: "ORD-1234",
    date: "2023-06-15 19:30",
    restaurant: "Pizza Palace",
    items: ["Margherita Pizza", "Garlic Bread", "Coke"],
    total: 24.99,
    status: "delivered",
    deliveryTime: "20 min",
  },
  {
    id: "ORD-1235",
    date: "2023-06-14 13:15",
    restaurant: "Burger Joint",
    items: ["Cheeseburger", "Fries", "Milkshake"],
    total: 18.5,
    status: "delivered",
    deliveryTime: "25 min",
  },
  {
    id: "ORD-1236",
    date: "2023-06-16 18:45",
    restaurant: "Sushi Express",
    items: ["California Roll", "Miso Soup", "Green Tea"],
    total: 32.75,
    status: "in-progress",
  },
];

export default function OrderHistoryPage() {
  const { addNotification } = useNotifications();

  // Simulate receiving a delivery update notification
  useEffect(() => {
    // This would normally be triggered by a real-time event or API call
    const timer = setTimeout(() => {
      addNotification({
        type: "delivery",
        title: "Order Update: ORD-1236",
        message:
          "Your order has been picked up by the delivery person and is on the way!",
        actionUrl: "/client/orders",
      });
    }, 5000);

    return () => clearTimeout(timer);
  }, [addNotification]);

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "delivered":
        return "bg-green-500";
      case "in-progress":
        return "bg-blue-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <h1 className="text-2xl font-bold">Your Orders</h1>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="past">Past Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {mockOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          {mockOrders
            .filter((order) => order.status === "in-progress")
            .map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {mockOrders
            .filter(
              (order) =>
                order.status === "delivered" || order.status === "cancelled",
            )
            .map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function OrderCard({ order }: { order: Order }) {
  const { addNotification } = useNotifications();

  const handleViewDetails = () => {
    // In a real app, this would navigate to the order details page
    // For now, we'll just show a notification
    addNotification({
      type: "order",
      title: `Order Details: ${order.id}`,
      message: `Viewing details for your ${order.status} order from ${order.restaurant}.`,
    });
  };

  const handleRateOrder = () => {
    // In a real app, this would open a rating dialog
    // For now, we'll just show a notification
    addNotification({
      type: "system",
      title: "Rate Your Order",
      message:
        "Thank you for rating your order! Your feedback helps us improve.",
    });
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{order.restaurant}</CardTitle>
            <p className="text-sm text-muted-foreground">{order.date}</p>
          </div>
          <Badge
            variant="outline"
            className={`${getStatusColor(order.status)} text-white border-0`}
          >
            {order.status === "delivered"
              ? "Delivered"
              : order.status === "in-progress"
                ? "In Progress"
                : order.status === "cancelled"
                  ? "Cancelled"
                  : "Unknown"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-1">
          <p className="text-sm font-medium">Order #{order.id}</p>
          <p className="text-sm text-muted-foreground">
            {order.items.join(", ")}
          </p>
          {order.status === "in-progress" && (
            <div className="flex items-center gap-1 text-sm text-blue-500 mt-2">
              <Clock className="h-4 w-4" />
              <span>Estimated delivery in 15-20 min</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <p className="font-semibold">${order.total.toFixed(2)}</p>
        <div className="flex gap-2">
          {order.status === "delivered" && (
            <Button variant="outline" size="sm" onClick={handleRateOrder}>
              <Star className="h-4 w-4 mr-1" />
              Rate
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={handleViewDetails}>
            Details
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

function getStatusColor(status: Order["status"]) {
  switch (status) {
    case "delivered":
      return "bg-green-500";
    case "in-progress":
      return "bg-blue-500";
    case "cancelled":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
}
