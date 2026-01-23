import React, { useState, useEffect } from "react";

export default function AdminBanners() {
  const [banners, setBanners] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);

  // ---------------- Fetch banners ----------------
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

  // ---------------- File change ----------------
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // ---------------- Upload banner ----------------
  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      setLoading(true);

      const res = await fetch(
        "https://unstopablerundatabse.onrender.com/banner/add",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      setFile(null);
      fetchBanners();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Update banner ----------------
  const handleUpdate = async () => {
    if (!file || !editingBanner) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      setLoading(true);

      const res = await fetch(
        `https://unstopablerundatabse.onrender.com/banner/update/${editingBanner.id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");

      setFile(null);
      setEditingBanner(null);
      fetchBanners();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Delete banner ----------------
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

  // ---------------- Edit banner ----------------
  const handleEdit = (banner) => {
    setEditingBanner(banner);
    setFile(null);
  };

  // ---------------- Cancel edit ----------------
  const cancelEdit = () => {
    setEditingBanner(null);
    setFile(null);
  };

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", padding: 20 }}>
      <h1 style={{ textAlign: "center", marginBottom: 20 }}>
        Admin: Manage Banners
      </h1>

      {/* Upload / Update section */}
      <div style={{ marginBottom: 20 }}>
        {editingBanner && (
          <p style={{ color: "green", marginBottom: 8 }}>
            Editing banner ID: {editingBanner.id}
          </p>
        )}

        <div style={{ display: "flex", gap: 10 }}>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ flex: 1 }}
          />

          <button
            onClick={editingBanner ? handleUpdate : handleUpload}
            disabled={!file || loading}
            style={{
              padding: "10px 20px",
              borderRadius: 6,
              border: "none",
              background: editingBanner ? "#007bff" : "#ff6a00",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            {loading
              ? "Processing..."
              : editingBanner
              ? "Update"
              : "Upload"}
          </button>

          {editingBanner && (
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
      </div>

      {/* Table */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f5f5f5" }}>
            <th style={{ padding: 10, border: "1px solid #ddd" }}>#</th>
            <th style={{ padding: 10, border: "1px solid #ddd" }}>Banner</th>
            <th style={{ padding: 10, border: "1px solid #ddd" }}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {banners.map((banner, index) => (
            <tr key={banner.id}>
              <td style={{ padding: 10, border: "1px solid #ddd" }}>
                {index + 1}
              </td>

              <td style={{ padding: 10, border: "1px solid #ddd" }}>
                <img
                  src={banner.image_url}
                  alt="banner"
                  style={{ height: 60, borderRadius: 4 }}
                />
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
              <td colSpan={3} style={{ padding: 20, textAlign: "center" }}>
                No banners found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
