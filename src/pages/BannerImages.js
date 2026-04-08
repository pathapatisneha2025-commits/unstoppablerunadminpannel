import React, { useState, useEffect } from "react";

export default function AdminBanners() {
  const [banners, setBanners] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editingBanner, setEditingBanner] = useState({
    scroll_items: [], // ensure scroll_items exists for new banners
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const res = await fetch(
        "https://unstopablerundatabse.onrender.com/banner/all"
      );
      if (!res.ok) throw new Error("Failed to fetch banners");
      const data = await res.json();
      setBanners(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSave = async () => {
    if (!editingBanner && !file) return;

    const formData = new FormData();
    if (file) formData.append("image", file);
    formData.append("title", editingBanner?.title || "");
    formData.append("description", editingBanner?.description || "");
    formData.append("title_visible", editingBanner?.title_visible || false);
    formData.append(
      "description_visible",
      editingBanner?.description_visible || false
    );
    formData.append("badge_text", editingBanner?.badge_text || "");
    formData.append("badge_visible", editingBanner?.badge_visible || false);
    formData.append("stats_visible", editingBanner?.stats_visible || false);
    formData.append(
      "stat_athletes",
      editingBanner?.stat_athletes || "50K+"
    );
    formData.append(
      "stat_countries",
      editingBanner?.stat_countries || "120+"
    );
    formData.append("stat_rating", editingBanner?.stat_rating || "4.9★");

    // Scroll items
    formData.append(
      "scroll_items",
      JSON.stringify(editingBanner?.scroll_items || [])
    );

    try {
      setLoading(true);

      const url = editingBanner?.id
        ? `https://unstopablerundatabse.onrender.com/banner/update/${editingBanner.id}`
        : "https://unstopablerundatabse.onrender.com/banner/add";

      const method = editingBanner?.id ? "PUT" : "POST";

      const res = await fetch(url, { method, body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Operation failed");

      setFile(null);
      setEditingBanner({ scroll_items: [] }); // reset form safely
      fetchBanners();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this banner?")) return;
    try {
      const res = await fetch(
        `https://unstopablerundatabse.onrender.com/banner/delete/${id}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Delete failed");
      fetchBanners();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEdit = (banner) => {
    // Ensure scroll_items is always an array
    setEditingBanner({
      ...banner,
      scroll_items: Array.isArray(banner.scroll_items) ? banner.scroll_items : [],
    });
    setFile(null);
  };

  const cancelEdit = () => {
    setEditingBanner({ scroll_items: [] }); // reset safely
    setFile(null);
  };

  const toggleFieldVisibility = async (banner, field) => {
    try {
      await fetch(
        `https://unstopablerundatabse.onrender.com/banner/update/${banner.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...banner, [field]: !banner[field] }),
        }
      );
      fetchBanners();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", padding: 20 }}>
      <h1 style={{ textAlign: "center", marginBottom: 20 }}>
        Admin: Manage Banners
      </h1>

      {/* Upload / Update Section */}
      <div
        style={{
          marginBottom: 30,
          border: "1px solid #ddd",
          padding: 20,
          borderRadius: 8,
        }}
      >
        {editingBanner?.id && (
          <p style={{ color: "green", marginBottom: 10 }}>
            Editing banner ID: {editingBanner.id}
          </p>
        )}

        <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ flex: 1 }}
          />
          <button
            onClick={handleSave}
            disabled={loading}
            style={{
              padding: "10px 20px",
              borderRadius: 6,
              border: "none",
              background: editingBanner?.id ? "#007bff" : "#ff6a00",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            {loading ? "Processing..." : editingBanner?.id ? "Update" : "Upload"}
          </button>
          {editingBanner?.id && (
            <button
              onClick={cancelEdit}
              style={{
                padding: "10px 20px",
                borderRadius: 6,
                border: "1px solid #ccc",
                background: "#fff",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          )}
        </div>

        {/* Title, Description, Badge, Stats, Scroll Items */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <input
            type="text"
            placeholder="Banner Title"
            value={editingBanner?.title || ""}
            onChange={(e) =>
              setEditingBanner({ ...editingBanner, title: e.target.value })
            }
            style={{ padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
          />
          <label>
            <input
              type="checkbox"
              checked={editingBanner?.title_visible || false}
              onChange={(e) =>
                setEditingBanner({
                  ...editingBanner,
                  title_visible: e.target.checked,
                })
              }
            />{" "}
            Show Title
          </label>

          <textarea
            placeholder="Banner Description"
            value={editingBanner?.description || ""}
            onChange={(e) =>
              setEditingBanner({
                ...editingBanner,
                description: e.target.value,
              })
            }
            rows={3}
            style={{ padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
          />
          <label>
            <input
              type="checkbox"
              checked={editingBanner?.description_visible || false}
              onChange={(e) =>
                setEditingBanner({
                  ...editingBanner,
                  description_visible: e.target.checked,
                })
              }
            />{" "}
            Show Description
          </label>

          <input
            type="text"
            placeholder="Badge Text"
            value={editingBanner?.badge_text || ""}
            onChange={(e) =>
              setEditingBanner({ ...editingBanner, badge_text: e.target.value })
            }
            style={{ padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
          />
          <label>
            <input
              type="checkbox"
              checked={editingBanner?.badge_visible || false}
              onChange={(e) =>
                setEditingBanner({
                  ...editingBanner,
                  badge_visible: e.target.checked,
                })
              }
            />{" "}
            Show Badge
          </label>

          <label>
            <input
              type="checkbox"
              checked={editingBanner?.stats_visible || false}
              onChange={(e) =>
                setEditingBanner({
                  ...editingBanner,
                  stats_visible: e.target.checked,
                })
              }
            />{" "}
            Show Stats
          </label>

          {/* Scroll Items */}
         {/* Scroll Items */}
<div style={{ marginTop: 10 }}>
  <label style={{ fontWeight: 600 }}>Scrolling Info Bar Items</label>
  {(editingBanner?.scroll_items || []).map((item, idx) => (
    <div
      key={idx}
      style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}
    >
      <input
        type="text"
        placeholder={`Item ${idx + 1}`}
        value={item}
        onChange={(e) => {
          const newItems = [...(editingBanner.scroll_items || [])];
          newItems[idx] = e.target.value;
          setEditingBanner({ ...editingBanner, scroll_items: newItems });
        }}
        style={{
          flex: 1,
          padding: 8,
          borderRadius: 4,
          border: "1px solid #ccc",
        }}
      />
      <button
        type="button"
        onClick={() => {
          const newItems = [...(editingBanner.scroll_items || [])];
          newItems.splice(idx, 1);
          setEditingBanner({ ...editingBanner, scroll_items: newItems });
        }}
        style={{
          padding: "6px 12px",
          borderRadius: 4,
          border: "1px solid #ccc",
          background: "#f5f5f5",
          cursor: "pointer",
        }}
      >
        Remove
      </button>
    </div>
  ))}

  <button
    type="button"
    onClick={() =>
      setEditingBanner({
        ...editingBanner,
        scroll_items: [...(editingBanner.scroll_items || []), ""],
      })
    }
    style={{
      marginTop: 6,
      padding: "6px 12px",
      borderRadius: 4,
      border: "1px solid #ccc",
      cursor: "pointer",
      background: "#f5f5f5",
    }}
  >
    + Add Item
  </button>
</div>
        </div>
      </div>

     
      {/* Table */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f5f5f5" }}>
            <th style={{ padding: 10, border: "1px solid #ddd" }}>#</th>
            <th style={{ padding: 10, border: "1px solid #ddd" }}>Banner</th>
            <th style={{ padding: 10, border: "1px solid #ddd" }}>Title</th>
            <th style={{ padding: 10, border: "1px solid #ddd" }}>Description</th>
            <th style={{ padding: 10, border: "1px solid #ddd" }}>Badge</th>
           <th style={{ padding: 10, border: "1px solid #ddd" }}>Scroll Items</th>

            <th style={{ padding: 10, border: "1px solid #ddd" }}>Stats Visible</th>
            <th style={{ padding: 10, border: "1px solid #ddd" }}>Title Visible</th>
            <th style={{ padding: 10, border: "1px solid #ddd" }}>Description Visible</th>
            <th style={{ padding: 10, border: "1px solid #ddd" }}>Badge Visible</th>
            <th style={{ padding: 10, border: "1px solid #ddd" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {banners.map((banner, index) => (
            <tr key={banner.id}>
              <td style={{ padding: 10, border: "1px solid #ddd" }}>{index + 1}</td>
              <td style={{ padding: 10, border: "1px solid #ddd" }}>
                <img
                  src={banner.image_url}
                  alt="banner"
                  style={{ height: 60, borderRadius: 4 }}
                />
              </td>
              <td style={{ padding: 10, border: "1px solid #ddd" }}>{banner.title}</td>
              <td style={{ padding: 10, border: "1px solid #ddd" }}>{banner.description}</td>
              <td style={{ padding: 10, border: "1px solid #ddd" }}>{banner.badge_text}</td>
               <td style={{ padding: 10, border: "1px solid #ddd" }}>
    {banner.scroll_items?.length > 0 ? banner.scroll_items.join(" , ") : "—"}
  </td>
              <td style={{ padding: 10, border: "1px solid #ddd" }}>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={banner.stats_visible}
                    onChange={() => toggleFieldVisibility(banner, "stats_visible")}
                  />
                  <span className="slider round"></span>
                </label>
              </td>
              <td style={{ padding: 10, border: "1px solid #ddd" }}>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={banner.title_visible}
                    onChange={() => toggleFieldVisibility(banner, "title_visible")}
                  />
                  <span className="slider round"></span>
                </label>
              </td>
              <td style={{ padding: 10, border: "1px solid #ddd" }}>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={banner.description_visible}
                    onChange={() =>
                      toggleFieldVisibility(banner, "description_visible")
                    }
                  />
                  <span className="slider round"></span>
                </label>
              </td>
              <td style={{ padding: 10, border: "1px solid #ddd" }}>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={banner.badge_visible}
                    onChange={() => toggleFieldVisibility(banner, "badge_visible")}
                  />
                  <span className="slider round"></span>
                </label>
              </td>
              <td style={{ padding: 10, border: "1px solid #ddd" }}>
                <button
                  onClick={() => handleEdit(banner)}
                  style={{
                    background: "#007bff",
                    color: "#fff",
                    border: "none",
                    borderRadius: 4,
                    padding: "6px 12px",
                    marginRight: 6,
                    cursor: "pointer",
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(banner.id)}
                  style={{
                    background: "red",
                    color: "#fff",
                    border: "none",
                    borderRadius: 4,
                    padding: "6px 12px",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {banners.length === 0 && (
            <tr>
              <td colSpan={10} style={{ padding: 20, textAlign: "center" }}>
                No banners found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <style>{`
        .switch {
          position: relative;
          display: inline-block;
          width: 50px;
          height: 24px;
        }
        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }
        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: 0.4s;
          border-radius: 24px;
        }
        .slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: 0.4s;
          border-radius: 50%;
        }
        input:checked + .slider {
          background-color: #ff6a00;
        }
        input:checked + .slider:before {
          transform: translateX(26px);
        }
      `}</style>
    </div>
  );
}