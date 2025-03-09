import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import LogoutButton from "@/components/ui/LogoutButton";
import { useAuth } from "@/contexts/AuthContext";
import UserAvatar from "@/components/ui/UserAvatar";
import { Menu, ShoppingBag, MapPin, Clock, User, Bell } from "lucide-react";

export default function DeliveryLayout() {
  const [isOnline, setIsOnline] = useState(true);
  const [activeTab, setActiveTab] = useState("orders");
  const { user } = useAuth();

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
                  <h1 className="text-xl font-bold">Delivery Portal</h1>
                </div>
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <UserAvatar />
                  </div>
                </div>
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="online-mode-mobile">Online Mode</Label>
                    <Switch
                      id="online-mode-mobile"
                      checked={isOnline}
                      onCheckedChange={setIsOnline}
                    />
                  </div>
                </div>
                <nav className="p-4">
                  <Button
                    variant={activeTab === "orders" ? "default" : "ghost"}
                    className="w-full justify-start mb-2"
                    onClick={() => setActiveTab("orders")}
                  >
                    <ShoppingBag className="h-5 w-5 mr-2" />
                    Orders
                  </Button>
                  <Button
                    variant={activeTab === "map" ? "default" : "ghost"}
                    className="w-full justify-start mb-2"
                    onClick={() => setActiveTab("map")}
                  >
                    <MapPin className="h-5 w-5 mr-2" />
                    Map
                  </Button>
                  <Button
                    variant={activeTab === "history" ? "default" : "ghost"}
                    className="w-full justify-start mb-2"
                    onClick={() => setActiveTab("history")}
                  >
                    <Clock className="h-5 w-5 mr-2" />
                    History
                  </Button>
                  <Button
                    variant={activeTab === "profile" ? "default" : "ghost"}
                    className="w-full justify-start mb-2"
                    onClick={() => setActiveTab("profile")}
                  >
                    <User className="h-5 w-5 mr-2" />
                    Profile
                  </Button>
                </nav>
                <div className="p-4 border-t mt-auto">
                  <LogoutButton className="mr-2" />
                </div>
              </SheetContent>
            </Sheet>
            <h1 className="text-xl font-bold">Delivery Portal</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2">
              <Label htmlFor="online-mode" className="cursor-pointer">
                {isOnline ? "Online" : "Offline"}
              </Label>
              <Switch
                id="online-mode"
                checked={isOnline}
                onCheckedChange={setIsOnline}
              />
            </div>
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0">
                2
              </Badge>
            </Button>
            <UserAvatar />
          </div>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden md:flex w-64 flex-col border-r bg-background">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <UserAvatar showName={true} />
            </div>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            <Button
              variant={activeTab === "orders" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("orders")}
            >
              <ShoppingBag className="h-5 w-5 mr-2" />
              Orders
            </Button>
            <Button
              variant={activeTab === "map" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("map")}
            >
              <MapPin className="h-5 w-5 mr-2" />
              Map
            </Button>
            <Button
              variant={activeTab === "history" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("history")}
            >
              <Clock className="h-5 w-5 mr-2" />
              History
            </Button>
            <Button
              variant={activeTab === "profile" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("profile")}
            >
              <User className="h-5 w-5 mr-2" />
              Profile
            </Button>
          </nav>
          <div className="p-4 border-t">
            <LogoutButton className="mr-2" />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="container py-6 px-4">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background z-10">
        <div className="grid grid-cols-4 h-16">
          <Button
            variant={activeTab === "orders" ? "default" : "ghost"}
            className="flex flex-col items-center justify-center rounded-none h-full"
            onClick={() => setActiveTab("orders")}
          >
            <ShoppingBag className="h-5 w-5" />
            <span className="text-xs mt-1">Orders</span>
          </Button>
          <Button
            variant={activeTab === "map" ? "default" : "ghost"}
            className="flex flex-col items-center justify-center rounded-none h-full"
            onClick={() => setActiveTab("map")}
          >
            <MapPin className="h-5 w-5" />
            <span className="text-xs mt-1">Map</span>
          </Button>
          <Button
            variant={activeTab === "history" ? "default" : "ghost"}
            className="flex flex-col items-center justify-center rounded-none h-full"
            onClick={() => setActiveTab("history")}
          >
            <Clock className="h-5 w-5" />
            <span className="text-xs mt-1">History</span>
          </Button>
          <Button
            variant={activeTab === "profile" ? "default" : "ghost"}
            className="flex flex-col items-center justify-center rounded-none h-full"
            onClick={() => setActiveTab("profile")}
          >
            <User className="h-5 w-5" />
            <span className="text-xs mt-1">Profile</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
