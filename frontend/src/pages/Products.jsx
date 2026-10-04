import { useEffect, useState } from "react";
import axios from "axios";

function Products() {

  const [products, setProducts] = useState([]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  const [categoryId, setCategoryId] = useState("");
  const [supplierId, setSupplierId] = useState("");

  const [editingId, setEditingId] = useState(null);

  const getProducts = () => {

    axios.get("http://localhost:8080/products")
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.log(error);
      });

  };

  useEffect(() => {
    getProducts();
  }, []);

  const addProduct = () => {

    const product = {
      name: name,
      price: Number(price),
      quantity: Number(quantity),
      categoryId: categoryId === "" ? null : Number(categoryId),
      supplierId: supplierId === "" ? null : Number(supplierId)
    };

    if (editingId !== null) {

      axios.put(
        `http://localhost:8080/products/${editingId}`,
        product
      )
        .then(response => {

          console.log(response.data);

          setName("");
          setPrice("");
          setQuantity("");
          setCategoryId("");
          setSupplierId("");
          setEditingId(null);

          getProducts();

        })
        .catch(error => {
          console.log(error);
        });

    } else {

      axios.post(
        "http://localhost:8080/products",
        product
      )
        .then(response => {

          console.log(response.data);

          setName("");
          setPrice("");
          setQuantity("");
          setCategoryId("");
          setSupplierId("");

          getProducts();

        })
        .catch(error => {
          console.log(error);
        });
    }
  };

  const editProduct = (product) => {

    setEditingId(product.id);

    setName(product.name);
    setPrice(product.price);
    setQuantity(product.quantity);

    setCategoryId(product.categoryId ?? "");
    setSupplierId(product.supplierId ?? "");
  };

  const deleteProduct = (id) => {

    axios.delete(`http://localhost:8080/products/${id}`)
      .then(() => {
        getProducts();
      })
      .catch(error => {
        console.log(error);
      });
  };

  const cancelEdit = () => {

    setEditingId(null);

    setName("");
    setPrice("");
    setQuantity("");
    setCategoryId("");
    setSupplierId("");
  };

  return (

    <div>

      <h1>Products</h1>

      <div className="product-form">

        <input
          type="text"
          placeholder="Product name"
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={e => setPrice(e.target.value)}
        />

        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={e => setQuantity(e.target.value)}
        />

        <input
          type="number"
          placeholder="Category ID"
          value={categoryId}
          onChange={e => setCategoryId(e.target.value)}
        />

        <input
          type="number"
          placeholder="Supplier ID"
          value={supplierId}
          onChange={e => setSupplierId(e.target.value)}
        />

        <button onClick={addProduct}>
          {editingId !== null
            ? "Update Product"
            : "Add Product"}
        </button>

        {editingId !== null && (
          <button onClick={cancelEdit}>
            Cancel
          </button>
        )}

      </div>

      <table>

        <thead>

          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Category</th>
            <th>Supplier</th>
            <th>Actions</th>
          </tr>

        </thead>

        <tbody>

          {products.map(product => (

            <tr key={product.id}>

              <td>{product.id}</td>

              <td>{product.name}</td>

              <td>₹{product.price}</td>

              <td>{product.quantity}</td>

              <td>{product.categoryId}</td>

              <td>{product.supplierId}</td>

              <td>

                <button
                  onClick={() => editProduct(product)}
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteProduct(product.id)}
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

export default Products;