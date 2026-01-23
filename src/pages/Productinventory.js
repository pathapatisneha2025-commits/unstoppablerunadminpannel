import React, { useState, useEffect } from "react";

const BASE_URL = "https://unstopablerundatabse.onrender.com/products";

export default function AdminInventory() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [newCategoryImage, setNewCategoryImage] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filterCategory, setFilterCategory] = useState("All");
  const [alerts, setAlerts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const emptyProduct = {
    name: "",
    subcategory: "",
    mainImage: null,
    thumbnails: [],
    variants: [{ size: "", color: "", price: "", stock: "" }],
  };
  const [product, setProduct] = useState(emptyProduct);

  const lowStockThreshold = 20;
  const criticalStockThreshold = 5;

  // Fetch categories and products
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${BASE_URL}/all`);
        const data = await res.json();
        const uniqueCategories = [
          ...new Set(data.map((p) => p.category)),
        ].map((name, idx) => ({
          id: idx + 1,
          name,
          products: data.filter((p) => p.category === name),
          image: null,
        }));
        setCategories(uniqueCategories);
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Flatten all products
  const allProducts = categories.flatMap((c) =>
    c.products.map((p) => ({ ...p, categoryName: c.name }))
  );

  const displayedProducts =
    filterCategory === "All"
      ? allProducts
      : allProducts.filter((p) => p.categoryName === filterCategory);

  // Generate stock alerts
  useEffect(() => {
    const newAlerts = [];
    displayedProducts.forEach((p) => {
      p.variants?.forEach((v) => {
        const stockStatus = getStockStatus(v);
        if (stockStatus.color !== "green") {
          newAlerts.push({
            product: p.name,
            variant: `${v.size}/${v.color}`,
            message: stockStatus.message,
            color: stockStatus.color,
          });
        }
      });
    });
    setAlerts(newAlerts);
  }, [displayedProducts]);

  // Category functions
  const handleCategoryImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setNewCategoryImage({ file, url: URL.createObjectURL(file) });
  };

  const addCategory = () => {
    if (!newCategory.trim()) return alert("Enter category name");
    setCategories([
      ...categories,
      {
        id: Date.now(),
        name: newCategory,
        products: [],
        image: newCategoryImage?.url || null,
      },
    ]);
    setNewCategory("");
    setNewCategoryImage(null);
  };

  const handleSetActiveCategory = (cat) => {
    setProduct(emptyProduct);
    setActiveCategory(cat);
    setEditingProduct(null);
    setShowModal(true);
  };

  // Product image functions
  const handleMainImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setProduct({ ...product, mainImage: { file, url: URL.createObjectURL(file) } });
  };

  const handleThumbnails = (e) => {
    const files = Array.from(e.target.files);
    const thumbs = files.map((file) => ({ file, url: URL.createObjectURL(file) }));
    setProduct({ ...product, thumbnails: [...product.thumbnails, ...thumbs] });
  };

  // Variant functions
  const addVariant = () => {
    setProduct({
      ...product,
      variants: [...product.variants, { size: "", color: "", price: "", stock: "" }],
    });
  };

  const updateVariant = (i, field, value) => {
    const variants = [...product.variants];
    variants[i][field] = value;
    setProduct({ ...product, variants });
  };

  // Save product
  const saveProduct = async () => {
    if (!activeCategory) return alert("Select a category");
    if (!product.name.trim()) return alert("Enter product name");

    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("category", activeCategory.name);
    formData.append("subcategory", product.subcategory || "");
    formData.append("variants", JSON.stringify(product.variants));

    if (product.mainImage?.file) formData.append("mainImage", product.mainImage.file);
    product.thumbnails.forEach((thumb) => {
      if (thumb.file) formData.append("thumbnails", thumb.file);
    });

    try {
      setLoading(true);
      let res;
      if (editingProduct) {
        res = await fetch(`${BASE_URL}/update/${editingProduct.id}`, {
          method: "PUT",
          body: formData,
        });
      } else {
        res = await fetch(`${BASE_URL}/add`, {
          method: "POST",
          body: formData,
        });
      }

      const data = await res.json();
      if (res.ok) {
        alert(editingProduct ? "Product updated!" : "Product added!");
        window.location.reload();
      } else {
        console.error("Backend error:", data);
        alert("Error: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      alert("Error saving product");
    } finally {
      setLoading(false);
    }
  };

  // Delete product
  const deleteProduct = async (productId) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      setLoading(true);
      await fetch(`${BASE_URL}/delete/${productId}`, { method: "DELETE" });
      window.location.reload();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Edit product
  const updateProduct = (prod) => {
    const cat = categories.find((c) => c.name === prod.category);
    setActiveCategory(cat);
    setProduct({
      name: prod.name,
      subcategory: prod.subcategory || "",
      mainImage: { url: prod.main_image },
      thumbnails: prod.thumbnails ? prod.thumbnails.map((t) => ({ url: t })) : [],
      variants: prod.variants || [{ size: "", color: "", price: "", stock: "" }],
    });
    setEditingProduct(prod);
    setShowModal(true);
  };

  // Stock status
  const getStockStatus = (variant) => {
    const stock = Number(variant.stock) || 0;
    if (stock <= criticalStockThreshold)
      return { color: "red", message: "⚠️ Reorder immediately!" };
    if (stock <= lowStockThreshold)
      return { color: "orange", message: "⚠️ Low stock" };
    return { color: "green", message: "In Stock" };
  };

  return (
    <div className="admin">
      <h1>Inventory Management</h1>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="alerts-container">
          {alerts.map((a, i) => (
            <div
              key={i}
              style={{
                background: a.color,
                padding: "8px",
                marginBottom: "6px",
                borderRadius: "6px",
                color: "#000",
                fontWeight: "bold",
              }}
            >
              ⚠️ {a.product} ({a.variant}) - {a.message}
            </div>
          ))}
        </div>
      )}

      {/* Add Category */}
      <div className="add-category-section">
        <div className="add-category">
          <input
            placeholder="Add New Category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <label className="custom-upload">
            Upload Image
            <input type="file" onChange={handleCategoryImage} style={{ display: "none" }} />
          </label>
          {newCategoryImage?.url && (
            <img src={newCategoryImage.url} alt="preview" className="category-preview" />
          )}
          <button className="add-category-btn" onClick={addCategory}>➕ Add</button>
        </div>
      </div>

      {/* Filter */}
      <div className="category-filter">
        <label>Filter by Category: </label>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="All">All</option>
          {categories.map((c) => (
            <option key={c.id} value={c.name}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Category Cards */}
      <div className="category-grid">
        {categories.map((cat) => (
          <div key={cat.id} className="category-card" onClick={() => handleSetActiveCategory(cat)}>
            {cat.image && <img src={cat.image} alt={cat.name} className="category-img" />}
            <div className="category-name">{cat.name}</div>
          </div>
        ))}
      </div>

      {/* Products Table */}
      <h2>All Products</h2>
      <div className="table-wrapper">
        <table className="product-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Name</th>
              <th>Main Image</th>
              <th>Thumbnails</th>
              <th>Variants</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedProducts.map((p) => (
              <tr key={p.id}>
                <td>{p.categoryName}</td>
                <td>{p.name}</td>
                <td>{p.main_image && <img src={p.main_image} className="mini-main" alt="main" />}</td>
                <td className="thumbs">
                  {p.thumbnails?.map((t, j) => <img key={j} src={t} alt="thumb" />)}
                </td>
                <td>
                  {p.variants?.map((v, i) => {
                    const stockStatus = getStockStatus(v);
                    return (
                      <div key={i} className="variant-tag" style={{ color: stockStatus.color, fontWeight: "bold" }} title={stockStatus.message}>
                        {v.size}/{v.color} - ₹{v.price} - Stock: {v.stock} {stockStatus.color !== "green" && stockStatus.message}
                      </div>
                    );
                  })}
                </td>
                <td className="action-cells">
                  <button className="update-btn" onClick={() => updateProduct(p)}>Edit</button>
                  <button className="delete-btn" onClick={() => deleteProduct(p.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingProduct ? "Edit Product" : `Add Product to ${activeCategory?.name}`}</h3>
              <button className="close-x" onClick={() => setShowModal(false)}>&times;</button>
            </div>

            {/* Product Info */}
            <div className="modal-section">
              <input
                className="full-input"
                placeholder="Product Name"
                value={product.name}
                onChange={(e) => setProduct({ ...product, name: e.target.value })}
              />
              <input
                className="full-input"
                placeholder="Subcategory"
                value={product.subcategory || ""}
                onChange={(e) => setProduct({ ...product, subcategory: e.target.value })}
              />
            </div>

            {/* Images */}
            <div className="modal-section">
              <label className="custom-upload">
                Upload Main Image
                <input type="file" onChange={handleMainImage} style={{ display: "none" }} />
              </label>
              {product.mainImage?.url && <img src={product.mainImage.url} className="form-main-img" alt="main" />}
              <label className="custom-upload">
                Upload Thumbnails
                <input type="file" multiple onChange={handleThumbnails} style={{ display: "none" }} />
              </label>
              <div className="thumb-preview">
                {product.thumbnails.map((t, i) => (
                  <img key={i} src={t.url} className="form-thumb-img" alt={`thumb-${i}`} />
                ))}
              </div>
            </div>

            {/* Variants */}
            <div className="modal-section">
              <h4 className="section-title">Variants</h4>
              {product.variants.map((v, i) => (
                <div className="variant-row" key={i}>
                  <input placeholder="Size" value={v.size} onChange={(e) => updateVariant(i, "size", e.target.value)} />
                  <input placeholder="Color" value={v.color} onChange={(e) => updateVariant(i, "color", e.target.value)} />
                  <input placeholder="Price" type="number" value={v.price} onChange={(e) => updateVariant(i, "price", e.target.value)} />
                  <input placeholder="Stock" type="number" value={v.stock} onChange={(e) => updateVariant(i, "stock", e.target.value)} />
                </div>
              ))}
              <button className="add-variant-btn" onClick={addVariant}>+ Add Variant</button>
            </div>

            <button className="save-btn" onClick={saveProduct}>
              {editingProduct ? "Update Product" : "Save Product"}
            </button>
          </div>
        </div>
      )}

    

     
     


      {/* CSS */}
      <style>{`
        :root {
          --orange: #ff7a00;
          --orange-dark: #e66a00;
          --orange-soft: #fff3e8;
          --border: #e5e7eb;
          --text: #1f2937;
        }
        .admin {padding:16px; max-width:1200px; margin:0 auto; font-family:Inter,sans-serif; min-height:100vh; color:var(--text);}
        h1 {text-align:center; color:var(--orange); font-size:1.8rem; font-weight:700; margin-bottom:20px;}
        .alerts-container div {border-left:6px solid #000; margin-bottom:6px; padding:8px; font-weight:bold;}
        .add-category {display:flex; gap:10px; margin-bottom:20px;}
        .add-category input {flex:1; padding:12px; border-radius:10px; border:1px solid var(--border); font-size:15px;}
        .add-category-btn {background:var(--orange); color:#fff; border:none; padding:0 18px; border-radius:10px; font-weight:600; cursor:pointer;}
        .add-category-btn:hover {background:var(--orange-dark);}
        .category-grid {display:grid; grid-template-columns:repeat(auto-fill,minmax(140px,1fr)); gap:12px; margin-bottom:25px;}
        .category-card {background:#fff; border:1px solid var(--border); padding:16px; border-radius:14px; text-align:center; font-weight:600; cursor:pointer; transition:.2s;}
        .category-card:hover {background:var(--orange-soft); border-color:var(--orange);}
        .category-filter {margin-bottom:15px;}
        .category-filter select {padding:8px 12px; border-radius:8px; border:1px solid var(--border);}
        .category-img { width:100%; height:100px; object-fit:cover; border-radius:8px; margin-bottom:10px; }
        .category-name { font-weight:600; font-size:14px; }
        .category-preview { width:80px; height:80px; object-fit:cover; border-radius:6px; margin:6px 0; border:1px solid var(--border);}
        .table-wrapper {width:100%; overflow-x:auto; background:#fff; border-radius:14px; border:1px solid var(--border);}
        .product-table {width:100%; min-width:900px; border-collapse:collapse;}
        .product-table th {background:var(--orange-soft); color:#000; font-weight:600;}
        .product-table th, .product-table td {padding:12px; border-bottom:1px solid var(--border); font-size:14px;}
        .mini-main {width:45px; height:45px; border-radius:8px; object-fit:cover; border:1px solid var(--border);}
        .thumbs img {width:32px; height:32px; margin-right:4px; border-radius:6px; object-fit:cover; border:1px solid var(--border);}
        .variant-tag {background:#fff; border:1px solid var(--border); padding:4px 8px; border-radius:6px; font-size:12px; margin:3px 0; display:inline-block;}
        .action-cells {display:flex; gap:6px;}
        .update-btn {background:var(--orange); color:#fff; border:none; padding:6px 10px; border-radius:8px; font-size:13px; cursor:pointer;}
        .delete-btn {background:#fff; color:#dc2626; border:1px solid #dc2626; padding:6px 10px; border-radius:8px; font-size:13px; cursor:pointer;}
        .modal-overlay {position:fixed; inset:0; background:rgba(0,0,0,0.55); display:flex; justify-content:center; align-items:center; z-index:9999;}
.modal-box {
  background: #fff;
  width: 95%;
  max-width: 650px;
  max-height: 85vh;
  padding: 22px;
  border-radius: 18px;
  overflow-y: auto;
  box-sizing: border-box; /* Important */
}

.variant-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* 4 columns */
  gap: 6px; /* smaller gap */
  background: #fff7ed;
  padding: 8px; /* smaller padding */
  border-radius: 8px;
  margin-bottom: 8px;
  box-sizing: border-box;
}

.variant-row input {
  padding: 6px; /* smaller input */
  border-radius: 6px;
  border: 1px solid var(--border);
  font-size: 13px; /* smaller font */
  width: 100%;
}


/* Responsive */
@media (max-width: 768px) {
  .variant-row {
    grid-template-columns: 1fr 1fr; /* Two columns instead of 4 */
  }
}

@media (max-width: 480px) {
  .variant-row {
    grid-template-columns: 1fr; /* Stack inputs vertically on very small screens */
  }
}
        .modal-header h3 {color:var(--orange); font-weight:700;}
        .close-x {font-size:28px; background:none; border:none; cursor:pointer;}
        .full-input {width:100%; padding:12px; border-radius:10px; border:1px solid var(--border); margin-bottom:15px;}
        .custom-upload {border:2px dashed var(--orange); padding:12px; border-radius:12px; text-align:center; color:var(--orange); cursor:pointer; font-weight:600; margin-bottom:10px; display:inline-block;}
      
        .add-variant-btn, .save-btn {width:100%; border-radius:10px; font-weight:600; margin-top:10px;}
        .add-variant-btn {border:2px dashed var(--orange); padding:12px; background:#fff; color:var(--orange);}
        .save-btn {padding:14px; background:var(--orange); color:#fff; border:none; font-size:16px;}
        .form-main-img {width:80px; height:80px; object-fit:cover; border-radius:8px; margin-top:10px; border:1px solid var(--border);}
        .form-thumb-img {width:50px; height:50px; object-fit:cover; border-radius:6px; margin-right:6px; margin-top:6px; border:1px solid var(--border);}
        @media(max-width:768px){.variant-row{grid-template-columns:1fr 1fr}.action-cells{flex-direction:column}}
      `}</style>
    </div>
  );
}
