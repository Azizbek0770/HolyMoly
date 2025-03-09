import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  CreditCard,
  MapPin,
  Bell,
  Lock,
  Shield,
  Wallet,
  Gift,
  Star,
} from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("personal");
  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: "(555) 123-4567",
    dob: "1990-01-01",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: "1",
      type: "Visa",
      last4: "4242",
      expiry: "12/25",
      isDefault: true,
    },
    {
      id: "2",
      type: "Mastercard",
      last4: "5555",
      expiry: "10/24",
      isDefault: false,
    },
  ]);

  const [addresses, setAddresses] = useState([
    {
      id: "1",
      name: "Home",
      address: "123 Main St, Apt 4B",
      city: "New York",
      state: "NY",
      zip: "10001",
      isDefault: true,
    },
    {
      id: "2",
      name: "Work",
      address: "456 Office Blvd, Suite 100",
      city: "New York",
      state: "NY",
      zip: "10002",
      isDefault: false,
    },
  ]);

  const [loyaltyPoints, setLoyaltyPoints] = useState(450);
  const [membershipTier, setMembershipTier] = useState("Silver");

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.name,
        email: user.email,
      }));
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));

    // Clear error when user types
    if (formErrors[id]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }

    // Clear success message when user makes changes
    if (successMessage) {
      setSuccessMessage("");
    }
  };

  const validatePersonalInfo = () => {
    const errors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      errors.fullName = "Name is required";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = "Email is invalid";
    }

    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    }

    return errors;
  };

  const validatePasswordChange = () => {
    const errors: Record<string, string> = {};

    if (!formData.currentPassword) {
      errors.currentPassword = "Current password is required";
    }

    if (!formData.newPassword) {
      errors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 8) {
      errors.newPassword = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    return errors;
  };

  const handleSavePersonalInfo = (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validatePersonalInfo();

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      // In a real app, you would update the user profile here
      setSuccessMessage("Personal information updated successfully");
      setIsSubmitting(false);
    }, 1000);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validatePasswordChange();

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      // In a real app, you would update the password here
      setSuccessMessage("Password updated successfully");
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-primary">
            <AvatarImage
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || "Guest"}`}
              alt={user?.name || "Guest"}
            />
            <AvatarFallback className="text-lg">
              {user?.name?.charAt(0) || "G"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{user?.name || "Guest"}</h1>
            <p className="text-muted-foreground">
              {user?.email || "guest@example.com"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-amber-500 hover:bg-amber-600">
            <Star className="h-3 w-3 mr-1 fill-current" />
            {membershipTier} Member
          </Badge>
          <Badge variant="outline" className="gap-1">
            <Wallet className="h-3 w-3" />
            {loyaltyPoints} Points
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 md:w-fit">
          <TabsTrigger value="personal">
            <User className="h-4 w-4 mr-2 md:mr-0 md:hidden" />
            <span className="hidden md:inline mr-2">Personal</span>
            <span className="md:hidden">Info</span>
          </TabsTrigger>
          <TabsTrigger value="payment">
            <CreditCard className="h-4 w-4 mr-2 md:mr-0 md:hidden" />
            <span className="hidden md:inline">Payment Methods</span>
            <span className="md:hidden">Payment</span>
          </TabsTrigger>
          <TabsTrigger value="addresses">
            <MapPin className="h-4 w-4 mr-2 md:mr-0 md:hidden" />
            <span className="hidden md:inline">Addresses</span>
            <span className="md:hidden">Address</span>
          </TabsTrigger>
          <TabsTrigger value="rewards">
            <Gift className="h-4 w-4 mr-2 md:mr-0 md:hidden" />
            <span className="hidden md:inline">Rewards & Offers</span>
            <span className="md:hidden">Rewards</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal details and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {successMessage && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
                  {successMessage}
                </div>
              )}
              <form id="personal-info-form" onSubmit={handleSavePersonalInfo}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Your full name"
                      className={formErrors.fullName ? "border-red-500" : ""}
                    />
                    {formErrors.fullName && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.fullName}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Your email address"
                      className={formErrors.email ? "border-red-500" : ""}
                    />
                    {formErrors.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.email}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Your phone number"
                      className={formErrors.phone ? "border-red-500" : ""}
                    />
                    {formErrors.phone && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.phone}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input
                      id="dob"
                      type="date"
                      value={formData.dob}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-2">
                  <Label>Notification Preferences</Label>
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="order-updates">Order Updates</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications about your order status
                        </p>
                      </div>
                      <Switch id="order-updates" defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="promotions">Promotions</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive emails about new offers and discounts
                        </p>
                      </div>
                      <Switch id="promotions" defaultChecked />
                    </div>
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                type="submit"
                form="personal-info-form"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>
                Manage your password and security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {successMessage && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
                  {successMessage}
                </div>
              )}
              <form onSubmit={handleUpdatePassword}>
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    placeholder="Enter your current password"
                    className={
                      formErrors.currentPassword ? "border-red-500" : ""
                    }
                  />
                  {formErrors.currentPassword && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.currentPassword}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      placeholder="Enter new password"
                      className={formErrors.newPassword ? "border-red-500" : ""}
                    />
                    {formErrors.newPassword && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.newPassword}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm new password"
                      className={
                        formErrors.confirmPassword ? "border-red-500" : ""
                      }
                    />
                    {formErrors.confirmPassword && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Updating..." : "Update Password"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment" className="space-y-4 mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>
                  Manage your payment methods for faster checkout
                </CardDescription>
              </div>
              <Button>
                <CreditCard className="h-4 w-4 mr-2" />
                Add New Card
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    {method.type === "Visa" ? (
                      <div className="h-10 w-14 bg-blue-600 rounded-md flex items-center justify-center text-white font-bold">
                        VISA
                      </div>
                    ) : (
                      <div className="h-10 w-14 bg-red-500 rounded-md flex items-center justify-center text-white font-bold">
                        MC
                      </div>
                    )}
                    <div>
                      <p className="font-medium">
                        {method.type} ending in {method.last4}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Expires {method.expiry}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {method.isDefault && (
                      <Badge variant="outline">Default</Badge>
                    )}
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>
                View your recent transactions and billing history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-4 p-4 font-medium border-b">
                  <div>Date</div>
                  <div>Order ID</div>
                  <div>Amount</div>
                  <div>Status</div>
                </div>
                {[
                  {
                    date: "2023-06-15",
                    orderId: "ORD-1234",
                    amount: "$24.99",
                    status: "Completed",
                  },
                  {
                    date: "2023-06-10",
                    orderId: "ORD-1233",
                    amount: "$18.50",
                    status: "Completed",
                  },
                  {
                    date: "2023-06-05",
                    orderId: "ORD-1232",
                    amount: "$32.75",
                    status: "Completed",
                  },
                ].map((transaction, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-4 p-4 border-b last:border-0"
                  >
                    <div>{transaction.date}</div>
                    <div>{transaction.orderId}</div>
                    <div>{transaction.amount}</div>
                    <div>
                      <Badge
                        variant="outline"
                        className="bg-green-500 text-white border-0"
                      >
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="addresses" className="space-y-4 mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Delivery Addresses</CardTitle>
                <CardDescription>
                  Manage your saved delivery addresses
                </CardDescription>
              </div>
              <Button>
                <MapPin className="h-4 w-4 mr-2" />
                Add New Address
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{address.name}</p>
                      {address.isDefault && (
                        <Badge variant="outline">Default</Badge>
                      )}
                    </div>
                    <p className="text-sm">{address.address}</p>
                    <p className="text-sm">
                      {address.city}, {address.state} {address.zip}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 self-end md:self-auto">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rewards" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Rewards Program</CardTitle>
              <CardDescription>
                Track your rewards and membership benefits
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 p-4 border rounded-lg space-y-2">
                  <div className="flex items-center gap-2">
                    <Wallet className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Loyalty Points</h3>
                  </div>
                  <p className="text-3xl font-bold">{loyaltyPoints}</p>
                  <p className="text-sm text-muted-foreground">
                    You need 50 more points to reach Gold tier
                  </p>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${(loyaltyPoints / 500) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex-1 p-4 border rounded-lg space-y-2">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-amber-500" />
                    <h3 className="font-semibold">Membership Tier</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-amber-500 hover:bg-amber-600 text-lg py-1 px-3">
                      {membershipTier}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Silver members get free delivery on orders over $25
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-4">Available Offers</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      title: "20% Off Your Next Order",
                      code: "SAVE20",
                      expiry: "Valid until July 30, 2023",
                    },
                    {
                      title: "Free Delivery",
                      code: "FREEDEL",
                      expiry: "Valid until July 15, 2023",
                    },
                    {
                      title: "Buy One Get One Free",
                      code: "BOGOF",
                      expiry: "Valid on weekends only",
                    },
                  ].map((offer, index) => (
                    <div
                      key={index}
                      className="p-4 border rounded-lg space-y-2 bg-muted/30"
                    >
                      <h4 className="font-medium">{offer.title}</h4>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-primary/10">
                          {offer.code}
                        </Badge>
                        <Button variant="ghost" size="sm" className="h-6 px-2">
                          Copy
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {offer.expiry}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Referral Program</CardTitle>
              <CardDescription>Invite friends and earn rewards</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Share your referral code with friends. When they sign up and
                place their first order, you'll both receive 100 loyalty points!
              </p>
              <div className="flex items-center gap-2">
                <Input value="FOODIE123" readOnly />
                <Button>Copy</Button>
              </div>
              <div className="p-4 border rounded-lg bg-muted/30">
                <p className="text-sm font-medium">Your Referrals</p>
                <p className="text-2xl font-bold mt-1">3</p>
                <p className="text-sm text-muted-foreground">
                  You've earned 300 points from referrals
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
