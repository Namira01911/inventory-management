import { useEffect, useState } from "react";
import axios from "axios";
import OrderDetailsModal from "../../components/OrderDetailsModal";

function IncomingOrders() {
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [actionError, setActionError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const url =
        filterStatus === "ALL"
          ? "http://localhost:8080/orders"
          : `http://localhost:8080/orders?status=${filterStatus}`;
      const res = await axios.get(url);
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filterStatus]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    setActionError("");
    setActionSuccess("");

    try {
      await axios.put(`http://localhost:8080/orders/${orderId}/status`, {
        status: newStatus,
      });
      setActionSuccess(`Order #${orderId} status updated to ${newStatus}`);
      fetchOrders();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to update status";
      setActionError(typeof msg === "string" ? msg : "Failed to update status");
    }
  };

  const handleCompleteOrder = async (orderId) => {
    setActionError("");
    setActionSuccess("");

    if (!window.confirm(`Are you sure you want to complete and dispatch Order #${orderId}? This will automatically verify available stock, reduce product quantities, and record the sale.`)) {
      return;
    }

    try {
      await axios.put(`http://localhost:8080/orders/${orderId}/complete`);
      setActionSuccess(`Order #${orderId} successfully completed! Stock has been reduced and sale recorded.`);
      fetchOrders();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to complete order";
      setActionError(typeof msg === "string" ? msg : "Failed to complete order");
    }
  };

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
          <h1>Incoming Customer Orders</h1>
          <p className="subtitle">Review customer orders, check stock, and dispatch items</p>
        </div>
        <button className="secondary-btn" onClick={fetchOrders}>
          🔄 Refresh Orders
        </button>
      </div>

      {actionError && <div className="error-alert">{actionError}</div>}
      {actionSuccess && <div className="success-alert">{actionSuccess}</div>}

      <div className="filter-bar">
        <label style={{ fontWeight: "bold" }}>Filter by Status:</label>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{ padding: "8px 14px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
        >
          <option value="ALL">All Orders</option>
          <option value="PENDING">Pending</option>
          <option value="ACCEPTED">Accepted</option>
          <option value="PROCESSING">Processing</option>
          <option value="COMPLETED">Completed</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {loading ? (
        <p style={{ color: "#64748b" }}>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p style={{ color: "#64748b", marginTop: "20px" }}>No orders found for this status.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Order #</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Items</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((resp) => {
              const { order, items } = resp;
              const isPending = order.status === "PENDING";
              const isAccepted = order.status === "ACCEPTED";
              const isProcessing = order.status === "PROCESSING";
              const isTerminal = order.status === "COMPLETED" || order.status === "REJECTED";

              return (
                <tr key={order.id}>
                  <td><strong>#{order.id}</strong></td>
                  <td>
                    <strong>{order.customerName}</strong>
                    <br />
                    <small style={{ color: "#64748b" }}>{order.customerEmail}</small>
                  </td>
                  <td>{order.orderDate ? new Date(order.orderDate).toLocaleString() : "-"}</td>
                  <td>
                    <button
                      className="details-link-btn"
                      onClick={() => setSelectedOrder(resp)}
                    >
                      {items?.length || 0} product(s) 🔍
                    </button>
                  </td>
                  <td><strong>₹{order.totalAmount?.toFixed(2)}</strong></td>
                  <td>{getStatusBadge(order.status)}</td>
                  <td>
                    <div className="table-actions">
                      {isPending && (
                        <>
                          <button
                            className="primary-btn-sm"
                            onClick={() => handleUpdateStatus(order.id, "ACCEPTED")}
                            title="Accept customer order"
                          >
                            Accept
                          </button>
                          <button
                            className="delete-btn-sm"
                            onClick={() => handleUpdateStatus(order.id, "REJECTED")}
                            title="Reject order"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {isAccepted && (
                        <>
                          <button
                            className="info-btn-sm"
                            onClick={() => handleUpdateStatus(order.id, "PROCESSING")}
                          >
                            Process
                          </button>
                          <button
                            className="success-btn-sm"
                            onClick={() => handleCompleteOrder(order.id)}
                            title="Verify stock and complete sale"
                          >
                            Complete & Sell
                          </button>
                        </>
                      )}

                      {isProcessing && (
                        <button
                          className="success-btn-sm"
                          onClick={() => handleCompleteOrder(order.id)}
                          title="Verify stock and complete sale"
                        >
                          Complete & Sell
                        </button>
                      )}

                      {isTerminal && (
                        <span style={{ color: "#94a3b8", fontSize: "0.85rem" }}>
                          No actions (Locked)
                        </span>
                      )}
                    </div>
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

export default IncomingOrders;
