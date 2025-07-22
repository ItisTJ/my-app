import React, { useState, FormEvent, ChangeEvent, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  uploadServices,
  fetchServices,
  deleteService,
  editService,
} from "../../state/Services/services.action-creators";
import { fetchFooter } from "../../state/Footer/footer.action-creators";
import { useTypedSelector } from "../../hooks";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { RootState } from "../../state";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";

interface Service {
  title: string;
  description: string;
  image: string;
}

interface ServiceErrors {
  title?: string;
  description?: string;
  image?: string;
}

const ServiceManager = () => {
  const dispatch = useDispatch<ThunkDispatch<RootState, void, AnyAction>>();

  const [submittedServices, setSubmittedServices] = useState<Service[]>([]);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);

  const { loading, error } = useTypedSelector(
    (state) => state.services || { loading: false, error: null }
  );

  const [services, setServices] = useState<Service[]>([
    { title: "", description: "", image: "" },
  ]);
  const [previewUrls, setPreviewUrls] = useState<(string | null)[]>([null]);
  const [message, setMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<ServiceErrors[]>([]);

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

  const handleChange = (index: number, field: keyof Service, value: string) => {
    const updated = [...services];
    updated[index] = { ...updated[index], [field]: value };
    setServices(updated);

    // Clear error on change for that field
    const newErrors = [...errors];
    if (newErrors[index]) {
      newErrors[index][field] = undefined;
      setErrors(newErrors);
    }
  };

  const handleImageChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        const newErrors = [...errors];
        if (!newErrors[index]) newErrors[index] = {};
        newErrors[index].image = "File size must be under 2MB.";
        setErrors(newErrors);
        return;
      } else {
        // Clear image error if any
        const newErrors = [...errors];
        if (newErrors[index]) {
          newErrors[index].image = undefined;
          setErrors(newErrors);
        }
      }
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
    setErrors([...errors, {}]);
  };

  const removeService = (index: number) => {
    const updated = services.filter((_, i) => i !== index);
    const updatedPreviews = previewUrls.filter((_, i) => i !== index);
    const updatedErrors = errors.filter((_, i) => i !== index);
    setServices(updated);
    setPreviewUrls(updatedPreviews);
    setErrors(updatedErrors);
  };

  const clearForm = () => {
    setServices([{ title: "", description: "", image: "" }]);
    setPreviewUrls([null]);
    setEditingServiceId(null);
    setErrors([]);
  };

  // Validation function
  const validateServices = (): boolean => {
    const validationErrors: ServiceErrors[] = services.map((service) => {
      const err: ServiceErrors = {};

      if (typeof service.title !== "string" || !service.title.trim()) {
        err.title = "Title cannot be empty.";
      }

      if (
        typeof service.description !== "string" ||
        !service.description.trim()
      ) {
        err.description = "Description cannot be empty.";
      }

      if (typeof service.image !== "string" || !service.image.trim()) {
        err.image = "Image is required.";
      }

      return err;
    });

    const hasErrors = validationErrors.some(
      (err) => err.title || err.description || err.image
    );

    setErrors(validationErrors);
    return !hasErrors;
  };

  const onSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateServices()) {
      setMessage("Please fill all the fields before submittin.");
      return;
    }

    try {
      let success = false;
      if (editingServiceId) {
        success = await dispatch(editService(editingServiceId, services[0]));
      } else {
        success = await dispatch<any>(uploadServices(services));
      }

      if (success) {
        await Promise.all([
          dispatch(fetchFooter()),
          dispatch<any>(fetchServices()),
        ]);
        await fetchSubmittedServices();

        setMessage(
          editingServiceId
            ? "Service updated successfully."
            : "Services uploaded successfully."
        );
        clearForm();
      } else {
        setMessage(
          editingServiceId
            ? "Failed to update service."
            : "Failed to upload services."
        );
      }
    } catch (error) {
      console.error("Upload error:", error);
      setMessage("Error submitting services.");
    }
  };

  const handleEdit = (service: Service & { _id: string }) => {
    setEditingServiceId(service._id);
    setServices([
      { title: service.title, description: service.description, image: service.image },
    ]);
    setPreviewUrls([service.image || null]);
    setErrors([{}]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;
    try {
      const success = await dispatch(deleteService(id));
      if (success) {
        await Promise.all([
          dispatch(fetchFooter()),
          dispatch<any>(fetchServices()),
        ]);
        await fetchSubmittedServices();

        setMessage("Service deleted successfully.");
        clearForm();
      } else {
        setMessage("Failed to delete service.");
      }
    } catch (error) {
      console.error("Delete error:", error);
      setMessage("Error deleting service.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 mt-4 text-center">
        {editingServiceId ? "Edit Service" : "Add Services"}
      </h1>

      {message && (
        <div
          className={`p-3 mb-4 rounded ${
            message.toLowerCase().includes("success")
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {message}
          <button
            onClick={() => setMessage(null)}
            className="float-right font-bold"
            aria-label="Dismiss message"
          >
            &times;
          </button>
        </div>
      )}

      <form
        onSubmit={onSubmitHandler}
        className="space-y-6 border rounded p-6 mb-8 bg-white shadow w-full"
      >
        {services.map((service, index) => (
          <div
            key={index}
            className="space-y-4 border rounded p-4 bg-white shadow"
          >
            <div>
              <label className="block font-semibold mb-1">Title</label>
              <input
                type="text"
                className={`w-full border p-2 rounded ${
                  errors[index]?.title ? "border-red-600" : ""
                }`}
                value={service.title}
                onChange={(e) => handleChange(index, "title", e.target.value)}
              />
              {errors[index]?.title && (
                <p className="text-red-600 text-sm mt-1">{errors[index]?.title}</p>
              )}
            </div>
            <div>
              <label className="block font-semibold mb-1">Service Description</label>
              <textarea
                className={`w-full border p-2 rounded ${
                  errors[index]?.description ? "border-red-600" : ""
                }`}
                rows={4}
                value={service.description}
                onChange={(e) =>
                  handleChange(index, "description", e.target.value)
                }
              ></textarea>
              {errors[index]?.description && (
                <p className="text-red-600 text-sm mt-1">
                  {errors[index]?.description}
                </p>
              )}
            </div>
            <div>
              <label className="block font-semibold mb-1">Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(index, e)}
                className={errors[index]?.image ? "border-red-600" : ""}
              />
              {errors[index]?.image && (
                <p className="text-red-600 text-sm mt-1">{errors[index]?.image}</p>
              )}
              {previewUrls[index] && (
                <img
                  src={previewUrls[index]!}
                  alt="preview"
                  className="mt-2 w-full max-h-[400px] object-contain border rounded shadow"
                />
              )}
            </div>
            {services.length > 1 && (
              <button
                type="button"
                onClick={() => removeService(index)}
                className="bg-gradient-to-r from-red-700 to-red-500 text-white px-4 py-2 rounded-lg shadow hover:shadow-lg transition-all duration-300"
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
            className="bg-gradient-to-r from-blue-950 to-teal-500 text-white px-6 py-3 rounded-lg shadow hover:shadow-lg transition duration-300"
          >
            Add Service
          </button>
        )}

        <button
          type="submit"
          className="bg-gradient-to-r from-blue-950 to-teal-500 text-white px-6 py-3 rounded-lg shadow hover:shadow-lg transition duration-300 w-full mt-6"
        >
          {editingServiceId ? "Save Changes" : "Submit Services"}
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-4">Submitted Services</h2>
      {loading ? (
        <p>Loading services...</p>
      ) : error ? (
        <p className="text-red-600">Error: {error}</p>
      ) : (
        <div className="border rounded p-6 bg-white shadow w-full overflow-x-auto">
          <table className="min-w-full text-left whitespace-nowrap">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-2 py-1 border">Title</th>
                <th className="px-2 py-1 border max-w-[400px]">Description</th>
                <th className="px-2 py-1 border">Image</th>
                <th className="px-2 py-1 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {submittedServices.map((service) => (
                <tr key={service._id} className="border-t">
                  <td className="px-2 py-1">{service.title}</td>
                  <td
                    className="px-2 py-1 max-w-xs overflow-hidden whitespace-nowrap overflow-ellipsis"
                    title={service.description}
                  >
                    {service.description}
                  </td>
                  <td className="px-2 py-1">
                    {service.image && (
                      <img
                        src={service.image}
                        alt="service"
                        className="w-20 h-20 object-cover rounded shadow"
                      />
                    )}
                  </td>
                  <td className="px-2 py-1 flex space-x-2">
                    <button
                      onClick={() => handleEdit(service)}
                      className="text-blue-600 hover:text-blue-800"
                      aria-label="Edit service"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(service._id)}
                      className="text-red-600 hover:text-red-800"
                      aria-label="Delete service"
                    >
                      <FaTrash />
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
