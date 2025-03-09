import { useState, useEffect } from "react";
import { Outlet, useLocation, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SearchBar from "./SearchBar";
import LogoutButton from "@/components/ui/LogoutButton";
import UserAvatar from "@/components/ui/UserAvatar";
import {
  ShoppingCart,
  User,
  Search,
  Home,
  Clock,
  Settings,
  Menu,
  Heart,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";

export default function ClientLayout() {
  const { totalItems: cartCount } = useCart();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Set active tab based on current path
    const path = location.pathname.split("/")[2] || "";
    setActiveTab(path || "home");
  }, [location]);

  const navItems = [
    { name: "Home", path: "/client", icon: <Home className="h-5 w-5" /> },
    {
      name: "Orders",
      path: "/client/orders",
      icon: <Clock className="h-5 w-5" />,
    },
    {
      name: "Favorites",
      path: "/client/favorites",
      icon: <Heart className="h-5 w-5" />,
    },
    {
      name: "Profile",
      path: "/client/profile",
      icon: <User className="h-5 w-5" />,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-2">
            {/* Mobile Menu Trigger */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <div className="p-6 border-b">
                  <h1 className="text-xl font-bold">FoodDelivery</h1>
                </div>
                <div className="p-4 border-b">
                  <UserAvatar showName={true} />
                </div>
                <nav className="flex-1 p-4 space-y-2">
                  {navItems.map((item) => (
                    <Button
                      key={item.name}
                      variant={
                        activeTab === item.name.toLowerCase()
                          ? "default"
                          : "ghost"
                      }
                      className="w-full justify-start mb-1"
                      onClick={() => navigate(item.path)}
                    >
                      {item.icon}
                      <span className="ml-3">{item.name}</span>
                    </Button>
                  ))}
                </nav>
                <div className="p-4 border-t mt-auto">
                  <LogoutButton />
                </div>
              </SheetContent>
            </Sheet>
            <h1 className="text-xl font-bold">FoodDelivery</h1>
          </div>

          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <SearchBar className="w-full" />
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              className="relative"
              onClick={() => navigate("/client/cart")}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0">
                  {cartCount}
                </Badge>
              )}
            </Button>
            <div className="hidden md:block">
              <UserAvatar />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container py-4 px-4">
        <Outlet />
      </main>

      {/* Mobile Search Bar */}
      <div className="md:hidden px-4 py-2 border-t bg-background">
        <SearchBar className="w-full" />
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background z-10">
        <div className="grid grid-cols-4 h-16">
          {navItems.map((item, index) => (
            <Button
              key={index}
              variant={
                activeTab === item.name.toLowerCase() ? "default" : "ghost"
              }
              className="flex flex-col items-center justify-center rounded-none h-full"
              onClick={() => navigate(item.path)}
            >
              {item.icon}
              <span className="text-xs mt-1">{item.name}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
