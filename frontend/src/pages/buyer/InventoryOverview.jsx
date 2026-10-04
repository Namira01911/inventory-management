import { useEffect, useState } from "react";
import axios from "axios";

function InventoryOverview({ onNavigate }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState({});
  const [suppliers, setSuppliers] = useState({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes, supRes] = await Promise.all([
        axios.get("http://localhost:8080/products"),
        axios.get("http://localhost:8080/categories"),
        axios.get("http://localhost:8080/suppliers"),
      ]);

      setProducts(prodRes.data);

      const catMap = {};
      catRes.data.forEach((c) => (catMap[c.id] = c.name));
      setCategories(catMap);

      const supMap = {};
      supRes.data.forEach((s) => (supMap[s.id] = s.name));
      setSuppliers(supMap);
    } catch (err) {
      console.error("Error fetching inventory overview:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Current Inventory Stock</h1>
          <p className="subtitle">Real-time stock levels, product catalog, and supplier associations</p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button className="primary-btn" onClick={() => onNavigate("inward")}>
            📥 Inward Stock
          </button>
          <button className="secondary-btn" onClick={() => onNavigate("products")}>
            ⚙️ Edit Products
          </button>
        </div>
      </div>

      <div className="filter-bar">
        <input
          type="text"
          placeholder="Filter by product name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: "350px", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
        />
      </div>

      {loading ? (
        <p style={{ color: "#64748b" }}>Loading inventory...</p>
      ) : filteredProducts.length === 0 ? (
        <p style={{ color: "#64748b", marginTop: "20px" }}>No products found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Assigned Supplier</th>
              <th>Selling Price</th>
              <th>Current Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((p) => {
              const stock = p.quantity != null ? p.quantity : 0;
              const isOut = stock <= 0;
              const isLow = stock > 0 && stock <= 5;

              return (
                <tr key={p.id}>
                  <td>#{p.id}</td>
                  <td><strong>{p.name}</strong></td>
                  <td>{categories[p.categoryId] || `Category #${p.categoryId || "-"}`}</td>
                  <td>{suppliers[p.supplierId] || `Supplier #${p.supplierId || "-"}`}</td>
                  <td>₹{p.price?.toFixed(2)}</td>
                  <td><strong>{stock}</strong></td>
                  <td>
                    {isOut ? (
                      <span className="badge badge-danger">Out of Stock</span>
                    ) : isLow ? (
                      <span className="badge badge-warning">Low Stock ({stock})</span>
                    ) : (
                      <span className="badge badge-success">Sufficient</span>
                    )}
                  </td>
                  <td>
                    <button
                      className="primary-btn-sm"
                      onClick={() => onNavigate("inward")}
                    >
                      Restock
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default InventoryOverview;
