import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { LuLayoutDashboard, LuShoppingBag, LuPackage, LuChartBar, LuMenu, LuX, LuLogOut } from "react-icons/lu";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const activeTab = location.pathname.split("/").pop() || "dashboard";

  const handleLogout = () => {
    navigate("/login", { replace: true });
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <LuLayoutDashboard />, path: "/admin/dashboard" },
    { id: "products", label: "Products", icon: <LuPackage />, path: "/admin/products" },
    { id: "orders", label: "Orders", icon: <LuShoppingBag />, path: "/admin/orders" },
    { id: "bannenrs", label:"banner", icon: <LuShoppingBag />, path: "/admin/banner" },
    { id: "activities", label:"actvities", icon: <LuShoppingBag />, path: "/admin/activites" },
    { id: "featuredcollections", label:"featured", icon: <LuShoppingBag />, path: "/admin/featurecollection" },

    { id: "services", label:"services", icon: <LuShoppingBag />, path: "/admin/services" },
    { id: "userfeeds", label:"feeds", icon: <LuShoppingBag />, path: "/admin/feed" },

    { id: "logout", label: "Logout", icon: <LuLogOut />, action: handleLogout },
    // { id: "sales", label: "CategorySales", icon: <LuChartBar />, path: "/admin/sales" },
  ];

  // Close sidebar on window resize if desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) setSidebarOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="admin-container">
      {/* Mobile Hamburger */}
      <button className="mobile-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
        {sidebarOpen ? <LuX size={24} /> : <LuMenu size={24} />}
      </button>

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-logo">RUNN<span>.</span></div>
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={activeTab === item.id ? "active" : ""}
              onClick={() => {
                if (item.action) {
                  item.action();
                } else {
                  navigate(item.path);
                }
                setSidebarOpen(false);
              }}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="main-content" onClick={() => sidebarOpen && setSidebarOpen(false)}>
        <Outlet />
      </main>

      <style>{`
        .admin-container {
          display: flex;
          min-height: 100vh;
          font-family: 'Inter', sans-serif;
          background: #F8FAFC;
        }

        /* Sidebar */
        .sidebar {
          width: 260px;
          background: #0F172A;
          color: white;
          padding: 30px 20px;
          position: sticky;
          top: 0;
          height: 100vh;
          transition: transform 0.3s ease-in-out;
        }
        .sidebar-logo { font-size: 24px; font-weight: 900; margin-bottom: 40px; }
        .sidebar-logo span { color: #FF6B00; }

        .sidebar-nav button {
          width: 100%;
          background: none;
          border: none;
          color: #94A3B8;
          padding: 14px;
          text-align: left;
          display: flex;
          align-items: center;
          gap: 12px;
          border-radius: 12px;
          cursor: pointer;
          margin-bottom: 5px;
          font-size: 15px;
          transition: 0.2s;
        }
        .sidebar-nav button:hover { color: white; background: #1E293B; }
        .sidebar-nav button.active { background: #1E293B; color: white; border-left: 4px solid #FF6B00; }

        /* Main content */
        .main-content { flex: 1; padding: 40px; transition: margin-left 0.3s; }

        /* Mobile Hamburger */
        .mobile-toggle {
          display: none;
          position: fixed;
          top: 16px;
          left: 16px;
          background: #0F172A;
          color: white;
          border: none;
          padding: 8px;
          border-radius: 8px;
          z-index: 1001;
          cursor: pointer;
        }

        /* Mobile Styles */
        @media (max-width: 768px) {
          .sidebar {
            position: fixed;
            top: 0;
            left: 0;
            height: 100%;
            transform: translateX(-100%);
            z-index: 1000;
          }
          .sidebar.open { transform: translateX(0); }
          .main-content { padding: 20px; }
          .mobile-toggle { display: block; }
        }
      `}</style>
    </div>
  );
}
