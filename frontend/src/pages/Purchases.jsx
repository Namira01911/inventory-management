import { useEffect, useState } from "react";
import axios from "axios";

function Purchases() {

  const [purchases, setPurchases] = useState([]);

  const [supplierId, setSupplierId] = useState("");
  const [totalAmount, setTotalAmount] = useState("");

  const getPurchases = () => {

    axios.get("http://localhost:8080/purchases")
      .then(response => {
        setPurchases(response.data);
      })
      .catch(error => {
        console.log(error);
      });

  };

  useEffect(() => {
    getPurchases();
  }, []);

  const addPurchase = () => {

    const purchase = {
      supplierId: Number(supplierId),
      totalAmount: Number(totalAmount)
    };

    axios.post(
      "http://localhost:8080/purchases",
      purchase
    )
      .then(response => {

        console.log(response.data);

        setSupplierId("");
        setTotalAmount("");

        getPurchases();

      })
      .catch(error => {
        console.log(error);
      });

  };

  return (

    <div>

      <h1>Purchases</h1>

      <div className="product-form">

        <input
          type="number"
          placeholder="Supplier ID"
          value={supplierId}
          onChange={e => setSupplierId(e.target.value)}
        />

        <input
          type="number"
          placeholder="Total Amount"
          value={totalAmount}
          onChange={e => setTotalAmount(e.target.value)}
        />

        <button onClick={addPurchase}>
          Add Purchase
        </button>

      </div>

      <table>

        <thead>

          <tr>
            <th>ID</th>
            <th>Supplier ID</th>
            <th>Total Amount</th>
          </tr>

        </thead>

        <tbody>

          {purchases.map(purchase => (

            <tr key={purchase.id}>

              <td>{purchase.id}</td>

              <td>{purchase.supplierId}</td>

              <td>₹{purchase.totalAmount}</td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );
}

export default Purchases;