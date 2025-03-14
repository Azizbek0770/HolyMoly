import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileForm from "./ProfileForm";
import AddressManagementPage from "./AddressManagementPage";
import PaymentMethodsPage from "./PaymentMethodsPage";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="space-y-6 pb-20">
      <h1 className="text-2xl font-bold">Your Account</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="addresses">Addresses</TabsTrigger>
          <TabsTrigger value="payment">Payment Methods</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="pt-6">
          <ProfileForm />
        </TabsContent>

        <TabsContent value="addresses" className="pt-6">
          <AddressManagementPage />
        </TabsContent>

        <TabsContent value="payment" className="pt-6">
          <PaymentMethodsPage />
        </TabsContent>
      </Tabs>
    </div>
  );
}
