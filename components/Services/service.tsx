import React, { useState, FormEvent, ChangeEvent, useEffect } from "react";
import { useDispatch } from "react-redux";
import { uploadServices, fetchServices } from "../../state/Services/services.action-creators";
import { useTypedSelector } from "../../hooks";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { RootState } from "../../state";
import axios from "axios";

const ServiceManager = () => {
  const dispatch = useDispatch<ThunkDispatch<RootState, void, AnyAction>>();

  const [submittedServices, setSubmittedServices] = useState<any[]>([]);

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

  const onSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const success = await dispatch<any>(uploadServices(services));
      console.log("Upload success:", success);

      if (success) {
        await dispatch<any>(fetchServices());
        fetchSubmittedServices(); // Refresh the table
        setMessage("Services uploaded successfully.");
      } else {
        setMessage("Failed to upload services.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setMessage("Failed to upload services.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-center text-2xl font-bold mb-4">Add Services</h1>
      {message && (
        <div
          className={`p-3 rounded mb-4 ${
            message.includes("successfully")
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

            <button
              type="button"
              onClick={() => removeService(index)}
              className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-red-700 to-red-500 px-6 py-3 text-white shadow-md transition-all duration-300 hover:shadow-lg"
            >
              Remove Service
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addService}
          className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-950 to-teal-500 px-6 py-3 text-white shadow-md transition-all duration-300 hover:shadow-lg"
        >
          Add Service
        </button>

        <button
          type="submit"
          className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-950 to-teal-500 px-6 py-3 text-white shadow-md transition-all duration-300 hover:shadow-lg w-full mt-6"
        >
          Submit Services
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
