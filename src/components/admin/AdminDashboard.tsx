import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Users,
  ShoppingBag,
  Clock,
} from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline">Export</Button>
          <Button>Refresh</Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value="$12,543.00"
          change="+12.5%"
          trend="up"
          description="vs. previous month"
          icon={<DollarSign className="h-4 w-4" />}
        />
        <StatCard
          title="Active Users"
          value="2,350"
          change="+18.2%"
          trend="up"
          description="vs. previous month"
          icon={<Users className="h-4 w-4" />}
        />
        <StatCard
          title="Total Orders"
          value="1,245"
          change="-3.1%"
          trend="down"
          description="vs. previous month"
          icon={<ShoppingBag className="h-4 w-4" />}
        />
        <StatCard
          title="Avg. Delivery Time"
          value="24 min"
          change="-2.3%"
          trend="up"
          description="vs. previous month"
          icon={<Clock className="h-4 w-4" />}
        />
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Latest orders from customers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left font-medium p-2">Order ID</th>
                  <th className="text-left font-medium p-2">Customer</th>
                  <th className="text-left font-medium p-2">Items</th>
                  <th className="text-left font-medium p-2">Total</th>
                  <th className="text-left font-medium p-2">Status</th>
                  <th className="text-left font-medium p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    id: "ORD-1234",
                    customer: "John Doe",
                    items: 3,
                    total: "$24.99",
                    status: "delivered",
                  },
                  {
                    id: "ORD-1235",
                    customer: "Jane Smith",
                    items: 2,
                    total: "$18.50",
                    status: "processing",
                  },
                  {
                    id: "ORD-1236",
                    customer: "Bob Johnson",
                    items: 4,
                    total: "$32.75",
                    status: "pending",
                  },
                  {
                    id: "ORD-1237",
                    customer: "Alice Brown",
                    items: 1,
                    total: "$9.99",
                    status: "delivered",
                  },
                  {
                    id: "ORD-1238",
                    customer: "Charlie Wilson",
                    items: 5,
                    total: "$45.50",
                    status: "processing",
                  },
                ].map((order) => (
                  <tr key={order.id} className="border-b">
                    <td className="p-2">{order.id}</td>
                    <td className="p-2">{order.customer}</td>
                    <td className="p-2">{order.items} items</td>
                    <td className="p-2">{order.total}</td>
                    <td className="p-2">
                      <Badge
                        variant="outline"
                        className={`
                          ${order.status === "delivered" ? "bg-green-500" : ""}
                          ${order.status === "processing" ? "bg-blue-500" : ""}
                          ${order.status === "pending" ? "bg-yellow-500" : ""}
                          text-white border-0
                        `}
                      >
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="p-2">
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-center mt-4">
            <Button variant="outline">View All Orders</Button>
          </div>
        </CardContent>
      </Card>

      {/* Analytics Tabs */}
      <Tabs defaultValue="sales">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="sales">Sales Analytics</TabsTrigger>
          <TabsTrigger value="users">User Activity</TabsTrigger>
          <TabsTrigger value="delivery">Delivery Performance</TabsTrigger>
        </TabsList>
        <TabsContent value="sales">
          <Card>
            <CardHeader>
              <CardTitle>Sales Overview</CardTitle>
              <CardDescription>Monthly sales performance</CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                [Sales Chart Visualization Placeholder]
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Activity</CardTitle>
              <CardDescription>Active users and registrations</CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                [User Activity Chart Placeholder]
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="delivery">
          <Card>
            <CardHeader>
              <CardTitle>Delivery Performance</CardTitle>
              <CardDescription>Delivery times and efficiency</CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                [Delivery Performance Chart Placeholder]
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatCard({
  title,
  value,
  change,
  trend,
  description,
  icon,
}: {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="p-2 bg-primary/10 rounded-full">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center mt-1">
          <Badge
            variant="outline"
            className={`
              ${trend === "up" ? "text-green-500 bg-green-500/10" : "text-red-500 bg-red-500/10"}
              border-0 flex items-center gap-1
            `}
          >
            {trend === "up" ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : (
              <ArrowDownRight className="h-3 w-3" />
            )}
            {change}
          </Badge>
          <span className="text-xs text-muted-foreground ml-2">
            {description}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
