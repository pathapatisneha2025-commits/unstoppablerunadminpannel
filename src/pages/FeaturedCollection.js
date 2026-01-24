import React, { useState, useEffect } from "react";

const API_URL = "https://unstopablerundatabse.onrender.com/category"; // Backend API

export default function AdminFeaturedCollections() {
  const [collections, setCollections] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    tag: "",
    title: "",
    subtitle: "",
    path: "/shop",
    image: null,
  });

  // Fetch all collections
  const fetchCollections = async () => {
    try {
      const res = await fetch(`${API_URL}/all`);
      const data = await res.json();
      setCollections(data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    if (e.target.name === "image") {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  // Add new collection
  const handleAdd = async () => {
  

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null) data.append(key, formData[key]);
    });

    try {
     const res = await fetch(`${API_URL}/add`, {
  method: "POST",
  body: data,
});

      if (!res.ok) throw new Error("Failed to add collection");
      fetchCollections();
      setFormData({ id: "", tag: "", title: "", subtitle: "", path: "/shop", image: null });
    } catch (err) {
      console.error("Add error:", err);
    }
  };

  // Load collection into form for editing
  const handleEdit = (c) => {
    setFormData({
      id: c.id,
      tag: c.tag,
      title: c.title,
      subtitle: c.subtitle,
      path: c.path,
      image: null,
    });
  };

  // Update collection
  const handleUpdate = async () => {
    if (!formData.id) return alert("Select a collection to update");

    const data = new FormData();
    data.append("tag", formData.tag);
    data.append("title", formData.title);
    data.append("subtitle", formData.subtitle);
    data.append("path", formData.path);
    if (formData.image) data.append("image", formData.image);

    try {
      const res = await fetch(`${API_URL}/${formData.id}`, {
        method: "PUT",
        body: data,
      });
      if (!res.ok) throw new Error("Failed to update collection");
      fetchCollections();
      setFormData({ id: "", tag: "", title: "", subtitle: "", path: "/shop", image: null });
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  // Delete collection
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this collection?")) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete collection");
      fetchCollections();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Admin: Featured Collections</h1>

      {/* Form */}
      <div style={formStyle}>
        <input name="tag" placeholder="Tag" value={formData.tag} onChange={handleChange} style={inputStyle} />
        <input name="title" placeholder="Title" value={formData.title} onChange={handleChange} style={inputStyle} />
        <input name="subtitle" placeholder="Subtitle" value={formData.subtitle} onChange={handleChange} style={inputStyle} />
        <input name="path" placeholder="Path" value={formData.path} onChange={handleChange} style={inputStyle} />
        <input type="file" name="image" onChange={handleChange} style={inputStyle} />
        <button onClick={handleAdd} style={buttonStyle}>Add</button>
        <button onClick={handleUpdate} style={{ ...buttonStyle, background: "#111" }}>Update</button>
      </div>

      {/* Collections Table */}
      <table style={tableStyle}>
        <thead style={theadStyle}>
          <tr>
            <th style={thStyle}>Tag</th>
            <th style={thStyle}>Title</th>
            <th style={thStyle}>Subtitle</th>
            <th style={thStyle}>Image</th>
            <th style={thStyle}>Path</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {collections.map((c) => (
            <tr key={c.id} style={{ borderBottom: "1px solid #eee" }}>
              <td style={tdStyle}>{c.id}</td>
              <td style={tdStyle}>{c.tag}</td>
              <td style={tdStyle}>{c.title}</td>
              <td style={tdStyle}>{c.subtitle}</td>
              <td style={tdStyle}><img src={c.image_url} alt={c.title} width="50" /></td>
              <td style={tdStyle}>{c.path}</td>
              <td style={tdStyle}>
                <button onClick={() => handleEdit(c)} style={{ ...buttonStyle, marginBottom: "5px" }}>Edit</button>
                <button onClick={() => handleDelete(c.id)} style={{ ...buttonStyle, background: "red" }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ---------------- Styles ----------------
const containerStyle = { fontFamily: "Arial, sans-serif", padding: "40px", background: "#fffaf5", minHeight: "100vh" };
const titleStyle = { color: "#ff6a00", marginBottom: "30px" };
const formStyle = { display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "30px", background: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 2px 6px rgba(0,0,0,0.1)" };
const inputStyle = { padding: "8px", borderRadius: "6px", border: "1px solid #ccc", flex: "1", minWidth: "120px" };
const buttonStyle = { padding: "10px 20px", borderRadius: "6px", border: "none", background: "#ff6a00", color: "#fff", cursor: "pointer" };
const tableStyle = { width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: "12px", overflow: "hidden", boxShadow: "0 2px 6px rgba(0,0,0,0.1)" };
const theadStyle = { background: "#ff6a00", color: "#fff" };
const thStyle = { padding: "12px", textAlign: "left" };
const tdStyle = { padding: "12px" };
