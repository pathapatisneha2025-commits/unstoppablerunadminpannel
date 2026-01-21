import React, { useState, useEffect } from "react";
import { LuPlus, LuTrash2, LuPencil, LuX, LuImage, LuSearch } from "react-icons/lu";

export default function ProductInventory() {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);

  const emptyProduct = {
    name: "",
    category: "Men",
    subcategory: "Shoes",
    price: "",
    stock: "",
    images: [],
  };

  const [formProduct, setFormProduct] = useState(emptyProduct);

  const categories = {
    Men: ["Shoes", "Tops", "Bottoms", "Outerwear"],
    Women: ["Shoes", "Tops", "Bottoms", "Outerwear"],
    Accessories: ["Tech", "Ger", "Equipment", "Bags"],
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("https://unstopablerundatabse.onrender.com/products/all");
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setProducts(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleImageChange = (e) => {
    setFormProduct({ ...formProduct, images: Array.from(e.target.files) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", formProduct.name);
      formData.append("category", formProduct.category);
      formData.append("subcategory", formProduct.subcategory);
      formData.append("price", formProduct.price);
      formData.append("stock", formProduct.stock);

      formProduct.images.forEach((img) => {
        if (img instanceof File) formData.append("images", img);
      });

      if (editProduct) {
        const existingUrls = formProduct.images.filter((img) => typeof img === "string");
        formData.append("existingImages", JSON.stringify(existingUrls));
      }

      let url = editProduct 
        ? `https://unstopablerundatabse.onrender.com/products/update/${editProduct.id}`
        : "https://unstopablerundatabse.onrender.com/products/add";
      let method = editProduct ? "PUT" : "POST";

      const res = await fetch(url, { method, body: formData });
      if (!res.ok) throw new Error("Operation failed");

      const result = await res.json();
      if (editProduct) {
        setProducts(products.map((p) => (p.id === editProduct.id ? result.product : p)));
      } else {
        setProducts([...products, result.product]);
      }

      setShowModal(false);
      setEditProduct(null);
      setFormProduct(emptyProduct);
    } catch (err) {
      console.error(err);
      alert("Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      const res = await fetch(`https://unstopablerundatabse.onrender.com/products/delete/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    <div className="admin-container">
      <main className="main-content">
        <header className="admin-header">
          <div>
            <h1>Product Inventory</h1>
            <p className="breadcrumb">Manage your product catalog and stock levels</p>
          </div>

          <div className="header-actions">
            <div className="search-box">
              <LuSearch color="#94A3B8" />
              <input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <button
              className="add-btn"
              onClick={() => {
                setEditProduct(null);
                setFormProduct(emptyProduct);
                setShowModal(true);
              }}
            >
              <LuPlus /> Add Product
            </button>
          </div>
        </header>

        <div className="data-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Category</th>
                <th>Subcategory</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className="product-info-cell">
                      <div className="product-image">
                        {product.images?.length ? (
                          <img src={product.images[0]} alt={product.name} />
                        ) : (
                          <LuImage size={18} />
                        )}
                      </div>
                      <span className="product-name-text">{product.name}</span>
                    </div>
                  </td>
                  <td>{product.category}</td>
                  <td>{product.subcategory}</td>
                  <td className="price-text">${parseFloat(product.price).toFixed(2)}</td>
                  <td>{product.stock}</td>
                  <td>
                    <span className={`status-pill ${product.stock > 0 ? "in-stock" : "out-of-stock"}`}>
                      {product.stock > 0 ? "In Stock" : "Out of Stock"}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="icon-btn edit-trigger"
                        onClick={() => {
                          setEditProduct(product);
                          setFormProduct({ ...product, images: product.images || [] });
                          setShowModal(true);
                        }}
                      >
                        <LuPencil size={16} />
                      </button>
                      <button 
                        className="icon-btn delete-trigger"
                        onClick={() => handleDelete(product.id)}
                      >
                        <LuTrash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Modal remains largely the same but with refined CSS classes */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editProduct ? "Edit Product" : "Add New Product"}</h2>
              <button className="close-modal" onClick={() => setShowModal(false)}><LuX /></button>
            </div>
            <form className="modal-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Product Name</label>
                <input
                  value={formProduct.name}
                  onChange={(e) => setFormProduct({ ...formProduct, name: e.target.value })}
                  placeholder="e.g. Wireless Headphones"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                   <label>Category</label>
                   <select
                    value={formProduct.category}
                    onChange={(e) => setFormProduct({
                        ...formProduct,
                        category: e.target.value,
                        subcategory: categories[e.target.value][0]
                      })}
                    >
                    {Object.keys(categories).map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                   </select>
                </div>
                <div className="form-group">
                   <label>Subcategory</label>
                   <select
                    value={formProduct.subcategory}
                    onChange={(e) => setFormProduct({ ...formProduct, subcategory: e.target.value })}
                    >
                    {categories[formProduct.category].map((sub) => <option key={sub} value={sub}>{sub}</option>)}
                   </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Price ($)</label>
                  <input
                    type="number"
                    value={formProduct.price}
                    onChange={(e) => setFormProduct({ ...formProduct, price: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Stock Quantity</label>
                  <input
                    type="number"
                    value={formProduct.stock}
                    onChange={(e) => setFormProduct({ ...formProduct, stock: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Product Images</label>
                <input type="file" multiple onChange={handleImageChange} className="file-input" />
              </div>
              <button className="save-btn" type="submit">
                {editProduct ? "Update Product" : "Add Product"}
              </button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .admin-container { 
          background: #FFFFFF; 
          min-height: 100vh; 
          font-family: 'Inter', sans-serif; 
          color: #1E293B;
        }

        .main-content { padding: 40px; max-width: 1400px; margin: 0 auto; }

        .admin-header { 
          display: flex; 
          justify-content: space-between; 
          align-items: flex-start; 
          margin-bottom: 32px; 
        }

        .admin-header h1 { font-size: 28px; font-weight: 700; margin-bottom: 4px; }
        .breadcrumb { color: #64748B; font-size: 14px; }

        .header-actions { display: flex; gap: 16px; align-items: center; }

        .search-box { 
          background: #F8FAFC; 
          border: 1px solid #E2E8F0; 
          border-radius: 10px; 
          display: flex; 
          align-items: center; 
          padding: 0 12px; 
          width: 300px; 
          transition: border-color 0.2s;
        }
        .search-box:focus-within { border-color: #FF6B00; }
        .search-box input { 
          background: transparent; 
          border: none; 
          padding: 10px 8px; 
          outline: none; 
          width: 100%; 
          font-size: 14px; 
        }

        .add-btn { 
          background: #FF6B00; 
          color: white; 
          border: none; 
          padding: 12px 20px; 
          border-radius: 10px; 
          font-weight: 600; 
          cursor: pointer; 
          display: flex; 
          align-items: center; 
          gap: 8px; 
          transition: opacity 0.2s;
        }
        .add-btn:hover { opacity: 0.9; }

        /* Table Styling matching RUNN Screenshot */
        .data-table-container { 
          background: white; 
          border-radius: 12px; 
          border: 1px solid #F1F5F9; 
          overflow: hidden;
        }

        .admin-table { width: 100%; border-collapse: collapse; }
        .admin-table th { 
          background: #FFFFFF; 
          padding: 16px; 
          text-align: left; 
          font-size: 12px; 
          font-weight: 600; 
          color: #64748B; 
          text-transform: uppercase; 
          letter-spacing: 0.05em;
          border-bottom: 1px solid #F1F5F9;
        }

        .admin-table td { 
          padding: 16px; 
          border-bottom: 1px solid #F1F5F9; 
          font-size: 14px; 
          vertical-align: middle;
        }

        .product-info-cell { display: flex; align-items: center; gap: 12px; }
        .product-image { 
          width: 40px; 
          height: 40px; 
          background: #F8FAFC; 
          border-radius: 8px; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          overflow: hidden;
          border: 1px solid #E2E8F0;
        }
        .product-image img { width: 100%; height: 100%; object-fit: cover; }
        .product-name-text { font-weight: 500; color: #0F172A; }

        .price-text { font-weight: 700; color: #0F172A; }

        .status-pill { 
          padding: 4px 12px; 
          border-radius: 100px; 
          font-size: 12px; 
          font-weight: 600; 
        }
        .status-pill.in-stock { background: #DCFCE7; color: #15803D; }
        .status-pill.out-of-stock { background: #FEE2E2; color: #B91C1C; }

        .action-buttons { display: flex; gap: 10px; }
        .icon-btn { 
          background: none; 
          border: none; 
          cursor: pointer; 
          padding: 6px; 
          border-radius: 6px; 
          transition: background 0.2s;
        }
        .edit-trigger { color: #3B82F6; }
        .delete-trigger { color: #EF4444; }
        .icon-btn:hover { background: #F1F5F9; }

        /* Modal Enhancements */
        .modal-overlay { 
          position: fixed; inset: 0; 
          background: rgba(0, 0, 0, 0.4); 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          z-index: 1000; 
        }
        .modal-content { 
          background: white; 
          width: 100%; 
          max-width: 500px; 
          border-radius: 16px; 
          padding: 32px; 
        }
        .modal-header { display: flex; justify-content: space-between; margin-bottom: 24px; }
        .modal-header h2 { font-size: 20px; font-weight: 700; }
        .close-modal { background: none; border: none; cursor: pointer; font-size: 20px; color: #94A3B8; }

        .form-group { margin-bottom: 16px; }
        .form-group label { display: block; font-size: 13px; font-weight: 600; color: #64748B; margin-bottom: 6px; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        
        .modal-form input, .modal-form select { 
          width: 100%; 
          padding: 10px 12px; 
          border: 1px solid #E2E8F0; 
          border-radius: 8px; 
          font-size: 14px; 
          outline: none;
        }
        .modal-form input:focus { border-color: #FF6B00; }

        .save-btn { 
          width: 100%; 
          background: #0F172A; 
          color: white; 
          border: none; 
          padding: 14px; 
          border-radius: 10px; 
          font-weight: 600; 
          margin-top: 12px; 
          cursor: pointer; 
        }

        @media (max-width: 768px) {
          .main-content { padding: 20px; }
          .admin-header { flex-direction: column; }
          .search-box { width: 100%; }
        }
      `}</style>
    </div>
  );
}