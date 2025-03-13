import { useState } from "react";
import { motion } from "framer-motion";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { NotificationCenter } from "@/components/ui/notification-center";
import UserAvatar from "@/components/ui/UserAvatar";
import LogoutButton from "@/components/ui/LogoutButton";
import { NotificationBadge } from "@/components/ui/notification-badge";
import SearchBar from "./SearchBar";
import {
  Home,
  Menu,
  ShoppingCart,
  Clock,
  User,
  Heart,
  LogOut,
  Search,
} from "lucide-react";

export default function ClientLayout() {
  const location = useLocation();
  const { user } = useAuth();
  const { totalItems } = useCart();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navItems = [
    { path: "/client", label: "Home", icon: <Home className="h-5 w-5" /> },
    {
      path: "/client/cart",
      label: "Cart",
      icon: <ShoppingCart className="h-5 w-5" />,
      badge: totalItems > 0 ? totalItems : undefined,
    },
    {
      path: "/client/orders",
      label: "Orders",
      icon: <Clock className="h-5 w-5" />,
    },
    {
      path: "/client/favorites",
      label: "Favorites",
      icon: <Heart className="h-5 w-5" />,
    },
    {
      path: "/client/profile",
      label: "Profile",
      icon: <User className="h-5 w-5" />,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-2">
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
                  <div className="flex items-center">
                    <UserAvatar showName showEmail />
                  </div>
                </div>
                <nav className="p-4">
                  {navItems.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive }) =>
                        `flex items-center justify-between py-2 px-3 rounded-md transition-colors ${isActive ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"}`
                      }
                      end={item.path === "/client"}
                    >
                      <div className="flex items-center">
                        {item.icon}
                        <span className="ml-2">{item.label}</span>
                      </div>
                      {item.badge && (
                        <Badge className="ml-auto">{item.badge}</Badge>
                      )}
                    </NavLink>
                  ))}
                  <LogoutButton
                    className="w-full justify-start mt-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                    variant="ghost"
                  />
                </nav>
              </SheetContent>
            </Sheet>
            <h1 className="text-xl font-bold">FoodDelivery</h1>
          </div>

          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <SearchBar
              className="w-full"
              placeholder="Search for food, restaurants..."
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="h-5 w-5" />
            </Button>

            <NotificationCenter />

            <NavLink to="/client/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <NotificationBadge
                    count={totalItems}
                    className="absolute -top-2 -right-2"
                  />
                )}
              </Button>
            </NavLink>

            <NavLink to="/client/profile">
              <UserAvatar size="sm" />
            </NavLink>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="p-4 border-t md:hidden">
            <SearchBar placeholder="Search for food, restaurants..." />
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 container py-6 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Outlet />
        </motion.div>
      </main>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background z-10">
        <div className="grid grid-cols-5 h-16">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center relative ${isActive ? "text-primary" : "text-muted-foreground"} transition-all duration-200`
              }
              end={item.path === "/client"}
            >
              <motion.div
                whileTap={{ scale: 0.9 }}
                className="flex flex-col items-center"
              >
                {item.icon}
                <span className="text-xs mt-1">{item.label}</span>
                {item.badge && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 animate-pulse">
                    {item.badge}
                  </Badge>
                )}
              </motion.div>
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
}
