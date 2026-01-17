import React, { useEffect, useState } from "react";

export default function CategoryOrdersPage() {
  const [categoryCounts, setCategoryCounts] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchCategoryOrderCounts = async () => {
    try {
      const ordersRes = await fetch("https://unstopablerundatabse.onrender.com/orders/all");
      const orders = await ordersRes.json();

      const productsRes = await fetch("https://unstopablerundatabse.onrender.com/products/all");
      const products = await productsRes.json();

      const counts = {};

      orders.forEach((order) => {
        order.items.forEach((item) => {
          const product = products.find((p) => p.id === item.product_id);
          const category = product?.category || "Uncategorized";
          counts[category] = (counts[category] || 0) + item.quantity;
        });
      });

      setCategoryCounts(counts);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching category stats:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryOrderCounts();
  }, []);

  if (loading) return <p>Loading category stats...</p>;

  const sortedCategories = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]);

  return (
    <div className="admin-container">
      <main className="main-content">
        <h1>Orders by Category</h1>
        <p>Total categories: {sortedCategories.length}</p>

        <div className="cards-container">
          {sortedCategories.map(([category, count]) => (
            <div key={category} className="card">
              <h3>{category}</h3>
              <p>{count} item{count > 1 ? "s" : ""} ordered</p>
            </div>
          ))}
        </div>
      </main>

      <style>{`
        .admin-container {
          padding: 40px;
          font-family: 'Inter', sans-serif;
          background: #F8FAFC;
          min-height: 100vh;
        }
        .main-content h1 {
          margin-bottom: 20px;
          font-size: 28px;
          font-weight: 700;
        }
        .cards-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 20px;
        }
        .card {
          background: white;
          padding: 20px;
          border-radius: 16px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.05);
          text-align: center;
        }
        .card h3 {
          margin-bottom: 10px;
          font-size: 18px;
          font-weight: 600;
        }
        .card p {
          font-size: 16px;
          color: #333;
        }
      `}</style>
    </div>
  );
}
