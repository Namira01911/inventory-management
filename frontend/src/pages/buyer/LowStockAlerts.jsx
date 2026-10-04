import { useEffect, useState } from "react";
import axios from "axios";

function LowStockAlerts({ onNavigate }) {
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [threshold, setThreshold] = useState(5);
  const [loading, setLoading] = useState(true);

  const fetchLowStock = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:8080/products/low-stock?threshold=${threshold}`);
      setLowStockProducts(res.data);
    } catch (err) {
      console.error("Error fetching low stock:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLowStock();
  }, [threshold]);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Low-Stock Alerts & Restocking</h1>
          <p className="subtitle">Products that have reached or fallen below your minimum inventory threshold</p>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <label style={{ fontWeight: "bold" }}>Alert Threshold:</label>
          <input
            type="number"
            min="1"
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value) || 1)}
            style={{ width: "70px", padding: "8px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
          />
          <button className="primary-btn" onClick={() => onNavigate("inward")}>
            📥 Create Inward Purchase
          </button>
        </div>
      </div>

      {loading ? (
        <p style={{ color: "#64748b" }}>Checking stock levels...</p>
      ) : lowStockProducts.length === 0 ? (
        <div style={{ textAlign: "center", padding: "50px 0", color: "#10b981", background: "#f0fdf4", borderRadius: "10px" }}>
          <p style={{ fontSize: "2.5rem", marginBottom: "10px" }}>✅</p>
          <h3>All Products Well Stocked!</h3>
          <p style={{ color: "#64748b" }}>No products currently have stock at or below {threshold} units.</p>
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Product Name</th>
              <th>Current Stock</th>
              <th>Unit Selling Price</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {lowStockProducts.map((p) => {
              const stock = p.quantity != null ? p.quantity : 0;
              return (
                <tr key={p.id}>
                  <td>#{p.id}</td>
                  <td><strong>{p.name}</strong></td>
                  <td>
                    <span style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#ef4444" }}>
                      {stock} units left
                    </span>
                  </td>
                  <td>₹{p.price?.toFixed(2)}</td>
                  <td>
                    <span className="badge badge-danger">
                      {stock <= 0 ? "Out of Stock" : "Restock Needed"}
                    </span>
                  </td>
                  <td>
                    <button
                      className="primary-btn-sm"
                      onClick={() => onNavigate("inward")}
                    >
                      Restock Product
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

export default LowStockAlerts;
