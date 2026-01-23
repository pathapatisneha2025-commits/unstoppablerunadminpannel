import React, { useState, useEffect } from "react";

export default function AdminServiceFeatures() {
  const [features, setFeatures] = useState([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [iconName, setIconName] = useState("FiTruck"); // default icon
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFeatures();
  }, []);

  const fetchFeatures = async () => {
    try {
      const res = await fetch("https://unstopablerundatabse.onrender.com/services/all");
      const data = await res.json();
      setFeatures(data);
    } catch (err) {
      console.error("Fetch features error:", err);
    }
  };

  const handleSubmit = async () => {
    if (!title || !desc || !iconName) return alert("All fields are required");
    setLoading(true);

    const body = { title, description: desc, icon_name: iconName };
    try {
      if (editingId) {
        await fetch(`https://unstopablerundatabse.onrender.com/services/update/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      } else {
        await fetch("https://unstopablerundatabse.onrender.com/services/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }

      setTitle("");
      setDesc("");
      setIconName("FiTruck");
      setEditingId(null);
      fetchFeatures();
    } catch (err) {
      console.error("Submit error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (feature) => {
    setEditingId(feature.id);
    setTitle(feature.title);
    setDesc(feature.description);
    setIconName(feature.icon_name);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this feature?")) return;
    try {
      await fetch(`https://unstopablerundatabse.onrender.com/services/delete/${id}`, { method: "DELETE" });
      fetchFeatures();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", padding: 20, fontFamily: "Inter, sans-serif" }}>
      <h1 style={{ textAlign: "center", marginBottom: 30, color: "#ff6b00" }}>
        Admin Panel: Service Features
      </h1>

      {/* Form */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 30, padding: 20, borderRadius: 12, background: "#fff", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ padding: 10, borderRadius: 6, border: "1px solid #ddd" }}
        />
        <input
          type="text"
          placeholder="Description"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          style={{ padding: 10, borderRadius: 6, border: "1px solid #ddd" }}
        />
        <select
          value={iconName}
          onChange={(e) => setIconName(e.target.value)}
          style={{ padding: 10, borderRadius: 6, border: "1px solid #ddd" }}
        >
          <option value="FiTruck">FiTruck</option>
          <option value="FiPackage">FiPackage</option>
          <option value="FiRefreshCw">FiRefreshCw</option>
        </select>

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{ padding: "12px 20px", backgroundColor: "#ff6b00", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 600 }}
        >
          {loading ? (editingId ? "Updating..." : "Adding...") : (editingId ? "Update Feature" : "Add Feature")}
        </button>
      </div>

      {/* Table */}
      <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: 8, overflow: "hidden" }}>
        <thead style={{ background: "#f5f5f5" }}>
          <tr>
            <th style={{ padding: 10, border: "1px solid #ddd" }}>#</th>
            <th style={{ padding: 10, border: "1px solid #ddd" }}>Title</th>
            <th style={{ padding: 10, border: "1px solid #ddd" }}>Description</th>
            <th style={{ padding: 10, border: "1px solid #ddd" }}>Icon</th>
            <th style={{ padding: 10, border: "1px solid #ddd" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {features.map((f, idx) => (
            <tr key={f.id}>
              <td style={{ padding: 10, border: "1px solid #ddd", textAlign: "center" }}>{idx + 1}</td>
              <td style={{ padding: 10, border: "1px solid #ddd" }}>{f.title}</td>
              <td style={{ padding: 10, border: "1px solid #ddd" }}>{f.description}</td>
              <td style={{ padding: 10, border: "1px solid #ddd" }}>{f.icon_name}</td>
              <td style={{ padding: 10, border: "1px solid #ddd", textAlign: "center" }}>
                <button
                  onClick={() => handleEdit(f)}
                  style={{ marginRight: 8, padding: "5px 10px", background: "#007bff", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(f.id)}
                  style={{ padding: "5px 10px", background: "red", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {features.length === 0 && (
            <tr>
              <td colSpan={5} style={{ padding: 20, textAlign: "center" }}>
                No features found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
