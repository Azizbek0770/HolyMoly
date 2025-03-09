import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ShoppingCart,
  User,
  Search,
  Home,
  Clock,
  Settings,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ClientLayout() {
  const [cartCount, setCartCount] = useState(0);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container flex items-center justify-between h-16 px-4">
          <div className="flex items-center">
            <h1 className="text-xl font-bold">FoodDelivery</h1>
          </div>

          <div className="flex-1 max-w-md mx-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search for food..." className="pl-8" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              className="relative"
              onClick={() => (window.location.href = "/client/cart")}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0">
                  {cartCount}
                </Badge>
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => (window.location.href = "/client/profile")}
            >
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container py-4 px-4">
        <Outlet />
      </main>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background z-10">
        <div className="grid grid-cols-4 h-16">
          <Button
            variant="ghost"
            className="flex flex-col items-center justify-center rounded-none h-full"
            onClick={() => (window.location.href = "/client")}
          >
            <Home className="h-5 w-5" />
            <span className="text-xs mt-1">Home</span>
          </Button>
          <Button
            variant="ghost"
            className="flex flex-col items-center justify-center rounded-none h-full"
          >
            <Search className="h-5 w-5" />
            <span className="text-xs mt-1">Search</span>
          </Button>
          <Button
            variant="ghost"
            className="flex flex-col items-center justify-center rounded-none h-full"
            onClick={() => (window.location.href = "/client/orders")}
          >
            <Clock className="h-5 w-5" />
            <span className="text-xs mt-1">Orders</span>
          </Button>
          <Button
            variant="ghost"
            className="flex flex-col items-center justify-center rounded-none h-full"
            onClick={() => (window.location.href = "/client/profile")}
          >
            <User className="h-5 w-5" />
            <span className="text-xs mt-1">Profile</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
