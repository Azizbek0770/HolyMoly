import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import LogoutButton from "@/components/ui/LogoutButton";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  Utensils,
  Users,
  ShoppingBag,
  BarChart,
  Settings,
  Menu,
  Bell,
} from "lucide-react";

type NavItem = {
  label: string;
  icon: React.ReactNode;
  href: string;
  active?: boolean;
};

export default function AdminLayout() {
  const [activeItem, setActiveItem] = useState("dashboard");

  const navItems: NavItem[] = [
    {
      label: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      href: "/admin",
      active: activeItem === "dashboard",
    },
    {
      label: "Food Items",
      icon: <Utensils className="h-5 w-5" />,
      href: "/admin/food-items",
      active: activeItem === "food-items",
    },
    {
      label: "Users",
      icon: <Users className="h-5 w-5" />,
      href: "/admin/users",
      active: activeItem === "users",
    },
    {
      label: "Orders",
      icon: <ShoppingBag className="h-5 w-5" />,
      href: "/admin/orders",
      active: activeItem === "orders",
    },
    {
      label: "Analytics",
      icon: <BarChart className="h-5 w-5" />,
      href: "/admin/analytics",
      active: activeItem === "analytics",
    },
    {
      label: "Settings",
      icon: <Settings className="h-5 w-5" />,
      href: "/admin/settings",
      active: activeItem === "settings",
    },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-64 flex-col border-r bg-background">
        <div className="p-6">
          <h1 className="text-xl font-bold">Admin Portal</h1>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => (
            <Button
              key={item.label}
              variant={item.active ? "default" : "ghost"}
              className="w-full justify-start mb-1"
              onClick={() => setActiveItem(item.label.toLowerCase())}
            >
              {item.icon}
              <span className="ml-3">{item.label}</span>
            </Button>
          ))}
        </nav>
        <div className="p-4 border-t">
          <LogoutButton className="mr-3" />
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b bg-background">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center">
              {/* Mobile Menu Trigger */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-0">
                  <div className="p-6 border-b">
                    <h1 className="text-xl font-bold">Admin Portal</h1>
                  </div>
                  <nav className="flex-1 px-4 py-4 space-y-1">
                    {navItems.map((item) => (
                      <Button
                        key={item.label}
                        variant={item.active ? "default" : "ghost"}
                        className="w-full justify-start mb-1"
                        onClick={() => setActiveItem(item.label.toLowerCase())}
                      >
                        {item.icon}
                        <span className="ml-3">{item.label}</span>
                      </Button>
                    ))}
                  </nav>
                  <div className="p-4 border-t">
                    <LogoutButton className="mr-3" />
                  </div>
                </SheetContent>
              </Sheet>
              <h1 className="text-lg font-semibold md:hidden ml-2">
                Admin Portal
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                  A
                </div>
                <span className="font-medium hidden md:inline">Admin User</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
