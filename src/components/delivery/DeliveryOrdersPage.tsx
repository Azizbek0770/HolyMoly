import { useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Phone,
  Clock,
  Navigation,
  CheckCircle,
  XCircle,
  Info,
} from "lucide-react";

type Order = {
  id: string;
  customer: {
    name: string;
    address: string;
    phone: string;
  };
  restaurant: {
    name: string;
    address: string;
  };
  items: {
    name: string;
    quantity: number;
  }[];
  total: number;
  status: "pending" | "accepted" | "picked" | "delivered" | "cancelled";
  estimatedTime?: number;
  distance?: number;
};

const mockOrders: Order[] = [
  {
    id: "ORD-1234",
    customer: {
      name: "John Doe",
      address: "123 Main St, Apt 4B, New York, NY 10001",
      phone: "(555) 123-4567",
    },
    restaurant: {
      name: "Pizza Palace",
      address: "456 Broadway, New York, NY 10002",
    },
    items: [
      { name: "Margherita Pizza", quantity: 1 },
      { name: "Garlic Bread", quantity: 1 },
      { name: "Coke", quantity: 2 },
    ],
    total: 24.99,
    status: "pending",
    estimatedTime: 30,
    distance: 2.5,
  },
  {
    id: "ORD-1235",
    customer: {
      name: "Jane Smith",
      address: "789 Park Ave, New York, NY 10003",
      phone: "(555) 987-6543",
    },
    restaurant: {
      name: "Burger Joint",
      address: "321 5th Ave, New York, NY 10004",
    },
    items: [
      { name: "Cheeseburger", quantity: 2 },
      { name: "Fries", quantity: 1 },
      { name: "Milkshake", quantity: 1 },
    ],
    total: 18.5,
    status: "accepted",
    estimatedTime: 25,
    distance: 1.8,
  },
  {
    id: "ORD-1236",
    customer: {
      name: "Bob Johnson",
      address: "555 Water St, New York, NY 10005",
      phone: "(555) 456-7890",
    },
    restaurant: {
      name: "Sushi Express",
      address: "888 Madison Ave, New York, NY 10006",
    },
    items: [
      { name: "California Roll", quantity: 2 },
      { name: "Miso Soup", quantity: 1 },
      { name: "Green Tea", quantity: 1 },
    ],
    total: 32.75,
    status: "picked",
    estimatedTime: 15,
    distance: 3.2,
  },
];

