import { Routes, Route, Navigate } from "react-router-dom";
import AuthForm from "@/components/auth/AuthForm";
import ClientLayout from "@/components/client/ClientLayout";
import MenuPage from "@/components/client/MenuPage";
import CartPage from "@/components/client/CartPage";
import OrderHistoryPage from "@/components/client/OrderHistoryPage";
import ProfilePage from "@/components/client/ProfilePage";
import FoodDetailPage from "@/components/client/FoodDetailPage";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminDashboard from "@/components/admin/AdminDashboard";
import FoodItemsPage from "@/components/admin/FoodItemsPage";
import FoodItemDetailPage from "@/components/admin/FoodItemDetailPage";
import SpecialOffersPage from "@/components/admin/SpecialOffersPage";
import UserManagementPage from "@/components/admin/UserManagementPage";
import DeliveryLayout from "@/components/delivery/DeliveryLayout";
import DeliveryOrdersPage from "@/components/delivery/DeliveryOrdersPage";
import ProtectedRoute from "@/middleware/ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="login" element={<AuthForm />} />

      {/* Client routes */}
      <Route
        path="client"
        element={
          <ProtectedRoute allowedRoles={["client"]}>
            <ClientLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<MenuPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="orders" element={<OrderHistoryPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="food/:id" element={<FoodDetailPage />} />
        <Route path="restaurant/:id" element={<MenuPage />} />
      </Route>

      {/* Admin routes */}
      <Route
        path="admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="food-items" element={<FoodItemsPage />} />
        <Route path="food-items/:id" element={<FoodItemDetailPage />} />
        <Route path="special-offers" element={<SpecialOffersPage />} />
        <Route path="users" element={<UserManagementPage />} />
      </Route>

      {/* Delivery routes */}
      <Route
        path="delivery"
        element={
          <ProtectedRoute allowedRoles={["delivery"]}>
            <DeliveryLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DeliveryOrdersPage />} />
      </Route>

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
