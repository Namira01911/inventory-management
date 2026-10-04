import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

function CustomerDashboard({ onNavigate }) {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    axios
      .get(`http://localhost:8080/orders/my-orders/${user.id}`)
      .then((res) => setOrders(res.data))
      .catch((err) => console.error("Error loading dashboard orders:", err))
      .finally(() => setLoading(false));
  }, [user]);

  const totalOrders = orders.length;
  const activeOrders = orders.filter(
    (o) => o.order.status !== "COMPLETED" && o.order.status !== "REJECTED"
  ).length;
  const completedOrders = orders.filter((o) => o.order.status === "COMPLETED").length;
  const totalSpent = orders
    .filter((o) => o.order.status === "COMPLETED")
    .reduce((sum, o) => sum + (o.order.totalAmount || 0), 0);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Customer Dashboard</h1>
          <p className="subtitle">Welcome back, {user?.name}! Here is your order activity overview.</p>
        </div>
        <button className="primary-btn" onClick={() => onNavigate("catalog")}>
          🛍️ Browse Products
        </button>
      </div>

      <div className="cards">
        <div className="card">
          <h3>Total Orders</h3>
          <p>{totalOrders}</p>
        </div>

        <div className="card">
          <h3 style={{ color: "#f59e0b" }}>Active Orders</h3>
          <p style={{ color: "#f59e0b" }}>{activeOrders}</p>
        </div>

        <div className="card">
          <h3 style={{ color: "#10b981" }}>Completed Orders</h3>
          <p style={{ color: "#10b981" }}>{completedOrders}</p>
        </div>

        <div className="card">
          <h3 style={{ color: "#2563eb" }}>Total Spent</h3>
          <p style={{ color: "#2563eb" }}>₹{totalSpent.toFixed(2)}</p>
        </div>
      </div>

      <div style={{ marginTop: "40px" }}>
        <h2>Quick Actions</h2>
        <div style={{ display: "flex", gap: "15px", marginTop: "15px" }}>
          <button className="secondary-btn" onClick={() => onNavigate("catalog")}>
            🛒 Shop Products Catalog
          </button>
          <button className="secondary-btn" onClick={() => onNavigate("orders")}>
            📦 Track My Orders
          </button>
        </div>
      </div>
    </div>
  );
}

export default CustomerDashboard;
