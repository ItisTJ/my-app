import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { fetchFooter } from "../../state/Footer/footer.action-creators";

const BranchManager = () => {
  const dispatch = useDispatch();

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
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setMessage("File size should be under 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      if (result.startsWith("data:image")) {
        setForm((prevForm) => ({ ...prevForm, image: result }));
        setPreviewUrl(result);
      } else {
        setMessage("Invalid image format.");
      }
    };
    reader.onerror = () => {
      console.error("Error reading file:", reader.error);
      setMessage("Error loading image. Please try a different one.");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!form.city.trim()) newErrors.city = "City cannot be empty.";
    if (!form.contact.trim()) newErrors.contact = "Contact Number cannot be empty.";
    else if (!/^\d{10,15}$/.test(form.contact)) newErrors.contact = "Invalid contact number.";

    if (!form.openAt.trim()) newErrors.openAt = "Open Time cannot be empty.";
    if (!form.closeAt.trim()) newErrors.closeAt = "Close Time cannot be empty.";

    if (!form.location.trim()) newErrors.location = "Location cannot be empty.";
    else if (!/^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/.test(form.location))
      newErrors.location = "Invalid URL format.";

    if (!form.image.trim()) newErrors.image = "Image is required.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    try {
      if (editingBranchId) {
        await axios.put(`http://localhost:4000/api/branches/${editingBranchId}`, form);
        dispatch(fetchFooter());
        setMessage("Branch updated successfully.");
        setEditingBranchId(null);
      } else {
        await axios.post("http://localhost:4000/api/branches", form);
        dispatch(fetchFooter());
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
      setErrors({});
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
      dispatch(fetchFooter());
      setMessage("Branch deleted successfully.");
      fetchBranches();
      setForm({
        city: "",
        image: "",
        contact: "",
        openAt: "",
        closeAt: "",
        location: ""
      });
      setPreviewUrl(null);
    } catch (error) {
      console.error("Error deleting branch:", error);
      setMessage("Error deleting branch.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Form Section */}
      <div className="border rounded p-6 mb-8 bg-white shadow w-full">
        <h1 className="text-2xl font-bold mb-6 mt-4 text-center">
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
        <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
          <div>
            <label className="block font-semibold mb-1">City</label>
            <input
              type="text"
              className="w-full border p-2 rounded"
              value={form.city}
              onChange={(e) => handleChange("city", e.target.value)}
            />
            {errors.city && <p className="text-red-600 text-sm mt-1">{errors.city}</p>}
          </div>
          <div>
            <label className="block font-semibold mb-1">Contact Number</label>
            <input
              type="text"
              className="w-full border p-2 rounded"
              value={form.contact}
              onChange={(e) => handleChange("contact", e.target.value)}
            />
            {errors.contact && <p className="text-red-600 text-sm mt-1">{errors.contact}</p>}
          </div>
          <div>
            <label className="block font-semibold mb-1">Open Time</label>
            <input
              type="time"
              className="w-full border p-2 rounded"
              value={form.openAt}
              onChange={(e) => handleChange("openAt", e.target.value)}
            />
            {errors.openAt && <p className="text-red-600 text-sm mt-1">{errors.openAt}</p>}
          </div>
          <div>
            <label className="block font-semibold mb-1">Close Time</label>
            <input
              type="time"
              className="w-full border p-2 rounded"
              value={form.closeAt}
              onChange={(e) => handleChange("closeAt", e.target.value)}
            />
            {errors.closeAt && <p className="text-red-600 text-sm mt-1">{errors.closeAt}</p>}
          </div>
          <div>
            <label className="block font-semibold mb-1">Location (URL in the map)</label>
            <input
              type="text"
              className="w-full border p-2 rounded"
              value={form.location}
              onChange={(e) => handleChange("location", e.target.value)}
            />
            {errors.location && <p className="text-red-600 text-sm mt-1">{errors.location}</p>}
          </div>
          <div>
            <label className="block font-semibold mb-1">Image</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {errors.image && <p className="text-red-600 text-sm mt-1">{errors.image}</p>}
            {previewUrl && (
              <img
                src={previewUrl}
                alt="preview"
                className="mt-2 w-full max-h-[400px] object-contain border rounded shadow"
              />
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-950 to-teal-500 text-white py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
          >
            {editingBranchId ? "Save Changes" : "Submit Branch"}
          </button>
        </form>
      </div>

      {/* Table Section */}
      <div className="border rounded p-6 bg-white shadow w-full overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4">Submitted Branches</h2>
        {loading ? (
          <p>Loading branches...</p>
        ) : (
          <table className="min-w-full text-left whitespace-nowrap">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-2 py-1">City</th>
                <th className="px-2 py-1">Contact</th>
                <th className="px-2 py-1">Open</th>
                <th className="px-2 py-1">Close</th>
                <th className="px-2 py-1 max-w-[200px]">Location</th>
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
                  <td className="px-2 py-1 break-words max-w-[200px]">
                    <span className="block overflow-hidden text-ellipsis">
                      {branch.location}
                    </span>
                  </td>
                  <td className="px-2 py-1">
                    {branch.image && (
                      <img
                        src={branch.image}
                        alt="branch"
                        className="w-20 h-20 object-cover rounded shadow"
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
