import { useEffect, useState } from "react";
import axios from "axios";

function PurchaseItems() {
  const [purchaseItems, setPurchaseItems] = useState([]);
  const [purchaseId, setPurchaseId] = useState("");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [products, setProducts] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const getPurchaseItems = () => {
    axios
      .get("http://localhost:8080/purchase-items")
      .then((response) => {
        setPurchaseItems(response.data);
      })
      .catch((err) => {
        console.error("Error fetching purchase items:", err);
      });
  };

  const getMeta = () => {
    axios.get("http://localhost:8080/products").then((res) => setProducts(res.data)).catch(() => {});
    axios.get("http://localhost:8080/purchases").then((res) => setPurchases(res.data)).catch(() => {});
  };

  useEffect(() => {
    getPurchaseItems();
    getMeta();
  }, []);

  const addPurchaseItem = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!purchaseId || !productId || !quantity || !price) {
      setError("Please fill in all fields");
      return;
    }

    const payload = {
      purchaseId: Number(purchaseId),
      productId: Number(productId),
      quantity: Number(quantity),
      price: Number(price)
    };

    axios
      .post("http://localhost:8080/purchase-items", payload)
      .then(() => {
        setSuccess("Purchase item added and product stock updated successfully!");
        setPurchaseId("");
        setProductId("");
        setQuantity("");
        setPrice("");
        getPurchaseItems();
      })
      .catch((err) => {
        const msg = err.response?.data?.message || err.response?.data || "Failed to add purchase item";
        setError(typeof msg === "string" ? msg : "Failed to add purchase item");
      });
  };

  return (
    <div>
      <h1>Purchase Items</h1>
      <p className="subtitle">Manage individual purchase items and replenish stock</p>

      {error && <div style={{ color: "#ef4444", marginBottom: "15px", fontWeight: "bold" }}>{error}</div>}
      {success && <div style={{ color: "#10b981", marginBottom: "15px", fontWeight: "bold" }}>{success}</div>}

      <form className="product-form" onSubmit={addPurchaseItem}>
        <select
          value={purchaseId}
          onChange={(e) => setPurchaseId(e.target.value)}
          required
        >
          <option value="">Select Purchase ID</option>
          {purchases.map((p) => (
            <option key={p.id} value={p.id}>
              Purchase #{p.id} (Supplier #{p.supplierId} - ₹{p.totalAmount})
            </option>
          ))}
        </select>

        <select
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          required
        >
          <option value="">Select Product</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              #{p.id} {p.name} (Current Stock: {p.quantity})
            </option>
          ))}
        </select>

        <input
          type="number"
          min="1"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
        />

        <input
          type="number"
          step="0.01"
          min="0.01"
          placeholder="Unit Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <button type="submit">Add Purchase Item</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Purchase ID</th>
            <th>Product ID</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {purchaseItems.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: "center", color: "#64748b" }}>
                No purchase items recorded yet.
              </td>
            </tr>
          ) : (
            purchaseItems.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>#{item.purchaseId}</td>
                <td>#{item.productId}</td>
                <td>{item.quantity}</td>
                <td>₹{item.price}</td>
                <td>₹{(item.quantity * item.price).toFixed(2)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default PurchaseItems;