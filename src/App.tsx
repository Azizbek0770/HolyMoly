import { Suspense } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import routes from "tempo-routes";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Toaster } from "@/components/ui/toaster";
import LandingPage from "./components/landing/LandingPage";
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
import DeliveryLayout from "@/components/delivery/DeliveryLayout";
import DeliveryOrdersPage from "@/components/delivery/DeliveryOrdersPage";
import ProtectedRoute from "@/middleware/ProtectedRoute";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      {/* For the tempo routes */}
      {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}

      {/* Main application routes */}
      <Routes>
        {/* Add this before the catchall route */}
        {import.meta.env.VITE_TEMPO === "true" && (
          <Route path="/tempobook/*" element={null} />
        )}

        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AuthForm />} />

        {/* Client routes */}
        <Route
          path="/client"
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
          <Route path="favorites" element={<MenuPage />} />
        </Route>

        {/* Admin routes */}
        <Route
          path="/admin"
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
        </Route>

        {/* Delivery routes */}
        <Route
          path="/delivery"
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
      <Toaster />
    </Suspense>
  );
}

export default App;
