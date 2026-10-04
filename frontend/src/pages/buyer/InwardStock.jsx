import { useEffect, useState } from "react";
import axios from "axios";

function InwardStock() {
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [purchases, setPurchases] = useState([]);

  const [supplierId, setSupplierId] = useState("");
  const [items, setItems] = useState([{ productId: "", quantity: 1, price: 0 }]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      const [supRes, prodRes, purRes] = await Promise.all([
        axios.get("http://localhost:8080/suppliers"),
        axios.get("http://localhost:8080/products"),
        axios.get("http://localhost:8080/purchases"),
      ]);
      setSuppliers(supRes.data);
      setProducts(prodRes.data);
      setPurchases(purRes.data);
    } catch (err) {
      console.error("Error loading inward stock dependencies:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;

    // Auto-fill price suggestion if user picks a product
    if (field === "productId") {
      const prod = products.find((p) => p.id === Number(value));
      if (prod && !updated[index].price) {
        // Default wholesale cost suggestion e.g. 70% of retail price
        updated[index].price = Math.round(prod.price * 0.75 * 100) / 100;
      }
    }
    setItems(updated);
  };

  const addItemRow = () => {
    setItems([...items, { productId: "", quantity: 1, price: 0 }]);
  };

  const removeItemRow = (index) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const totalCalculated = items.reduce((sum, item) => {
    const q = Number(item.quantity) || 0;
    const p = Number(item.price) || 0;
    return sum + q * p;
  }, 0);

  const handleInwardSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!supplierId) {
      setError("Please select a supplier");
      return;
    }

    for (let i = 0; i < items.length; i++) {
      if (!items[i].productId || items[i].quantity <= 0 || items[i].price <= 0) {
        setError(`Item row #${i + 1} has incomplete or invalid quantity/price`);
        return;
      }
    }

    setSubmitting(true);
    try {
      const payload = {
        supplierId: Number(supplierId),
        items: items.map((i) => ({
          productId: Number(i.productId),
          quantity: Number(i.quantity),
          price: Number(i.price),
        })),
      };

      await axios.post("http://localhost:8080/purchases/receive", payload);
      setSuccess("Inward stock successfully received! Product inventory has been updated.");
      setSupplierId("");
      setItems([{ productId: "", quantity: 1, price: 0 }]);
      fetchData();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to inward stock";
      setError(typeof msg === "string" ? msg : "Failed to inward stock");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Inward Stock & Supplier Restock</h1>
          <p className="subtitle">
            Record received goods from suppliers to automatically increase inventory quantities
          </p>
        </div>
      </div>

      {error && <div className="error-alert">{error}</div>}
      {success && <div className="success-alert">{success}</div>}

      <div className="card" style={{ marginBottom: "35px" }}>
        <form onSubmit={handleInwardSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
              Select Supplier:
            </label>
            <select
              value={supplierId}
              onChange={(e) => setSupplierId(e.target.value)}
              required
              style={{ width: "100%", maxWidth: "400px", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
            >
              <option value="">-- Choose Supplier --</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>
                  #{s.id} {s.name} ({s.phone || s.email})
                </option>
              ))}
            </select>
          </div>

          <h3>Purchased Products Received:</h3>
          <div style={{ marginTop: "12px" }}>
            {items.map((row, index) => (
              <div key={index} className="inward-item-row">
                <select
                  value={row.productId}
                  onChange={(e) => handleItemChange(index, "productId", e.target.value)}
                  required
                  style={{ flex: 2, padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                >
                  <option value="">Select Product to Restock</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      #{p.id} {p.name} (Current Stock: {p.quantity})
                    </option>
                  ))}
                </select>

                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <label style={{ fontSize: "0.85rem", color: "#64748b" }}>Qty:</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="Qty"
                    value={row.quantity}
                    onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                    required
                    style={{ width: "90px", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                  />
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <label style={{ fontSize: "0.85rem", color: "#64748b" }}>Unit Cost (₹):</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="Price"
                    value={row.price}
                    onChange={(e) => handleItemChange(index, "price", e.target.value)}
                    required
                    style={{ width: "110px", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                  />
                </div>

                <div style={{ minWidth: "100px", fontWeight: "bold" }}>
                  ₹{(Number(row.quantity || 0) * Number(row.price || 0)).toFixed(2)}
                </div>

                {items.length > 1 && (
                  <button
                    type="button"
                    className="delete-btn-sm"
                    onClick={() => removeItemRow(index)}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>

          <div style={{ marginTop: "15px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button type="button" className="secondary-btn" onClick={addItemRow}>
              + Add Another Product
            </button>

            <div style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
              Total PO Cost: <span style={{ color: "#2563eb" }}>₹{totalCalculated.toFixed(2)}</span>
            </div>
          </div>

          <div style={{ marginTop: "25px", borderTop: "1px solid #e2e8f0", paddingTop: "20px" }}>
            <button
              type="submit"
              className="primary-btn"
              disabled={submitting}
              style={{ width: "100%", padding: "14px", fontSize: "1rem" }}
            >
              {submitting ? "Processing Inward Receipt..." : "✓ Confirm Receipt & Increase Inventory Stock"}
            </button>
          </div>
        </form>
      </div>

      <h2>Recent Inward Purchases Log</h2>
      <table>
        <thead>
          <tr>
            <th>Purchase ID</th>
            <th>Date</th>
            <th>Supplier ID</th>
            <th>Total Cost</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {purchases.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: "center", color: "#64748b" }}>
                No inward purchase records found.
              </td>
            </tr>
          ) : (
            purchases.slice(-10).reverse().map((p) => (
              <tr key={p.id}>
                <td><strong>#{p.id}</strong></td>
                <td>{p.purchaseDate ? new Date(p.purchaseDate).toLocaleString() : "-"}</td>
                <td>Supplier #{p.supplierId}</td>
                <td><strong>₹{p.totalAmount?.toFixed(2)}</strong></td>
                <td>
                  <span className="badge badge-success">{p.status || "RECEIVED"}</span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default InwardStock;
