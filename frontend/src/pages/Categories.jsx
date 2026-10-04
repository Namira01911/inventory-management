import { useEffect, useState } from "react";
import axios from "axios";

function Categories() {

  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);

  const getCategories = () => {

    axios.get("http://localhost:8080/categories")
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => {
        console.log(error);
      });

  };

  useEffect(() => {
    getCategories();
  }, []);

  const saveCategory = () => {

    const category = {
      name: name
    };

    if (editingId !== null) {

      axios.put(
        `http://localhost:8080/categories/${editingId}`,
        category
      )
        .then(response => {

          console.log(response.data);

          setName("");
          setEditingId(null);

          getCategories();

        })
        .catch(error => {
          console.log(error);
        });

    } else {

      axios.post(
        "http://localhost:8080/categories",
        category
      )
        .then(response => {

          console.log(response.data);

          setName("");

          getCategories();

        })
        .catch(error => {
          console.log(error);
        });

    }
  };

  const editCategory = (category) => {

    setEditingId(category.id);
    setName(category.name);

  };

  const deleteCategory = (id) => {

    axios.delete(`http://localhost:8080/categories/${id}`)
      .then(() => {
        getCategories();
      })
      .catch(error => {
        console.log(error);
      });

  };

  const cancelEdit = () => {

    setEditingId(null);
    setName("");

  };

  return (

    <div>

      <h1>Categories</h1>

      <div className="product-form">

        <input
          type="text"
          placeholder="Category name"
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <button onClick={saveCategory}>
          {editingId !== null
            ? "Update Category"
            : "Add Category"}
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
            <th>Actions</th>
          </tr>

        </thead>

        <tbody>

          {categories.map(category => (

            <tr key={category.id}>

              <td>{category.id}</td>

              <td>{category.name}</td>

              <td>

                <button
                  onClick={() => editCategory(category)}
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteCategory(category.id)}
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

export default Categories;