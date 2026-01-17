import React, { useEffect, useState } from "react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch(
        "https://unstopablerundatabse.onrender.com/orders/all"
      );
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ⭐ NEW: Update status
  const updateStatus = async (orderId, status) => {
    try {
      await fetch(
        `https://unstopablerundatabse.onrender.com/orders/update-status/${orderId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        }
      );

      // update UI instantly
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, status } : o
        )
      );
    } catch (err) {
      alert("Failed to update status");
    }
  };

  if (loading) return <p style={{ padding: 40 }}>Loading orders...</p>;

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Admin Orders</h1>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Order ID</th>
              <th style={styles.th}>User ID</th>
              <th style={styles.th}>Total</th>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Status</th> {/* ⭐ NEW */}
              <th style={styles.th}>Address</th>
              <th style={styles.th}>Items</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order.id} style={styles.tr}>
                <td style={styles.td}>{order.id}</td>
                <td style={styles.td}>{order.user_id}</td>
                <td style={styles.td}>
                  ₹{parseFloat(order.total_price).toFixed(2)}
                </td>
                <td style={styles.td}>
                  {new Date(order.created_at).toLocaleString()}
                </td>

                {/* ⭐ STATUS DROPDOWN */}
                <td style={styles.td}>
                  <select
                    value={order.status || "Pending"}
                    onChange={(e) =>
                      updateStatus(order.id, e.target.value)
                    }
                    style={{
                      padding: "6px 10px",
                      borderRadius: 6,
                      border: "1px solid #ccc",
                      fontWeight: 600,
                      background: getStatusColor(order.status),
                    }}
                  >
                    <option>Pending</option>
                    <option>Processing</option>
                    <option>Shipped</option>
                    <option>Delivered</option>
                    <option>Cancelled</option>
                  </select>
                </td>

                {/* Address */}
                <td style={styles.td}>
                  <div style={styles.addressBox}>
                    <div>{order.address?.name}</div>
                    <div>{order.address?.street}</div>
                    <div>
                      {order.address?.city}, {order.address?.state}
                    </div>
                    <div>📞 {order.address?.mobile}</div>
                  </div>
                </td>

                {/* Items */}
                <td style={styles.td}>
                  <table style={styles.innerTable}>
                    <thead>
                      <tr>
                        <th style={styles.innerTh}>Product</th>
                        <th style={styles.innerTh}>Qty</th>
                        <th style={styles.innerTh}>Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map((item) => (
                        <tr key={item.product_id}>
                          <td style={styles.innerTd}>
                            {item.product_name}
                          </td>
                          <td style={styles.innerTd}>{item.quantity}</td>
                          <td style={styles.innerTd}>
                            ₹{item.product_price.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ⭐ STATUS COLORS */
const getStatusColor = (status) => {
  switch (status) {
    case "Delivered":
      return "#d4edda";
    case "Shipped":
      return "#cce5ff";
    case "Processing":
      return "#fff3cd";
    case "Cancelled":
      return "#f8d7da";
    default:
      return "#eee";
  }
};

/* ---------------- STYLES ---------------- */

const styles = {
  container: {
    padding: "40px",
    fontFamily: "'Segoe UI', sans-serif",
    background: "#f5f7fb",
  },
  heading: { marginBottom: 20 },
  tableWrapper: {
    background: "#fff",
    borderRadius: 12,
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
    overflowX: "auto",
  },
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    padding: "14px",
    background: "#f1f3f6",
    borderBottom: "1px solid #ddd",
  },
  tr: { borderBottom: "1px solid #eee" },
  td: { padding: "14px", verticalAlign: "top", fontSize: 14 },
  addressBox: {
    fontSize: 13,
    background: "#fafafa",
    padding: 10,
    borderRadius: 6,
    border: "1px solid #eee",
  },
  innerTable: {
    width: "100%",
    borderCollapse: "collapse",
    background: "#fafafa",
  },
  innerTh: {
    padding: 8,
    background: "#eaecef",
    borderBottom: "1px solid #ddd",
  },
  innerTd: { padding: 8, borderBottom: "1px solid #eee" },
};
