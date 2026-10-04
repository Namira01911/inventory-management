function OrderDetailsModal({ orderResponse, onClose }) {
  if (!orderResponse) return null;
  const { order, items } = orderResponse;

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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Order #{order.id} Details</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="order-summary-grid">
          <div>
            <p><strong>Customer:</strong> {order.customerName}</p>
            <p><strong>Email:</strong> {order.customerEmail}</p>
            <p><strong>Status:</strong> {getStatusBadge(order.status)}</p>
          </div>
          <div>
            <p><strong>Date:</strong> {order.orderDate ? new Date(order.orderDate).toLocaleString() : "-"}</p>
            <p><strong>Total Amount:</strong> <span style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#2563eb" }}>₹{order.totalAmount?.toFixed(2)}</span></p>
            {order.notes && <p><strong>Notes:</strong> {order.notes}</p>}
          </div>
        </div>

        <h3 style={{ marginTop: "20px", marginBottom: "10px" }}>Ordered Items</h3>
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Unit Price</th>
              <th>Quantity</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {items && items.length > 0 ? (
              items.map((item) => (
                <tr key={item.id}>
                  <td>
                    <strong>{item.productName}</strong>
                    <br />
                    <small style={{ color: "#64748b" }}>Product ID: #{item.productId}</small>
                  </td>
                  <td>₹{item.price?.toFixed(2)}</td>
                  <td><strong>{item.quantity}</strong></td>
                  <td>₹{item.subtotal?.toFixed(2)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: "center", color: "#64748b" }}>
                  No item records found for this order.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div style={{ marginTop: "20px", textAlign: "right" }}>
          <button className="secondary-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailsModal;
