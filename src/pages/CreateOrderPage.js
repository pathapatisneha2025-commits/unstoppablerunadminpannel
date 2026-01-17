import React, { useEffect, useState } from "react";

export default function CategoryOrdersPage() {
  const [categoryCounts, setCategoryCounts] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch orders and products and calculate category counts
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
          if (product) {
            counts[product.category] = (counts[product.category] || 0) + 1;
          }
        });
      });

      setCategoryCounts(counts);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryOrderCounts();
  }, []);

  if (loading) return <p>Loading category stats...</p>;

  return (
    <div className="admin-container">
      <main className="main-content">
        <h1>Orders by Category</h1>
        <p>Total categories: {Object.keys(categoryCounts).length}</p>

        <div className="cards-container">
          {Object.entries(categoryCounts).map(([category, count]) => (
            <div key={category} className="card">
              <h3>{category}</h3>
              <p>{count} order{count > 1 ? "s" : ""}</p>
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
