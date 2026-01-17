import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./components/AdminLayout";
import ProductInventory from "./pages/Productinventory";
import AdminOrdersPage from "./pages/AdminOrdersPage";
import CategoryOrdersPage from "./pages/CreateOrderPage";
import Dashboard from "./pages/AdminDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. If user lands on http://localhost:3001/, send them to /admin */}
        <Route path="/" element={<Navigate to="/admin" />} />

        {/* 2. Parent Route */}
        <Route path="/admin" element={<AdminLayout />}>
          
          {/* 3. If user hits /admin, redirect to /admin/products */}
          <Route index element={<Navigate to="products" replace />} />
          
          {/* 4. Child paths (no leading slashes needed) */}
          <Route path="dashboard" element={<Dashboard/>} />
          <Route path="products" element={<ProductInventory />} />
          <Route path="orders" element={<AdminOrdersPage/>} />
          <Route path="sales" element={<CategoryOrdersPage/>} />
        </Route>

        {/* Optional: 404 Page */}
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}