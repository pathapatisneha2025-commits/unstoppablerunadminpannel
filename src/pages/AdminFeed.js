import React, { useEffect, useState } from "react";

const BASE_URL = "https://unstopablerundatabse.onrender.com/feed"; // backend URL

export default function AdminFeed() {
  const [feed, setFeed] = useState([]);
  const [type, setType] = useState("video");
  const [file, setFile] = useState(null);
  const [editId, setEditId] = useState(null);

  // Fetch all feed items
  const fetchFeed = async () => {
    try {
      const res = await fetch(`${BASE_URL}/all`);
      const data = await res.json();
      setFeed(Array.isArray(data) ? data : []); // safe fallback
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  // Add or update
  const handleAddOrUpdate = async () => {
    if (!type) return alert("Select type");
    if (!file && !editId) return alert("Please select a file"); // only required for new

    const formData = new FormData();
    formData.append("type", type);
    if (file) formData.append("file", file); // optional on edit

    const url = editId ? `${BASE_URL}/update/${editId}` : `${BASE_URL}/add`;
    const method = editId ? "PUT" : "POST";

    const res = await fetch(url, { method, body: formData });
    const data = await res.json();

    console.log("Server response:", data); // debug
    if (res.ok) {
      fetchFeed();
      setEditId(null); // reset edit mode
      setFile(null);
    } else {
      alert(data.error || "Something went wrong");
    }
  };

  // Edit button
  const handleEdit = (item) => {
    setEditId(item.id);
    setType(item.type);
    setFile(null); // require new upload if changing
  };

  // Delete button
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      const res = await fetch(`${BASE_URL}/delete/${id}`, { method: "DELETE" });
      if (res.ok) fetchFeed();
      else {
        const data = await res.json();
        alert(data.error || "Delete failed");
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", backgroundColor: "#fff", padding: "2rem", minHeight: "100vh" }}>
      <h2 style={{ color: "#FF6600", marginBottom: "1rem" }}>Feed Admin Panel</h2>

      {/* Add / Update Form */}
      <div style={{ marginBottom: "1.5rem", display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          style={{ padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
        >
          <option value="video">Video</option>
          <option value="image">Image</option>
        </select>

        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          accept={type === "video" ? "video/*" : "image/*"}
          style={{ padding: "0.3rem" }}
        />

        <button
          onClick={handleAddOrUpdate}
          style={{
            backgroundColor: "#FF6600",
            color: "#fff",
            padding: "0.5rem 1rem",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          {editId ? "Update" : "Add"}
        </button>
      </div>

      {/* Feed Table */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#FF6600", color: "#fff" }}>
            <th style={{ padding: "0.5rem", border: "1px solid #ddd" }}>ID</th>
            <th style={{ padding: "0.5rem", border: "1px solid #ddd" }}>Type</th>
            <th style={{ padding: "0.5rem", border: "1px solid #ddd" }}>Preview</th>
            <th style={{ padding: "0.5rem", border: "1px solid #ddd" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {feed.map((item) => (
            <tr key={item.id}>
              <td style={{ padding: "0.5rem", border: "1px solid #ddd" }}>{item.id}</td>
              <td style={{ padding: "0.5rem", border: "1px solid #ddd" }}>{item.type}</td>
              <td style={{ padding: "0.5rem", border: "1px solid #ddd" }}>
                {item.type === "image" ? (
                  <img src={item.src} alt="preview" style={{ width: 120, height: 80, objectFit: "cover" }} />
                ) : (
                  <video src={item.src} style={{ width: 120, height: 80, objectFit: "cover" }} controls />
                )}
              </td>
              <td style={{ padding: "0.5rem", border: "1px solid #ddd", display: "flex", gap: "0.5rem" }}>
                <button
                  onClick={() => handleEdit(item)}
                  style={{
                    backgroundColor: "#FFA500",
                    color: "#fff",
                    padding: "0.3rem 0.6rem",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  style={{
                    backgroundColor: "#FF3300",
                    color: "#fff",
                    padding: "0.3rem 0.6rem",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
