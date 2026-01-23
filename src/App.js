import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./components/AdminLayout";
import ProductInventory from "./pages/Productinventory";
import AdminOrdersPage from "./pages/AdminOrdersPage";
import CategoryOrdersPage from "./pages/CreateOrderPage";
import Dashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import ForgotPassword from "./pages/AdminForgotPassword";
import AdminBanners from "./pages/BannerImages";
import AdminActivities from "./pages/AdminActivities";
import AdminServiceFeatures from "./pages/AdminServicespages";
import AdminFeed from "./pages/AdminFeed";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Login page */}
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />

        {/* Admin section with layout */}
        <Route path="/admin" element={<AdminLayout />}>
          {/* Redirect /admin to /admin/products */}
          <Route index element={<Navigate to="products" replace />} />

          {/* Admin child pages */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<ProductInventory />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="sales" element={<CategoryOrdersPage />} />
          <Route path="banner" element={<AdminBanners/>} />
      <Route path="activites" element={<AdminActivities/>} />
      <Route path="services" element={<AdminServiceFeatures/>} />

      <Route path="feed" element={<AdminFeed/>} />

        </Route>

        {/* Catch-all 404 page */}
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}
