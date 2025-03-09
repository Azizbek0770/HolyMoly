import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import LogoutButton from "@/components/ui/LogoutButton";
import {
  ShoppingBag,
  Heart,
  Settings,
  Star,
  MapPin,
  CreditCard,
} from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);

  const fetchOrders = async () => {
    if (!user) return;
    setIsLoadingOrders(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setOrders([
        {
          id: "ord-1234",
          createdAt: new Date().toISOString(),
          status: "delivered",
          total: 32.5,
          items: [
            {
              id: "item-1",
              foodItem: {
                name: "Margherita Pizza",
                image:
                  "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=300&q=75",
              },
              quantity: 1,
              price: 12.99,
            },
            {
              id: "item-2",
              foodItem: {
                name: "Caesar Salad",
                image:
                  "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=300&q=75",
              },
              quantity: 1,
              price: 8.99,
            },
            {
              id: "item-3",
              foodItem: {
                name: "Garlic Bread",
                image:
                  "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=300&q=75",
              },
              quantity: 1,
              price: 5.99,
            },
          ],
        },
        {
          id: "ord-1235",
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          status: "delivered",
          total: 24.98,
          items: [
            {
              id: "item-4",
              foodItem: {
                name: "Cheeseburger",
                image:
                  "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&q=75",
              },
              quantity: 2,
              price: 9.99,
            },
            {
              id: "item-5",
              foodItem: {
                name: "French Fries",
                image:
                  "https://images.unsplash.com/photo-1576107232684-1279f390859f?w=300&q=75",
              },
              quantity: 1,
              price: 4.99,
            },
          ],
        },
      ]);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast({
        title: "Error",
        description: "Failed to load order history",
        variant: "destructive",
      });
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const fetchFavorites = async () => {
    if (!user) return;
    setIsLoadingFavorites(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setFavorites([
        {
          id: "1",
          name: "Margherita Pizza",
          description:
            "Classic pizza with tomato sauce, fresh mozzarella, basil, and extra virgin olive oil.",
          price: 12.99,
          image:
            "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=300&q=75",
          category: "Pizza",
          rating: 4.7,
        },
        {
          id: "2",
          name: "Cheeseburger",
          description:
            "Juicy beef patty with cheese, lettuce, tomato, and special sauce.",
          price: 9.99,
          image:
            "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&q=75",
          category: "Burgers",
          rating: 4.5,
        },
        {
          id: "3",
          name: "California Roll",
          description:
            "Crab, avocado, and cucumber wrapped in seaweed and rice.",
          price: 14.99,
          image:
            "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=300&q=75",
          category: "Sushi",
          rating: 4.8,
        },
      ]);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      toast({
        title: "Error",
        description: "Failed to load favorites",
        variant: "destructive",
      });
    } finally {
      setIsLoadingFavorites(false);
    }
  };

  // Load data when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === "orders" && orders.length === 0) {
      fetchOrders();
    } else if (value === "favorites" && favorites.length === 0) {
      fetchFavorites();
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-lg mb-4">Please log in to view your profile.</p>
        <Button onClick={() => (window.location.href = "/login")}>
          Go to Login
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="md:w-64 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h2 className="text-xl font-bold">{user.name}</h2>
                <p className="text-muted-foreground text-sm mb-2">
                  {user.email}
                </p>
                <Badge variant="outline" className="mb-4">
                  {user.membershipTier || "Bronze"} Member
                </Badge>
                <div className="text-sm text-muted-foreground">
                  <p>Loyalty Points: {user.loyaltyPoints || 0}</p>
                </div>
              </div>

              <Separator className="my-4" />

              <nav className="space-y-2">
                <Button
                  variant={activeTab === "profile" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => handleTabChange("profile")}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Profile Settings
                </Button>
                <Button
                  variant={activeTab === "orders" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => handleTabChange("orders")}
                >
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Order History
                </Button>
                <Button
                  variant={activeTab === "favorites" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => handleTabChange("favorites")}
                >
                  <Heart className="mr-2 h-4 w-4" />
                  Favorites
                </Button>
                <Button
                  variant={activeTab === "addresses" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => handleTabChange("addresses")}
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  Addresses
                </Button>
                <Button
                  variant={activeTab === "payment" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => handleTabChange("payment")}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Payment Methods
                </Button>
              </nav>

              <Separator className="my-4" />

              <LogoutButton
                variant="destructive"
                fullWidth
                showIcon
                redirectTo="/"
              />
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <TabsContent
            value="profile"
            className={activeTab === "profile" ? "block" : "hidden"}
          >
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>
                  Update your personal information and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded-md"
                        defaultValue={user.name}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        className="w-full p-2 border rounded-md"
                        defaultValue={user.email}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        className="w-full p-2 border rounded-md"
                        defaultValue={user.phone || ""}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Bio
                    </label>
                    <textarea
                      className="w-full p-2 border rounded-md"
                      rows={4}
                      placeholder="Tell us about yourself"
                    ></textarea>
                  </div>

                  <div className="flex justify-end">
                    <Button>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent hidden" />
                      Save Changes
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent
            value="orders"
            className={activeTab === "orders" ? "block" : "hidden"}
          >
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
                <CardDescription>
                  View all your past orders and their status
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingOrders ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>
                ) : orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <Card key={order.id} className="overflow-hidden">
                        <div className="bg-muted p-4 flex justify-between items-center">
                          <div>
                            <p className="font-medium">
                              Order #{order.id.substring(0, 8)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge
                            variant={
                              order.status === "delivered"
                                ? "default"
                                : order.status === "cancelled"
                                  ? "destructive"
                                  : "outline"
                            }
                          >
                            {order.status.charAt(0).toUpperCase() +
                              order.status.slice(1)}
                          </Badge>
                        </div>
                        <CardContent className="p-4">
                          <div className="space-y-2">
                            {order.items.map((item: any) => (
                              <div
                                key={item.id}
                                className="flex justify-between items-center"
                              >
                                <div className="flex items-center gap-2">
                                  <div className="w-10 h-10 rounded overflow-hidden">
                                    <img
                                      src={item.foodItem.image}
                                      alt={item.foodItem.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div>
                                    <p className="font-medium">
                                      {item.foodItem.name}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {item.quantity} x ${item.price.toFixed(2)}
                                    </p>
                                  </div>
                                </div>
                                <p className="font-medium">
                                  ${(item.quantity * item.price).toFixed(2)}
                                </p>
                              </div>
                            ))}
                          </div>
                          <Separator className="my-4" />
                          <div className="flex justify-between items-center font-medium">
                            <span>Total</span>
                            <span>${order.total.toFixed(2)}</span>
                          </div>
                          <div className="mt-4 flex justify-end">
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No orders yet</h3>
                    <p className="text-muted-foreground mb-4">
                      You haven't placed any orders yet. Start ordering
                      delicious food!
                    </p>
                    <Button onClick={() => (window.location.href = "/client")}>
                      Browse Menu
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent
            value="favorites"
            className={activeTab === "favorites" ? "block" : "hidden"}
          >
            <Card>
              <CardHeader>
                <CardTitle>Your Favorites</CardTitle>
                <CardDescription>
                  Quick access to your favorite food items
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingFavorites ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>
                ) : favorites.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {favorites.map((item) => (
                      <Card
                        key={item.id}
                        className="overflow-hidden cursor-pointer hover:shadow-md transition-all"
                      >
                        <div className="h-40 relative">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2 bg-white/90 rounded-full px-2 py-1 text-sm font-medium flex items-center">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                            {item.rating}
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-medium mb-1">{item.name}</h3>
                          <div className="flex items-center justify-between">
                            <span className="font-bold">
                              ${item.price.toFixed(2)}
                            </span>
                            <Badge variant="outline">{item.category}</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      No favorites yet
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      You haven't added any items to your favorites yet.
                    </p>
                    <Button onClick={() => (window.location.href = "/client")}>
                      Browse Menu
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent
            value="addresses"
            className={activeTab === "addresses" ? "block" : "hidden"}
          >
            <Card>
              <CardHeader>
                <CardTitle>Delivery Addresses</CardTitle>
                <CardDescription>
                  Manage your saved delivery addresses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    Manage your addresses
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Add and manage your delivery addresses for faster checkout.
                  </p>
                  <Button>Add New Address</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent
            value="payment"
            className={activeTab === "payment" ? "block" : "hidden"}
          >
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>
                  Manage your saved payment methods
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    Manage payment methods
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Add and manage your payment methods for faster checkout.
                  </p>
                  <Button>Add Payment Method</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </div>
    </div>
  );
}
