import { useEffect, useState } from "react";
import axios from "axios";

function BuyerDashboard({ onNavigate }) {
  const [dashboard, setDashboard] = useState({});
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get("http://localhost:8080/dashboard"),
      axios.get("http://localhost:8080/products/low-stock?threshold=5"),
    ])
      .then(([dashRes, lowRes]) => {
        setDashboard(dashRes.data);
        setLowStockProducts(lowRes.data);
      })
      .catch((err) => console.error("Error loading buyer dashboard:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Buyer & Inventory Dashboard</h1>
          <p className="subtitle">Stock replenishment, supplier purchases, and inward inventory monitoring</p>
        </div>
        <button className="primary-btn" onClick={() => onNavigate("inward")}>
          📥 Inward Purchased Stock
        </button>
      </div>

      <div className="cards">
        <div className="card">
          <h3>Total Products</h3>
          <p>{dashboard.totalProducts || 0}</p>
        </div>

        <div className="card">
          <h3 style={{ color: "#10b981" }}>Total Units in Stock</h3>
          <p style={{ color: "#10b981" }}>{dashboard.totalStock || 0}</p>
        </div>

        <div className="card">
          <h3 style={{ color: "#ef4444" }}>Low-Stock Alerts</h3>
          <p style={{ color: "#ef4444" }}>{lowStockProducts.length}</p>
        </div>

        <div className="card">
          <h3 style={{ color: "#2563eb" }}>Total Purchases Spend</h3>
          <p style={{ color: "#2563eb" }}>₹{dashboard.totalPurchaseAmount?.toFixed(2) || "0.00"}</p>
        </div>
      </div>

      {lowStockProducts.length > 0 && (
        <div style={{ marginTop: "35px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
            <h2 style={{ color: "#ef4444" }}>⚠️ Products Requiring Immediate Restocking</h2>
            <button className="secondary-btn" onClick={() => onNavigate("low-stock")}>
              View All Low-Stock Items
            </button>
          </div>

          <table>
            <thead>
              <tr>
                <th>Product ID</th>
                <th>Name</th>
                <th>Current Stock</th>
                <th>Selling Price</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {lowStockProducts.slice(0, 5).map((p) => (
                <tr key={p.id}>
                  <td>#{p.id}</td>
                  <td><strong>{p.name}</strong></td>
                  <td><strong style={{ color: "#ef4444" }}>{p.quantity}</strong></td>
                  <td>₹{p.price?.toFixed(2)}</td>
                  <td>
                    <span className="badge badge-danger">
                      {p.quantity <= 0 ? "Out of Stock" : "Low Stock"}
                    </span>
                  </td>
                  <td>
                    <button
                      className="primary-btn-sm"
                      onClick={() => onNavigate("inward")}
                    >
                      Inward Stock
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ marginTop: "40px" }}>
        <h2>Quick Buyer Actions</h2>
        <div style={{ display: "flex", gap: "15px", marginTop: "15px" }}>
          <button className="secondary-btn" onClick={() => onNavigate("inventory")}>
            📊 View Full Inventory
          </button>
          <button className="secondary-btn" onClick={() => onNavigate("inward")}>
            📦 Record Inward Stock
          </button>
          <button className="secondary-btn" onClick={() => onNavigate("suppliers")}>
            🏭 Manage Suppliers
          </button>
          <button className="secondary-btn" onClick={() => onNavigate("purchases")}>
            📜 View Purchase History
          </button>
        </div>
      </div>
    </div>
  );
}

export default BuyerDashboard;
