import React, { useState, useEffect } from "react";

export default function AdminActivities() {
  const [activities, setActivities] = useState([]);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [link, setLink] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    const res = await fetch("https://unstopablerundatabse.onrender.com/activities/all");
    const data = await res.json();
    setActivities(data);
  };

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async () => {
    if (!title || !link) return alert("Title and link are required");

    const formData = new FormData();
    if (file) formData.append("image", file);
    formData.append("title", title);
    formData.append("subtitle", subtitle);
    formData.append("link", link);

    setLoading(true);

    if (editingId) {
      // Update activity
      await fetch(`https://unstopablerundatabse.onrender.com/activities/update/${editingId}`, { method: "PUT", body: formData });
    } else {
      // Add activity
      if (!file) return alert("Image is required for new activity");
      await fetch("https://unstopablerundatabse.onrender.com/activities/add", { method: "POST", body: formData });
    }

    setFile(null);
    setTitle("");
    setSubtitle("");
    setLink("");
    setEditingId(null);
    setLoading(false);
    fetchActivities();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this activity?")) return;
    await fetch(`https://unstopablerundatabse.onrender.com/activities/delete/${id}`, { method: "DELETE" });
    fetchActivities();
  };

  const handleEdit = (activity) => {
    setEditingId(activity.id);
    setTitle(activity.title);
    setSubtitle(activity.subtitle);
    setLink(activity.link);
    setFile(null);
  };

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", padding: 20, fontFamily: "Inter, sans-serif" }}>
      <h1 style={{ textAlign: "center", color: "#ff6b00", marginBottom: 30 }}>Admin Panel: Manage Activities</h1>

      <div style={{ 
        display: "flex", 
        flexDirection: "column", 
        gap: 10, 
        marginBottom: 30, 
        background: "#fff", 
        padding: 20, 
        borderRadius: 12, 
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)" 
      }}>
        <input 
          type="text" 
          placeholder="Title" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          style={{ padding: 10, borderRadius: 6, border: "1px solid #ddd" }}
        />
        <input 
          type="text" 
          placeholder="Subtitle" 
          value={subtitle} 
          onChange={(e) => setSubtitle(e.target.value)} 
          style={{ padding: 10, borderRadius: 6, border: "1px solid #ddd" }}
        />
        <input 
          type="text" 
          placeholder="Link" 
          value={link} 
          onChange={(e) => setLink(e.target.value)} 
          style={{ padding: 10, borderRadius: 6, border: "1px solid #ddd" }}
        />
        <input type="file" onChange={handleFileChange} />

        <button 
          onClick={handleSubmit} 
          disabled={loading} 
          style={{ 
            padding: "12px 20px", 
            backgroundColor: "#ff6b00", 
            color: "#fff", 
            border: "none", 
            borderRadius: 6, 
            cursor: "pointer",
            fontWeight: 600
          }}
        >
          {loading ? (editingId ? "Updating..." : "Adding...") : (editingId ? "Update Activity" : "Add Activity")}
        </button>
      </div>

      <h2 style={{ color: "#ff6b00", marginBottom: 15 }}>Existing Activities</h2>

      <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 16 }}>
        {activities.map((a) => (
          <li 
            key={a.id} 
            style={{ 
              display: "flex", 
              alignItems: "center", 
              background: "#fff", 
              padding: 15, 
              borderRadius: 12, 
              boxShadow: "0 1px 6px rgba(0,0,0,0.1)" 
            }}
          >
            <img src={a.image_url} alt={a.title} style={{ width: 100, height: 60, objectFit: "cover", borderRadius: 6, marginRight: 15 }} />
            <div style={{ flex: 1 }}>
              <strong style={{ display: "block", fontSize: 16, color: "#333" }}>{a.title}</strong>
              <p style={{ margin: 2, fontSize: 14, color: "#666" }}>{a.subtitle}</p>
              <small style={{ color: "#ff6b00" }}>{a.link}</small>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button 
                onClick={() => handleEdit(a)} 
                style={{ padding: "6px 12px", background: "#fff3e0", color: "#ff6b00", border: "1px solid #ff6b00", borderRadius: 6, cursor: "pointer" }}
              >
                Edit
              </button>
              <button 
                onClick={() => handleDelete(a.id)} 
                style={{ padding: "6px 12px", background: "#ff6b00", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
