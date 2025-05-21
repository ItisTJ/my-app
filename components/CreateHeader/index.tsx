import { useEffect, useState, FormEvent, ChangeEvent } from "react";
<<<<<<< HEAD
import { useTypedSelector } from "../../hooks";
=======
import Link from "next/link";
import { Button, Col, Form, Row, Table, Image } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useAdmin, useTypedSelector } from "../../hooks";
>>>>>>> tjsBranch
import { fetchHeader } from "../../state/Header/header.action-creators";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import FormContainer from "../../components/FormContainer";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { proshopAPI } from "../../lib";

const HeaderManager = () => {
  useAdmin();
  
  const dispatch = useAppDispatch();
  const { loading, error, data } = useTypedSelector((state) => state.header || { loading: false, error: null, data: [] });

  const header = Array.isArray(data) && data.length > 0 ? data[0] : null;

  const [headerData, setHeaderData] = useState({
    name: header?.name || "Sample name",
    color: header?.color || "#000000",
    image: header?.image || "",
    items: header?.items || []
  });

  const [message, setMessage] = useState<string | null | string[]>(error);
  const [uploading, setUploading] = useState<boolean>(false);

  useEffect(() => {
    dispatch(fetchHeader());
  }, [dispatch]);

  useEffect(() => {
    if (header) {
      setHeaderData({
        name: header.name,
        color: header.color || "#000000",
        image: header.image,
        items: header.items || []
      });
    }
  }, [header]);

  const onSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { name, color, image } = headerData;

    if (!name || !color || !image) {
      setMessage("All fields are required.");
      return;
    }

    try {
      const config = {
        headers: { "Content-Type": "application/json" },
        withCredentials: true
      };

      await proshopAPI.post("/api/header/upload", { name, color, image, items: headerData.items }, config);
      window.location.reload();

      setHeaderData({ name: "", color: "#000000", image: "", items: [] });
    } catch (error) {
      console.error("Upload Error:", error);
      setMessage("Failed to upload header item.");
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

      const { data } = await proshopAPI.post("/api/uploadLogo", formData, config);
      setHeaderData({ ...headerData, image: data });
    } catch (error) {
      console.error("Image Upload Error:", error);
      setMessage("Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="">
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <FormContainer>
          <h2 className="text-2xl font-bold mb-6">Update Header</h2>

          {message && <Message variant="danger">{message}</Message>}
          {loading && <Loader />}

          <form onSubmit={onSubmitHandler} className="space-y-6">
            {/* Business Name */}
            <div>
              <label htmlFor="name" className="block font-medium text-gray-700">
                Business Name
              </label>
              <div className="flex flex-col md:flex-row md:items-center gap-2 mt-1">
                <input
                  type="text"
                  id="name"
                  className="w-full md:w-1/2 border border-gray-300 p-2 rounded"
                  value={headerData.name}
                  placeholder="Enter name"
                  onChange={(e) => setHeaderData({ ...headerData, name: e.target.value })}
                />
                <p className="text-sm text-gray-500">{header?.name || "No data"}</p>
              </div>
            </div>

            {/* Color Picker */}
            <div>
              <label htmlFor="color" className="block font-medium text-gray-700">
                Select Header Color
              </label>
              <div className="flex flex-col md:flex-row md:items-center gap-2 mt-1">
                <input
                  type="color"
                  id="color"
                  className="w-20 h-10"
                  value={headerData.color}
                  onChange={(e) => setHeaderData({ ...headerData, color: e.target.value })}
                />
                <p className="text-sm text-gray-500">Selected Color: {header?.color || "#000000"}</p>
              </div>
            </div>

            {/* Logo Upload */}
            <div>
              <label htmlFor="image" className="block font-medium text-gray-700">
                Logo Image
              </label>
              <div className="flex flex-col md:flex-row md:items-center gap-4 mt-1">
                <input type="file" id="image" onChange={uploadFileHandler} className="block" />
                {uploading && <Loader />}
                {header?.image && (
                  <div>
                    <p className="text-sm text-gray-500">Current Logo:</p>
                    <img src={header?.image} alt="Current Logo" className="w-24 h-24 object-contain" />
                  </div>
                )}
              </div>
            </div>

            {/* Header Items */}
            <div>
              <label className="block font-medium text-gray-700 mb-2">Header Items</label>
              {headerData.items.map((item: string, index: number) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    className="flex-1 border border-gray-300 p-2 rounded"
                    placeholder={`Item ${index + 1}`}
                    value={item}
                    onChange={(e) => {
                      const updatedItems = [...headerData.items];
                      updatedItems[index] = e.target.value;
                      setHeaderData({ ...headerData, items: updatedItems });
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updatedItems = headerData.items.filter((_:string, i:number) => i !== index);
                      setHeaderData({ ...headerData, items: updatedItems });
                    }}
                    className="bg-gray-900 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setHeaderData({ ...headerData, items: [...headerData.items, ""] })}
                className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-gray-700"
              >
                Add Item
              </button>
            </div>

            <button type="submit" className="bg-gray-900 text-white px-6 py-2 rounded hover:bg-blue-700">
              Update Header
            </button>
          </form>
        </FormContainer>
      )}
    </div>
  );
};

export default HeaderManager;