export default function DeliveryOrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const pendingOrders = mockOrders.filter(
    (order) => order.status === "pending",
  );
  const activeOrders = mockOrders.filter((order) =>
    ["accepted", "picked"].includes(order.status),
  );
  const completedOrders = mockOrders.filter((order) =>
    ["delivered", "cancelled"].includes(order.status),
  );

  const viewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Orders</h1>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="pending">
            Pending
            {pendingOrders.length > 0 && (
              <Badge className="ml-2">{pendingOrders.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="active">
            Active
            {activeOrders.length > 0 && (
              <Badge className="ml-2">{activeOrders.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingOrders.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold">No pending orders</h2>
              <p className="text-muted-foreground mt-2">
                New orders will appear here
              </p>
            </div>
          ) : (
            pendingOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onViewDetails={() => viewOrderDetails(order)}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          {activeOrders.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold">No active orders</h2>
              <p className="text-muted-foreground mt-2">
                Accept orders to see them here
              </p>
            </div>
          ) : (
            activeOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onViewDetails={() => viewOrderDetails(order)}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedOrders.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold">No completed orders</h2>
              <p className="text-muted-foreground mt-2">
                Completed orders will appear here
              </p>
            </div>
          ) : (
            completedOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onViewDetails={() => viewOrderDetails(order)}
              />
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Order Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle>Order #{selectedOrder.id}</DialogTitle>
                <DialogDescription>
                  {getStatusText(selectedOrder.status)}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <h3 className="font-semibold">Restaurant</h3>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p>{selectedOrder.restaurant.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedOrder.restaurant.address}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold">Customer</h3>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p>{selectedOrder.customer.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedOrder.customer.address}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <p>{selectedOrder.customer.phone}</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h3 className="font-semibold">Order Items</h3>
                  <ul className="space-y-1">
                    {selectedOrder.items.map((item, index) => (
                      <li key={index} className="flex justify-between">
                        <span>{item.name}</span>
                        <span>x{item.quantity}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex justify-between font-medium pt-2">
                    <span>Total</span>
                    <span>${selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>Est. {selectedOrder.estimatedTime} min</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedOrder.distance} miles</span>
                  </div>
                </div>
              </div>
              <DialogFooter className="flex-col sm:flex-row gap-2">
                {selectedOrder.status === "pending" && (
                  <>
                    <Button
                      variant="outline"
                      className="w-full sm:w-auto"
                      onClick={() => setIsDetailsOpen(false)}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Decline
                    </Button>
                    <Button
                      className="w-full sm:w-auto"
                      onClick={() => setIsDetailsOpen(false)}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Accept Order
                    </Button>
                  </>
                )}
                {selectedOrder.status === "accepted" && (
                  <Button
                    className="w-full"
                    onClick={() => setIsDetailsOpen(false)}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark as Picked Up
                  </Button>
                )}
                {selectedOrder.status === "picked" && (
                  <Button
                    className="w-full"
                    onClick={() => setIsDetailsOpen(false)}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark as Delivered
                  </Button>
                )}
                {(selectedOrder.status === "delivered" ||
                  selectedOrder.status === "cancelled") && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setIsDetailsOpen(false)}
                  >
                    Close
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function OrderCard({
  order,
  onViewDetails,
}: {
  order: Order;
  onViewDetails: () => void;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{order.restaurant.name}</CardTitle>
            <p className="text-sm text-muted-foreground">Order #{order.id}</p>
          </div>
          <Badge
            variant="outline"
            className={`
              ${order.status === "pending" ? "bg-yellow-500" : ""}
              ${order.status === "accepted" ? "bg-blue-500" : ""}
              ${order.status === "picked" ? "bg-purple-500" : ""}
              ${order.status === "delivered" ? "bg-green-500" : ""}
              ${order.status === "cancelled" ? "bg-red-500" : ""}
              text-white border-0
            `}
          >
            {getStatusText(order.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm">{order.customer.name}</p>
              <p className="text-sm text-muted-foreground line-clamp-1">
                {order.customer.address}
              </p>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{order.estimatedTime} min</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{order.distance} miles</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <p className="font-semibold">${order.total.toFixed(2)}</p>
        <div className="flex gap-2">
          {order.status === "pending" && (
            <>
              <Button variant="outline" size="sm">
                <XCircle className="h-4 w-4 mr-1" />
                Decline
              </Button>
              <Button size="sm">
                <CheckCircle className="h-4 w-4 mr-1" />
                Accept
              </Button>
            </>
          )}
          {order.status === "accepted" && (
            <>
              <Button variant="outline" size="sm" onClick={onViewDetails}>
                <Info className="h-4 w-4 mr-1" />
                Details
              </Button>
              <Button size="sm">
                <Navigation className="h-4 w-4 mr-1" />
                Navigate
              </Button>
            </>
          )}
          {order.status === "picked" && (
            <>
              <Button variant="outline" size="sm" onClick={onViewDetails}>
                <Info className="h-4 w-4 mr-1" />
                Details
              </Button>
              <Button size="sm">
                <CheckCircle className="h-4 w-4 mr-1" />
                Deliver
              </Button>
            </>
          )}
          {(order.status === "delivered" || order.status === "cancelled") && (
            <Button variant="outline" size="sm" onClick={onViewDetails}>
              <Info className="h-4 w-4 mr-1" />
              Details
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}

function getStatusText(status: Order["status"]) {
  switch (status) {
    case "pending":
      return "Pending Acceptance";
    case "accepted":
      return "Accepted - Pickup";
    case "picked":
      return "Picked Up - Delivering";
    case "delivered":
      return "Delivered";
    case "cancelled":
      return "Cancelled";
    default:
      return "Unknown";
  }
}
