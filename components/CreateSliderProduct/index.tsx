import { FormEvent, useState, useEffect, ChangeEvent } from "react";
import { useTypedSelector } from "../../hooks";
import FormContainer from "../../components/FormContainer"; // Optional: Replace with Tailwind layout if needed
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { proshopAPI } from "../../lib";

const SliderUpload = () => {
  const initialData = {
    name: "Sample Name",
    description: "Sample Description",
    image: "",
  };

  const { loading, error, success } = useTypedSelector((state) => state.slider);

  const [sliderData, setSliderData] = useState(initialData);
  const [message, setMessage] = useState<string | null | string[]>(error);
  const [uploading, setUploading] = useState<boolean>(false);

  useEffect(() => {
    setMessage(error);
  }, [error]);

  const onSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { name, description, image } = sliderData;

    if (!name || !description || !image) {
      setMessage("All fields are required.");
      return;
    }

    try {
      const config = {
        headers: { "Content-Type": "application/json" },
      };

      const response = await proshopAPI.post(
        "/api/slider/upload",
        { name, description, image },
        config
      );

      console.log("Response:", response.data);
      window.location.reload();
      setSliderData(initialData);
    } catch (error) {
      console.error("Upload Error:", error);
      setMessage("Failed to upload slider item.");
    }
  };

  const uploadFileHandler = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const config = {
        headers: { "Content-Type": "multipart/form-data" },
      };

      const { data } = await proshopAPI.post("/api/upload", formData, config);

      console.log("Image URL:", data);
      setSliderData({ ...sliderData, image: data });
    } catch (error) {
      console.error("Image Upload Error:", error);
      setMessage("Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 mt-10 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-semibold mb-6">Upload Slider Item</h1>

      {message && (
        <Message variant="danger">{message}</Message>
      )}

      {loading && <Loader />}

      <form onSubmit={onSubmitHandler} className="space-y-4">
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm pb-2 font-medium text-gray-700">
            Slider Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Enter name"
            value={sliderData.name}
            onChange={(e) => setSliderData({ ...sliderData, name: e.target.value })}
            className="mt-1 block w-full rounded-md border pb-2 border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
        </div>

        {/* Description Field */}
        <div>
          <label htmlFor="description" className="block text-sm pb-2 font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            placeholder="Enter description"
            value={sliderData.description}
            onChange={(e) => setSliderData({ ...sliderData, description: e.target.value })}
            rows={4}
            className="mt-1 block w-full rounded-md border pb-2 border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
        </div>

        {/* Image Upload Field */}
        <div>
          <label htmlFor="image" className="block pb-2 text-sm font-medium text-gray-700">
            Image
          </label>
          <input
            id="image"
            type="file"
            onChange={uploadFileHandler}
            className="mt-1 block w-full pb-2 text-sm text-gray-900 file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0 file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {uploading && <Loader />}
        </div>

        <button
          type="submit"
          className="secondary w-full opacity-90 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
        >
          Upload
        </button>
      </form>

      <div className="mt-6 text-center text-sm">
        View Slider Items?{" "}
        <a href="/admin/slider" className="text-black hover:underline">
          Go to Slider
        </a>
      </div>
    </div>
  );
};

export default SliderUpload;
