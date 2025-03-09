import { Suspense } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import routes from "tempo-routes";
import AppRoutes from "./routes";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Toaster } from "@/components/ui/toaster";
import LandingPage from "./components/landing/LandingPage";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            {/* For the tempo routes */}
            {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}

            {/* Main application routes */}
            <Routes>
              {/* Add this before the catchall route */}
              {import.meta.env.VITE_TEMPO === "true" && (
                <Route path="/tempobook/*" element={null} />
              )}

              {/* Landing page route */}
              <Route path="/" element={<LandingPage />} />

              {/* Include all app routes */}
              <Route path="/*" element={<AppRoutes />} />
            </Routes>
            <Toaster />
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </Suspense>
  );
}

export default App;
