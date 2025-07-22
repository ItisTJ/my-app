import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";

const CategoryManager: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // Load token once on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      setAccessToken(token);
    }
  }, []);

  // Fetch categories only when accessToken is ready
  useEffect(() => {
    if (accessToken) {
      fetchCategories();
    }
  }, [accessToken]);

  // Fetch all categories from API
  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/categories", {
        headers: { Authorization: `Bearer ${accessToken}` },
        withCredentials: true,
      });
      setCategories(response.data);
    } catch (error: any) {
      console.error("Fetch error:", error.response?.data || error.message);
      setMessage("Failed to fetch categories.");
    }
  };

  // Create a new category
  const uploadCategory = async () => {
    if (!name.trim()) {
      setMessage("Category name cannot be empty.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:4000/api/categories",
        { name: name.trim() },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          withCredentials: true,
        }
      );
      setMessage("Category added.");
      setName("");
      fetchCategories();
    } catch (error: any) {
      console.error("Upload error:", error.response?.data || error.message);
      setMessage("Failed to add category.");
    }
  };

  // Update an existing category
  const updateCategory = async () => {
    if (!editId) return;
    if (!name.trim()) {
      setMessage("Category name cannot be empty.");
      return;
    }

    try {
      await axios.put(
        `http://localhost:4000/api/categories/${editId}`,
        { name: name.trim() },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          withCredentials: true,
        }
      );
      setMessage("Category updated.");
      setName("");
      setEditId(null);
      fetchCategories();
    } catch (error: any) {
      console.error("Update error:", error.response?.data || error.message);
      setMessage("Failed to update category.");
    }
  };

  // Delete a category by ID
  const deleteCategory = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      await axios.delete(`http://localhost:4000/api/categories/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        withCredentials: true,
      });
      setMessage("Category deleted.");
      fetchCategories();
    } catch (error: any) {
      console.error("Delete error:", error.response?.data || error.message);
      setMessage("Failed to delete category.");
    }
  };

  // Handle form submission (add or update)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) {
      setMessage("Access token missing. Please log in.");
      return;
    }
    if (editId) updateCategory();
    else uploadCategory();
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Manage Categories</h2>

      {message && (
        <p className="mb-2 text-green-600 dark:text-green-400">{message}</p>
      )}

      <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 flex-grow rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          {editId ? "Update" : "Add"}
        </button>
      </form>

      <ul>
        {categories.map((cat) => (
          <li
            key={cat._id}
            className="flex justify-between items-center border-b py-2"
          >
            <span>{cat.name}</span>
            <div className="space-x-3">
              <button
                onClick={() => {
                  setName(cat.name);
                  setEditId(cat._id);
                  setMessage("");
                }}
                className="text-blue-600 hover:text-blue-800"
                aria-label="Edit category"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => deleteCategory(cat._id)}
                className="text-red-600 hover:text-red-800"
                aria-label="Delete category"
              >
                <FaTrash />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryManager;
