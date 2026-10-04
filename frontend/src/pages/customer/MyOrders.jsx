import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import OrderDetailsModal from "../../components/OrderDetailsModal";

function MyOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:8080/orders/my-orders/${user.id}`);
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "COMPLETED":
        return <span className="badge badge-success">Completed</span>;
      case "PROCESSING":
        return <span className="badge badge-info">Processing</span>;
      case "ACCEPTED":
        return <span className="badge badge-primary">Accepted</span>;
      case "REJECTED":
        return <span className="badge badge-danger">Rejected</span>;
      default:
        return <span className="badge badge-warning">Pending</span>;
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>My Orders</h1>
          <p className="subtitle">Track your placed orders and delivery status</p>
        </div>
        <button className="secondary-btn" onClick={fetchOrders}>
          🔄 Refresh
        </button>
      </div>

      {loading ? (
        <p style={{ color: "#64748b" }}>Loading your orders...</p>
      ) : orders.length === 0 ? (
        <div style={{ textAlign: "center", padding: "50px 0", color: "#64748b" }}>
          <p style={{ fontSize: "2.5rem", marginBottom: "10px" }}>📦</p>
          <p>You have not placed any orders yet.</p>
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Order #</th>
              <th>Date</th>
              <th>Items Count</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((resp) => {
              const { order, items } = resp;
              return (
                <tr key={order.id}>
                  <td><strong>#{order.id}</strong></td>
                  <td>{order.orderDate ? new Date(order.orderDate).toLocaleString() : "-"}</td>
                  <td>{items?.length || 0} product(s)</td>
                  <td><strong>₹{order.totalAmount?.toFixed(2)}</strong></td>
                  <td>{getStatusBadge(order.status)}</td>
                  <td>
                    <button
                      className="secondary-btn"
                      onClick={() => setSelectedOrder(resp)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {selectedOrder && (
        <OrderDetailsModal
          orderResponse={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}

export default MyOrders;
