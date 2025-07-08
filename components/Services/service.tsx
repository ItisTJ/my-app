import React, { useState, FormEvent, ChangeEvent, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  uploadServices,
  fetchServices,
  deleteService,
  editService
} from "../../state/Services/services.action-creators";
import { useTypedSelector } from "../../hooks";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { RootState } from "../../state";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import { FaDeleteLeft, FaRecycle, FaTrash } from "react-icons/fa6";

const ServiceManager = () => {
  const dispatch = useDispatch<ThunkDispatch<RootState, void, AnyAction>>();

  const [submittedServices, setSubmittedServices] = useState<any[]>([]);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchServices());
    fetchSubmittedServices();
  }, [dispatch]);

  const fetchSubmittedServices = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/services");
      setSubmittedServices(response.data);
    } catch (error) {
      console.error("Error fetching services list:", error);
    }
  };

  const { loading, error } = useTypedSelector(
    (state) => state.services || { loading: false, error: null }
  );

  const [services, setServices] = useState([
    { title: "", description: "", image: "" }
  ]);
  const [message, setMessage] = useState<string | null>(null);
  const [previewUrls, setPreviewUrls] = useState<(string | null)[]>([null]);

  const handleChange = (index: number, field: string, value: string) => {
    const updated = [...services];
    (updated[index] as any)[field] = value;
    setServices(updated);
  };

  const handleImageChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        const updated = [...services];
        updated[index].image = base64;
        setServices(updated);

        const newPreviews = [...previewUrls];
        newPreviews[index] = base64;
        setPreviewUrls(newPreviews);
      };
      reader.readAsDataURL(file);
    }
  };

  const addService = () => {
    setServices([...services, { title: "", description: "", image: "" }]);
    setPreviewUrls([...previewUrls, null]);
  };

  const removeService = (index: number) => {
    const updated = services.filter((_, i) => i !== index);
    const updatedPreviews = previewUrls.filter((_, i) => i !== index);
    setServices(updated);
    setPreviewUrls(updatedPreviews);
  };

  // ✅ UPDATED: use editService action
  const onSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (editingServiceId) {
        // Dispatch edit action
        const success = await dispatch(editService(editingServiceId, services[0]));
        if (success) {
          setMessage("Service updated successfully.");
          setEditingServiceId(null);
          setServices([{ title: "", description: "", image: "" }]);
          setPreviewUrls([null]);
        } else {
          setMessage("Failed to update service.");
        }
      } else {
        // Adding new services
        const success = await dispatch<any>(uploadServices(services));
        if (success) {
          setMessage("Services uploaded successfully.");
        } else {
          setMessage("Failed to upload services.");
        }
      }
      await dispatch<any>(fetchServices());
      fetchSubmittedServices();
    } catch (error) {
      console.error("Upload error:", error);
      setMessage("Error submitting services.");
    }
  };

  const handleEdit = (service: any) => {
    setEditingServiceId(service._id);
    setServices([
      { title: service.title, description: service.description, image: service.image }
    ]);
    setPreviewUrls([service.image || null]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ✅ UPDATED: use deleteService action
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;
    try {
      const success = await dispatch(deleteService(id));
      if (success) {
        setMessage("Service deleted successfully.");
        await dispatch<any>(fetchServices());
        fetchSubmittedServices();
      } else {
        setMessage("Failed to delete service.");
      }
    } catch (error) {
      console.error("Delete error:", error);
      setMessage("Error deleting service.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-center text-2xl font-bold mb-4">
        {editingServiceId ? "Edit Service" : "Add Services"}
      </h1>
      {message && (
        <div
          className={`p-3 rounded mb-4 ${
            message.includes("success")
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {message}
          <button
            onClick={() => setMessage(null)}
            className="float-right px-3 py-1 text-xl"
          >
            &times;
          </button>
        </div>
      )}
      <form onSubmit={onSubmitHandler} className="space-y-6">
        {services.map((service, index) => (
          <div key={index} className="border rounded p-4 space-y-4">
            <div>
              <label className="block font-bold mb-1">Title</label>
              <input
                type="text"
                className="w-full border p-2 rounded"
                value={service.title}
                onChange={(e) => handleChange(index, "title", e.target.value)}
              />
            </div>
            <div>
              <label className="block font-bold mb-1">Service Description</label>
              <textarea
                className="w-full border p-2 rounded"
                rows={4}
                value={service.description}
                onChange={(e) =>
                  handleChange(index, "description", e.target.value)
                }
              ></textarea>
            </div>
            <div>
              <label className="block font-bold mb-1">Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(index, e)}
              />
              {previewUrls[index] && (
                <img
                  src={previewUrls[index]!}
                  alt="preview"
                  className="w-full h-auto mt-2 rounded"
                />
              )}
            </div>
            {services.length > 1 && (
              <button
                type="button"
                onClick={() => removeService(index)}
                className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-red-700 to-red-500 px-6 py-3 text-white shadow-md transition-all duration-300 hover:shadow-lg"
              >
                Remove Service
              </button>
            )}
          </div>
        ))}
        {!editingServiceId && (
          <button
            type="button"
            onClick={addService}
            className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-950 to-teal-500 px-6 py-3 text-white shadow-md transition-all duration-300 hover:shadow-lg"
          >
            Add Service
          </button>
        )}
        <button
          type="submit"
          className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-950 to-teal-500 px-6 py-3 text-white shadow-md transition-all duration-300 hover:shadow-lg w-full mt-6"
        >
          {editingServiceId ? "Save Changes" : "Submit Services"}
        </button>
      </form>

      <h2 className="text-xl font-semibold mt-10 mb-4">Submitted Services</h2>
      {loading ? (
        <p className="text-gray-600">Loading services...</p>
      ) : error ? (
        <p className="text-red-600">Error: {error}</p>
      ) : (
        <div className="overflow-x-auto border rounded-lg">
          <table className="min-w-full table-auto border-collapse text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2">Title</th>
                <th className="border px-4 py-2">Description</th>
                <th className="border px-4 py-2">Image</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {submittedServices.map((service, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-2">{service.title}</td>
                  <td className="px-4 py-2">{service.description}</td>
                  <td className="px-4 py-2">
                    {service.image && (
                      <img
                        src={service.image}
                        alt="service"
                        className="w-24 h-auto rounded shadow"
                      />
                    )}
                  </td>
                  <td className="px-4 py-2 flex space-x-2">
                    <button
                      onClick={() => handleEdit(service)}
                      className="text-blue-600 hover:text-blue-800 text-lg"
                      title="Edit"
                    >
                      <FaEdit color="black"/>
                    </button>
                    <button
                      onClick={() => handleDelete(service._id)}
                      className="text-red-600 hover:text-red-800 text-lg"
                      title="Delete"
                    >
                      <FaTrash/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ServiceManager;
