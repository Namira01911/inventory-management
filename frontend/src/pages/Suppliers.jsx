import { useEffect, useState } from "react";
import axios from "axios";

function Suppliers() {

  const [suppliers, setSuppliers] = useState([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [editingId, setEditingId] = useState(null);

  const getSuppliers = () => {

    axios.get("http://localhost:8080/suppliers")
      .then(response => {
        setSuppliers(response.data);
      })
      .catch(error => {
        console.log(error);
      });

  };

  useEffect(() => {
    getSuppliers();
  }, []);

  const saveSupplier = () => {

    const supplier = {
      name: name,
      email: email,
      phone: phone,
      address: address
    };

    if (editingId !== null) {

      axios.put(
        `http://localhost:8080/suppliers/${editingId}`,
        supplier
      )
        .then(response => {

          console.log(response.data);

          clearForm();
          getSuppliers();

        })
        .catch(error => {
          console.log(error);
        });

    } else {

      axios.post(
        "http://localhost:8080/suppliers",
        supplier
      )
        .then(response => {

          console.log(response.data);

          clearForm();
          getSuppliers();

        })
        .catch(error => {
          console.log(error);
        });

    }
  };

  const editSupplier = (supplier) => {

    setEditingId(supplier.id);

    setName(supplier.name);
    setEmail(supplier.email);
    setPhone(supplier.phone);
    setAddress(supplier.address);

  };

  const deleteSupplier = (id) => {

    axios.delete(`http://localhost:8080/suppliers/${id}`)
      .then(() => {
        getSuppliers();
      })
      .catch(error => {
        console.log(error);
      });

  };

  const clearForm = () => {

    setEditingId(null);

    setName("");
    setEmail("");
    setPhone("");
    setAddress("");

  };

  return (

    <div>

      <h1>Suppliers</h1>

      <div className="product-form">

        <input
          type="text"
          placeholder="Supplier name"
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <input
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={e => setPhone(e.target.value)}
        />

        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={e => setAddress(e.target.value)}
        />

        <button onClick={saveSupplier}>
          {editingId !== null
            ? "Update Supplier"
            : "Add Supplier"}
        </button>

        {editingId !== null && (
          <button onClick={clearForm}>
            Cancel
          </button>
        )}

      </div>

      <table>

        <thead>

          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>

        </thead>

        <tbody>

          {suppliers.map(supplier => (

            <tr key={supplier.id}>

              <td>{supplier.id}</td>

              <td>{supplier.name}</td>

              <td>{supplier.email}</td>

              <td>{supplier.phone}</td>

              <td>{supplier.address}</td>

              <td>

                <button
                  onClick={() => editSupplier(supplier)}
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteSupplier(supplier.id)}
                >
                  Delete
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );
}

export default Suppliers;