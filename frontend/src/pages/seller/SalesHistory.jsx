import { useEffect, useState } from "react";
import axios from "axios";

function SalesHistory() {
  const [sales, setSales] = useState([]);
  const [saleItems, setSaleItems] = useState([]);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const [salesRes, itemsRes, prodsRes] = await Promise.all([
        axios.get("http://localhost:8080/sales"),
        axios.get("http://localhost:8080/sale-items"),
        axios.get("http://localhost:8080/products"),
      ]);

      setSales(salesRes.data);
      setSaleItems(itemsRes.data);

      const prodMap = {};
      prodsRes.data.forEach((p) => {
        prodMap[p.id] = p.name;
      });
      setProducts(prodMap);
    } catch (err) {
      console.error("Error fetching sales history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const totalRevenue = sales.reduce((sum, s) => sum + (s.totalAmount || 0), 0);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Sales History & Ledger</h1>
          <p className="subtitle">Archive of all completed customer orders and direct sales transactions</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "1.4rem", fontWeight: "bold", color: "#10b981" }}>
            Total Revenue: ₹{totalRevenue.toFixed(2)}
          </div>
          <small style={{ color: "#64748b" }}>{sales.length} Total Sales</small>
        </div>
      </div>

      {loading ? (
        <p style={{ color: "#64748b" }}>Loading sales records...</p>
      ) : sales.length === 0 ? (
        <p style={{ color: "#64748b", marginTop: "20px" }}>No completed sales records found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Sale ID</th>
              <th>Date & Time</th>
              <th>Customer Name</th>
              <th>Items Sold</th>
              <th>Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => {
              const items = saleItems.filter((i) => i.saleId === sale.id);
              return (
                <tr key={sale.id}>
                  <td><strong>#{sale.id}</strong></td>
                  <td>{sale.saleDate ? new Date(sale.saleDate).toLocaleString() : "-"}</td>
                  <td><strong>{sale.customerName}</strong></td>
                  <td>
                    {items.length === 0 ? (
                      <span style={{ color: "#94a3b8" }}>Order completed</span>
                    ) : (
                      <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "0.9rem" }}>
                        {items.map((i) => (
                          <li key={i.id}>
                            {products[i.productId] || `Product #${i.productId}`} × <strong>{i.quantity}</strong> (@ ₹{i.price})
                          </li>
                        ))}
                      </ul>
                    )}
                  </td>
                  <td><strong style={{ color: "#2563eb" }}>₹{sale.totalAmount?.toFixed(2)}</strong></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default SalesHistory;
