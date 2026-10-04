import { useEffect, useState } from "react";
import axios from "axios";

function SellerDashboard({ onNavigate }) {
  const [dashboard, setDashboard] = useState({});
  const [orders, setOrders] = useState([]);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get("http://localhost:8080/dashboard"),
      axios.get("http://localhost:8080/orders"),
      axios.get("http://localhost:8080/products/low-stock?threshold=5"),
    ])
      .then(([dashRes, ordersRes, lowStockRes]) => {
        setDashboard(dashRes.data);
        setOrders(ordersRes.data);
        setLowStockCount(lowStockRes.data.length);
      })
      .catch((err) => console.error("Error loading seller dashboard:", err))
      .finally(() => setLoading(false));
  }, []);

  const pendingOrders = orders.filter((o) => o.order.status === "PENDING").length;
  const processingOrders = orders.filter(
    (o) => o.order.status === "ACCEPTED" || o.order.status === "PROCESSING"
  ).length;
  const completedOrders = orders.filter((o) => o.order.status === "COMPLETED").length;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Seller Dashboard</h1>
          <p className="subtitle">Incoming customer orders and sales fulfillment center</p>
        </div>
        <button className="primary-btn" onClick={() => onNavigate("orders")}>
          📋 Manage Orders ({pendingOrders} Pending)
        </button>
      </div>

      <div className="cards">
        <div className="card">
          <h3 style={{ color: "#f59e0b" }}>Pending Orders</h3>
          <p style={{ color: "#f59e0b" }}>{pendingOrders}</p>
        </div>

        <div className="card">
          <h3 style={{ color: "#0ea5e9" }}>In Processing</h3>
          <p style={{ color: "#0ea5e9" }}>{processingOrders}</p>
        </div>

        <div className="card">
          <h3 style={{ color: "#10b981" }}>Completed Orders</h3>
          <p style={{ color: "#10b981" }}>{completedOrders}</p>
        </div>

        <div className="card">
          <h3 style={{ color: "#2563eb" }}>Total Sales Revenue</h3>
          <p style={{ color: "#2563eb" }}>₹{dashboard.totalSalesAmount?.toFixed(2) || "0.00"}</p>
        </div>
      </div>

      <div style={{ marginTop: "30px" }} className="cards">
        <div className="card">
          <h3>Catalog Products</h3>
          <p>{dashboard.totalProducts || 0}</p>
        </div>

        <div className="card">
          <h3>Total Stock Units</h3>
          <p>{dashboard.totalStock || 0}</p>
        </div>

        <div className="card">
          <h3 style={{ color: "#ef4444" }}>Low-Stock Alerts</h3>
          <p style={{ color: "#ef4444" }}>{lowStockCount}</p>
        </div>

        <div className="card">
          <h3>Total Sales Count</h3>
          <p>{dashboard.totalSales || 0}</p>
        </div>
      </div>

      <div style={{ marginTop: "40px" }}>
        <h2>Quick Order Actions</h2>
        <div style={{ display: "flex", gap: "15px", marginTop: "15px" }}>
          <button className="secondary-btn" onClick={() => onNavigate("orders")}>
            📥 View Order Queue
          </button>
          <button className="secondary-btn" onClick={() => onNavigate("sales")}>
            📊 View Sales History
          </button>
        </div>
      </div>
    </div>
  );
}

export default SellerDashboard;
