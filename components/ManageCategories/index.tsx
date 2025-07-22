import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";

const CategoryManager: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setAccessToken(token);
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/categories", {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setCategories(response.data);
    } catch (error) {
      console.error("Fetch error", error);
    }
  };

  const uploadCategory = async () => {
    if (!name.trim()) {
      setMessage("Category name is required.");
      return;
    }
    try {
      await axios.post(
        "http://localhost:4000/api/categories",
        { name: name.trim(), description: description.trim() },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );
      setMessage("Category added.");
      setName("");
      setDescription("");
      fetchCategories();
    } catch (error: any) {
      console.error("Upload error:", error.response?.data || error.message);
      setMessage(error.response?.data?.message || "Failed to add category.");
    }
  };

  const updateCategory = async () => {
    if (!editId) return;
    if (!name.trim()) {
      setMessage("Category name is required.");
      return;
    }
    try {
      await axios.put(
        `http://localhost:4000/api/categories/${editId}`,
        { name: name.trim(), description: description.trim() },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );
      setMessage("Category updated.");
      setName("");
      setDescription("");
      setEditId(null);
      fetchCategories();
    } catch (error: any) {
      console.error("Update error:", error.response?.data || error.message);
      setMessage(error.response?.data?.message || "Failed to update category.");
    }
  };

  const deleteCategory = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      await axios.delete(`http://localhost:4000/api/categories/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      });
      setMessage("Category deleted.");
      fetchCategories();
    } catch (error) {
      console.error("Delete error", error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) {
      setMessage("Please login first.");
      return;
    }
    if (editId) updateCategory();
    else uploadCategory();
  };

  const startEditing = (cat: any) => {
    setName(cat.name);
    setDescription(cat.description || "");
    setEditId(cat._id);
  };

  useEffect(() => {
    if (accessToken) {
      fetchCategories();
    }
  }, [accessToken]);

  return (
    <div className="p-4 flex flex-col items-center justify-center">
      <h2 className="text-xl font-bold mb-4">Manage Categories</h2>
      {message && <p className="mb-2 text-green-600">{message}</p>}

      <form onSubmit={handleSubmit} className="mb-4 space-y-2">
        <input
          type="text"
          placeholder="Category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 w-full"
          required
        />
        <input
          type="text"
          placeholder="Category description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 w-full"
        />
        <div className="flex justify-center">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2">
            {editId ? "Update" : "Add"}
          </button>
        </div>
      </form>

      <ul className="w-full max-w-2xl">
        {categories.map((cat) => (
          <li key={cat._id} className="flex justify-between items-center border-b py-2">
            <div>
              <p className="font-semibold">{cat.name}</p>
              <p className="text-gray-600 text-sm">{cat.description}</p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => startEditing(cat)}
                className="text-blue-500"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => deleteCategory(cat._id)}
                className="text-red-500"
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