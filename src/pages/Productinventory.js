import React, { useState, useEffect } from "react";
import { LuPlus, LuTrash2, LuPencil, LuX, LuImage, LuSearch } from "react-icons/lu";

export default function ProductInventory() {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);

  // ✅ Updated empty product with subcategory
  const emptyProduct = {
    name: "",
    category: "Men",
    subcategory: "Shoes",
    price: "",
    stock: "",
    images: [],
  };

  const [formProduct, setFormProduct] = useState(emptyProduct);

  // Example categories & subcategories
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

    let url = "";
    let method = "";
    if (editProduct) {
      url = `https://unstopablerundatabse.onrender.com/products/update/${editProduct.id}`;
      method = "PUT";
    } else {
      url = "https://unstopablerundatabse.onrender.com/products/add";
      method = "POST";
    }

    const res = await fetch(url, {
      method,
      body: formData,
    });

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


  // ✅ DELETE
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
            <p className="breadcrumb">Showing {filteredProducts.length} items</p>
          </div>

          <div className="header-actions">
            <div className="search-box">
              <LuSearch />
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
                <th>Product Info</th>
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
                    <div className="product-info">
                      <div className="img-placeholder">
                        {product.images?.length ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            style={{ width: 40, height: 40, borderRadius: 6 }}
                          />
                        ) : (
                          <LuImage />
                        )}
                      </div>
                      <div>
                        <div className="bold">{product.name}</div>
                        <div className="small-text">ID #{product.id}</div>
                      </div>
                    </div>
                  </td>

                  <td>{product.category}</td>
                  <td>{product.subcategory}</td>
                  <td className="bold">${product.price}</td>
                  <td>{product.stock}</td>

                  <td>
                    <span
                      className={`status-badge ${product.stock > 0 ? "active" : "out"}`}
                    >
                      {product.stock > 0 ? "In Stock" : "Out"}
                    </span>
                  </td>

                  <td>
                    <div className="action-group">
                      <button
                        className="action-btn edit"
                        onClick={() => {
                          setEditProduct(product);
                          setFormProduct({
                            name: product.name,
                            category: product.category,
                            subcategory: product.subcategory,
                            price: product.price,
                            stock: product.stock,
                            images: product.images || [],
                          });
                          setShowModal(true);
                        }}
                      >
                        <LuPencil />
                      </button>

                      <button
                        className="action-btn delete"
                        onClick={() => handleDelete(product.id)}
                      >
                        <LuTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editProduct ? "Edit Product" : "Add Product"}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                <LuX />
              </button>
            </div>

            <form className="modal-form" onSubmit={handleSubmit}>
              <input
                placeholder="Product Name"
                value={formProduct.name}
                onChange={(e) =>
                  setFormProduct({ ...formProduct, name: e.target.value })
                }
              />

              {/* Category Selector */}
              <select
                value={formProduct.category}
                onChange={(e) =>
                  setFormProduct({
                    ...formProduct,
                    category: e.target.value,
                    subcategory: categories[e.target.value][0], // reset subcategory
                  })
                }
              >
                {Object.keys(categories).map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              {/* Subcategory Selector */}
              <select
                value={formProduct.subcategory}
                onChange={(e) =>
                  setFormProduct({ ...formProduct, subcategory: e.target.value })
                }
              >
                {categories[formProduct.category].map((sub) => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>

              <input
                placeholder="Price"
                value={formProduct.price}
                onChange={(e) =>
                  setFormProduct({ ...formProduct, price: e.target.value })
                }
              />

              <input
                placeholder="Stock"
                value={formProduct.stock}
                onChange={(e) =>
                  setFormProduct({ ...formProduct, stock: e.target.value })
                }
              />

              <input type="file" multiple onChange={handleImageChange} />

              <button className="submit-btn" type="submit">
                {editProduct ? "Update Product" : "Save Product"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Keep your existing styles */}
     


     
     
  
     <style>{`
  .admin-container { display: flex; flex-direction: column; min-height: 100vh; background: #F8FAFC; font-family: 'Inter', sans-serif; }

  .main-content { flex: 1; padding: 20px 40px; }

  .admin-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 15px; }
  .header-actions { display: flex; gap: 15px; flex-wrap: wrap; }
  .search-box { background: white; border: 1px solid #E2E8F0; border-radius: 10px; display: flex; align-items: center; padding: 0 10px; gap: 8px; flex: 1; min-width: 150px; }
  .search-box input { border: none; padding: 8px 0; outline: none; width: 100%; }

  .add-btn { background: #FF6B00; color: white; border: none; padding: 10px 16px; border-radius: 12px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 6px; }

  .data-table-container { background: white; border-radius: 20px; border: 1px solid #E2E8F0; overflow-x: auto; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
  .admin-table { width: 100%; border-collapse: collapse; min-width: 600px; } /* ensure scroll on mobile */
  .admin-table th { background: #F8FAFC; padding: 12px 16px; text-align: left; font-size: 12px; color: #64748B; text-transform: uppercase; letter-spacing: 0.05em; }
  .admin-table td { padding: 12px 16px; border-top: 1px solid #F1F5F9; color: #1E293B; }

  .product-info { display: flex; align-items: center; gap: 10px; }
  .img-placeholder { width: 40px; height: 40px; background: #F1F5F9; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #94A3B8; }

  .bold { font-weight: 700; }
  .small-text { font-size: 12px; color: #94A3B8; }

  .status-badge { padding: 4px 10px; border-radius: 100px; font-size: 11px; font-weight: 600; }
  .status-badge.active { background: #DCFCE7; color: #166534; }
  .status-badge.out { background: #FEE2E2; color: #991B1B; }

  .action-group { display: flex; gap: 6px; }
  .action-btn { background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px; cursor: pointer; padding: 4px; display: flex; align-items: center; transition: 0.2s; }
  .action-btn.edit { color: #3B82F6; }
  .action-btn.delete { color: #EF4444; }
  .action-btn:hover { background: #F1F5F9; }

  /* Modal */
  .modal-overlay { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 10px; }
  .modal-content { background: white; width: 100%; max-width: 450px; border-radius: 24px; padding: 20px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); }
  .modal-header { display: flex; justify-content: space-between; margin-bottom: 20px; border-bottom: 1px solid #F1F5F9; padding-bottom: 10px; }
  .modal-form input, .modal-form select { width: 100%; padding: 10px; border: 1px solid #E2E8F0; border-radius: 10px; font-size: 14px; margin-bottom: 12px; }
  .submit-btn { width: 100%; background: #0F172A; color: white; border: none; padding: 12px; border-radius: 12px; font-weight: 700; cursor: pointer; margin-top: 10px; }
  .close-btn { background: none; border: none; cursor: pointer; font-size: 20px; color: #94A3B8; }

  /* Mobile adjustments */
  @media (max-width: 768px) {
    .main-content { padding: 15px; }
    .admin-header { flex-direction: column; align-items: stretch; gap: 10px; }
    .header-actions { flex-direction: column; align-items: stretch; }
    .search-box { width: 100%; }
    .add-btn { width: 100%; justify-content: center; }
    .admin-table { min-width: 500px; font-size: 12px; }
    .product-info { gap: 8px; }
    .img-placeholder { width: 36px; height: 36px; }
  }
`}</style>

    </div>
  );
}