import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";

const BranchManager = () => {
  const [branches, setBranches] = useState<any[]>([]);
  const [editingBranchId, setEditingBranchId] = useState<string | null>(null);
  const [form, setForm] = useState({
    city: "",
    image: "",
    contact: "",
    openAt: "",
    closeAt: "",
    location: ""
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchBranches = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:4000/api/branches");
      setBranches(response.data);
    } catch (error) {
      console.error("Error fetching branches:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setForm({ ...form, image: base64 });
        setPreviewUrl(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (editingBranchId) {
        await axios.put(`http://localhost:4000/api/branches/${editingBranchId}`, form);
        setMessage("Branch updated successfully.");
        setEditingBranchId(null);
      } else {
        await axios.post("http://localhost:4000/api/branches", form);
        setMessage("Branch added successfully.");
      }
      setForm({
        city: "",
        image: "",
        contact: "",
        openAt: "",
        closeAt: "",
        location: ""
      });
      setPreviewUrl(null);
      fetchBranches();
    } catch (error) {
      console.error("Error saving branch:", error);
      setMessage("Error saving branch.");
    }
  };

  const handleEdit = (branch: any) => {
    setEditingBranchId(branch._id);
    setForm({
      city: branch.city,
      image: branch.image,
      contact: branch.contact,
      openAt: branch.openAt,
      closeAt: branch.closeAt,
      location: branch.location
    });
    setPreviewUrl(branch.image || null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this branch?")) return;
    try {
      await axios.delete(`http://localhost:4000/api/branches/${id}`);
      setMessage("Branch deleted successfully.");
      fetchBranches();
    } catch (error) {
      console.error("Error deleting branch:", error);
      setMessage("Error deleting branch.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Form Section */}
      <div className="border rounded p-6 mb-8 w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">
          {editingBranchId ? "Edit Branch" : "Add Branch"}
        </h1>
        {message && (
          <div
            className={`p-3 mb-4 rounded ${
              message.includes("success")
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {message}
            <button onClick={() => setMessage(null)} className="float-right font-bold">
              &times;
            </button>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">City</label>
            <input
              type="text"
              className="w-full border p-2 rounded"
              value={form.city}
              onChange={(e) => handleChange("city", e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Contact Number</label>
            <input
              type="text"
              className="w-full border p-2 rounded"
              value={form.contact}
              onChange={(e) => handleChange("contact", e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Open Time</label>
            <input
              type="time"
              className="w-full border p-2 rounded"
              value={form.openAt}
              onChange={(e) => handleChange("openAt", e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Close Time</label>
            <input
              type="time"
              className="w-full border p-2 rounded"
              value={form.closeAt}
              onChange={(e) => handleChange("closeAt", e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Location</label>
            <input
              type="text"
              className="w-full border p-2 rounded"
              value={form.location}
              onChange={(e) => handleChange("location", e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Image</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {previewUrl && (
              <img
                src={previewUrl}
                alt="preview"
                className="mt-2 w-full max-h-48 object-cover rounded"
              />
            )}
          </div>

          {/* ✅ Submit Branch Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-950 to-teal-500 text-white py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
          >
            {editingBranchId ? "Save Changes" : "Submit Branch"}
          </button>
        </form>
      </div>

      {/* Table Section */}
      <div className="border rounded p-6 w-full">
        <h2 className="text-xl font-semibold mb-4">Branches</h2>
        {loading ? (
          <p>Loading branches...</p>
        ) : (
          <table className="w-full table-auto text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-2 py-1">City</th>
                <th className="px-2 py-1">Contact</th>
                <th className="px-2 py-1">Open</th>
                <th className="px-2 py-1">Close</th>
                <th className="px-2 py-1">Location</th>
                <th className="px-2 py-1">Image</th>
                <th className="px-2 py-1">Actions</th>
              </tr>
            </thead>
            <tbody>
              {branches.map((branch) => (
                <tr key={branch._id} className="border-t">
                  <td className="px-2 py-1">{branch.city}</td>
                  <td className="px-2 py-1">{branch.contact}</td>
                  <td className="px-2 py-1">{branch.openAt}</td>
                  <td className="px-2 py-1">{branch.closeAt}</td>
                  <td className="px-2 py-1 break-words">{branch.location}</td>
                  <td className="px-2 py-1">
                    {branch.image && (
                      <img
                        src={branch.image}
                        alt="branch"
                        className="w-16 h-auto rounded shadow"
                      />
                    )}
                  </td>
                  <td className="px-2 py-1 flex space-x-2">
                    <button
                      onClick={() => handleEdit(branch)}
                      className="text-blue-600 hover:text-blue-800"
                      aria-label="Edit branch"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(branch._id)}
                      className="text-red-600 hover:text-red-800"
                      aria-label="Delete branch"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default BranchManager;
