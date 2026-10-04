import { useState } from "react";
import axios from "axios";

function CartModal({ cart, onUpdateQuantity, onRemoveItem, onClearCart, onClose, onOrderPlaced }) {
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setError("");
    setLoading(true);

    try {
      const payload = {
        items: cart.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        notes: notes.trim(),
      };

      await axios.post("http://localhost:8080/orders", payload);
      onClearCart();
      onOrderPlaced();
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to place order";
      setError(typeof msg === "string" ? msg : "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Your Shopping Cart</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        {error && <div className="error-alert">{error}</div>}

        {cart.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#64748b" }}>
            <p style={{ fontSize: "2.5rem", marginBottom: "10px" }}>🛒</p>
            <p>Your cart is empty. Browse products to add items.</p>
          </div>
        ) : (
          <>
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Subtotal</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.productId}>
                    <td>
                      <strong>{item.name}</strong>
                      <br />
                      <small style={{ color: "#64748b" }}>Available: {item.maxStock}</small>
                    </td>
                    <td>₹{item.price.toFixed(2)}</td>
                    <td>
                      <div className="qty-controls">
                        <button
                          type="button"
                          className="qty-btn"
                          onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
                        >
                          -
                        </button>
                        <span className="qty-val">{item.quantity}</span>
                        <button
                          type="button"
                          className="qty-btn"
                          onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                          disabled={item.quantity >= item.maxStock}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td>₹{(item.price * item.quantity).toFixed(2)}</td>
                    <td>
                      <button
                        type="button"
                        className="delete-btn"
                        onClick={() => onRemoveItem(item.productId)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ marginTop: "20px" }}>
              <label style={{ display: "block", marginBottom: "6px", fontWeight: "bold" }}>
                Delivery / Order Notes (optional):
              </label>
              <input
                type="text"
                placeholder="e.g. Leave package at front door, urgent dispatch, etc."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
              />
            </div>

            <div className="cart-footer">
              <div className="cart-total">
                <span>Total Amount:</span>
                <span className="total-value">₹{totalAmount.toFixed(2)}</span>
              </div>
              <div className="cart-actions">
                <button type="button" className="secondary-btn" onClick={onClose}>
                  Continue Shopping
                </button>
                <button
                  type="button"
                  className="primary-btn"
                  onClick={handleCheckout}
                  disabled={loading}
                >
                  {loading ? "Placing Order..." : "Place Order Now"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CartModal;
