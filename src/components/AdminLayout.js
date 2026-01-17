import React from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { LuLayoutDashboard, LuShoppingBag, LuPackage,LuChartBar } from "react-icons/lu";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine active tab based on the current URL path
  const activeTab = location.pathname.split("/").pop() || "dashboard";

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <LuLayoutDashboard />, path: "/admin/dashboard" },
    { id: "products", label: "Products", icon: <LuPackage />, path: "/admin/products" },
    { id: "orders", label: "Orders", icon: <LuShoppingBag />, path: "/admin/orders" },
  // { id: "sales", label: "CategorySales", icon: <LuChartBar />, path: "/admin/sales" },
  ];

  return (
    <div className="admin-container">
      <aside className="sidebar">
        <div className="sidebar-logo">RUNN<span>.</span></div>
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={activeTab === item.id ? "active" : ""}
              onClick={() => navigate(item.path)}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="main-content">
        <Outlet /> {/* This renders the specific page content */}
      </main>

      <style>{`
        .admin-container { display: flex; min-height: 100vh; background: #F8FAFC; font-family: 'Inter', sans-serif; }
        .sidebar { width: 260px; background: #0F172A; color: white; padding: 30px 20px; position: sticky; top: 0; height: 100vh; }
        .sidebar-logo { font-size: 24px; font-weight: 900; margin-bottom: 40px; }
        .sidebar-logo span { color: #FF6B00; }
        .sidebar-nav button { width: 100%; background: none; border: none; color: #94A3B8; padding: 14px; text-align: left; display: flex; align-items: center; gap: 12px; border-radius: 12px; cursor: pointer; margin-bottom: 5px; font-size: 15px; transition: 0.2s; }
        .sidebar-nav button:hover { color: white; background: #1E293B; }
        .sidebar-nav button.active { background: #1E293B; color: white; border-left: 4px solid #FF6B00; }
        .main-content { flex: 1; padding: 40px; }
      `}</style>
    </div>
  );
}