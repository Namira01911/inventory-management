import { useEffect, useState } from "react";
import axios from "axios";

function ProductCatalog({ onAddToCart, cart }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState({});
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [notification, setNotification] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        axios.get("http://localhost:8080/products"),
        axios.get("http://localhost:8080/categories"),
      ]);

      setProducts(prodRes.data);
      const catMap = {};
      catRes.data.forEach((c) => {
        catMap[c.id] = c.name;
      });
      setCategories(catMap);
    } catch (err) {
      console.error("Error fetching catalog:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleQtyChange = (productId, val, maxStock) => {
    const num = Math.max(1, Math.min(Number(val) || 1, maxStock));
    setQuantities((prev) => ({ ...prev, [productId]: num }));
  };

  const handleAdd = (product) => {
    const maxStock = product.quantity || 0;
    const qty = quantities[product.id] || 1;

    // Check how many are already in cart
    const existingInCart = cart.find((i) => i.productId === product.id)?.quantity || 0;
    if (existingInCart + qty > maxStock) {
      setNotification(`Cannot add ${qty} more. You already have ${existingInCart} in cart (Available: ${maxStock})`);
      setTimeout(() => setNotification(""), 3500);
      return;
    }

    onAddToCart({
      productId: product.id,
      name: product.name,
      price: product.price || 0,
      quantity: qty,
      maxStock: maxStock,
    });

    setNotification(`Added ${qty} × ${product.name} to cart!`);
    setTimeout(() => setNotification(""), 3000);
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === "ALL" || String(p.categoryId) === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Product Catalog</h1>
          <p className="subtitle">Browse available items and add them to your order</p>
        </div>
      </div>

      {notification && (
        <div style={{ background: "#ecfdf5", border: "1px solid #10b981", color: "#065f46", padding: "12px", borderRadius: "8px", marginBottom: "20px", fontWeight: "bold" }}>
          ✓ {notification}
        </div>
      )}

      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search products by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: "220px", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{ padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
        >
          <option value="ALL">All Categories</option>
          {Object.entries(categories).map(([id, name]) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p style={{ color: "#64748b" }}>Loading products...</p>
      ) : filteredProducts.length === 0 ? (
        <p style={{ color: "#64748b", marginTop: "20px" }}>No products found matching your search.</p>
      ) : (
        <div className="products-grid">
          {filteredProducts.map((p) => {
            const stock = p.quantity != null ? p.quantity : 0;
            const isOutOfStock = stock <= 0;
            const isLowStock = stock > 0 && stock <= 5;
            const currentQty = quantities[p.id] || 1;

            return (
              <div key={p.id} className="product-card">
                <div className="card-top">
                  <span className="product-category">
                    {categories[p.categoryId] || "General"}
                  </span>
                  {isOutOfStock ? (
                    <span className="badge badge-danger">Out of Stock</span>
                  ) : isLowStock ? (
                    <span className="badge badge-warning">Low Stock ({stock} left)</span>
                  ) : (
                    <span className="badge badge-success">In Stock ({stock})</span>
                  )}
                </div>

                <h3 className="product-title">{p.name}</h3>
                <div className="product-price">₹{p.price?.toFixed(2)}</div>

                <div className="product-card-actions">
                  <div className="qty-picker">
                    <button
                      type="button"
                      onClick={() => handleQtyChange(p.id, currentQty - 1, stock)}
                      disabled={isOutOfStock || currentQty <= 1}
                    >
                      -
                    </button>
                    <span>{currentQty}</span>
                    <button
                      type="button"
                      onClick={() => handleQtyChange(p.id, currentQty + 1, stock)}
                      disabled={isOutOfStock || currentQty >= stock}
                    >
                      +
                    </button>
                  </div>

                  <button
                    className="add-to-cart-btn"
                    onClick={() => handleAdd(p)}
                    disabled={isOutOfStock}
                  >
                    {isOutOfStock ? "Unavailable" : "Add to Cart"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ProductCatalog;
