"use client";

import React, { useRef, useEffect, useState } from "react";
import { fabric } from "fabric";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import Loader from "../Loader";

interface ObjectWithControlId extends fabric.Object {
  _controlId?: string;
}

interface Banner {
  _id: string;
  title: string;
  image: string;
  productId: string;
  enable:boolean;
  createdAt?: string;
  updatedAt?: string;
}

const FabricCanvasEditor: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const [activeObject, setActiveObject] = useState<ObjectWithControlId | null>(null);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [editBannerId, setEditBannerId] = useState<string | null>(null);
  const [editedValues, setEditedValues] = useState<{ title: string; productId: string; enable?: boolean }>({
    title: "",
    productId: "",
  });

  // Fetch banners function
  const fetchBanners = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:4000/api/banner", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      
      if (!res.ok) {
        throw new Error(`Failed to fetch banners: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      setBanners(data || []); // Handle both direct array and wrapped response
      console.log("📦 Fetched banners:", data);
    } catch (err) {
      console.error("❌ Error fetching banners:", err);
      setBanners([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;

    // Get screen/container width (up to max of 800)
    const parentWidth = canvasEl.parentElement?.offsetWidth || 800;
    const width = parentWidth;
    const height = (width * 300) / 800; // Maintain 16:10 aspect ratio

    // Set canvas element dimensions
    canvasEl.width = width;
    canvasEl.height = height;

    // Create Fabric canvas
    const canvas = new fabric.Canvas(canvasEl, {
      backgroundColor: "white",
      width,
      height,
    });
    fabricRef.current = canvas;

    canvas.on("selection:created", (e) => {
      const obj = e.selected?.[0] as ObjectWithControlId;
      setActiveObject(obj);
      attachControls(obj);
    });
    canvas.on("selection:updated", (e) => {
      const obj = e.selected?.[0] as ObjectWithControlId;
      setActiveObject(obj);
      attachControls(obj);
    });
    canvas.on("selection:cleared", () => {
      setActiveObject(null);
      removeControls();
    });
    canvas.on("after:render", updateControlsPosition);
    canvas.on("object:modified", updateControlsPosition);
    canvas.on("object:moving", updateControlsPosition);

    return () => {
      canvas.dispose();
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedValues((prev) => ({ ...prev, [name]: value }));
  };

  const applyChanges = async () => {
    if (!editBannerId) return;
    try {
      const res = await fetch(`http://localhost:4000/api/banner/${editBannerId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedValues),
      });

      if (!res.ok) throw new Error("Update failed");

      alert("✅ Banner updated successfully");
      setEditBannerId(null);
      fetchBanners();
    } catch (err) {
      console.error("❌ Error updating banner:", err);
      alert("Update failed. See console.");
    }
  };

  const toggleEnable = async (bannerId: string, newEnable: boolean) => {
  try {
    setLoading(true);

    const res = await fetch(`http://localhost:4000/api/banner/${bannerId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enable: newEnable }),
    });

    if (!res.ok) throw new Error("Failed to update enable status");

    setBanners((prev) =>
      prev.map((b) => (b._id === bannerId ? { ...b, enable: newEnable } : b))
    );

    alert("Banner enable status updated!");
  } catch (error) {
    console.error("Error updating enable status:", error);
    alert("Failed to update enable status");
  } finally {
    setLoading(false);
  }
};


  const addText = () => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const text = new fabric.IText("Edit me", {
      left: 100,
      top: 100,
      fontSize: 30,
      fill: "black",
      fontFamily: "Arial",
    });
    canvas.add(text);
    canvas.setActiveObject(text);
    attachControls(text);
    canvas.requestRenderAll();
    console.log("Added text");
  };

  const updateFontSize = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const canvas = fabricRef.current;
    const obj = canvas?.getActiveObject() as fabric.IText;
    if (obj && obj.isType("i-text")) {
      obj.set({ fontSize: parseInt(e.target.value) });
      canvas.requestRenderAll();
    }
  };

  const toggleBold = () => {
    const canvas = fabricRef.current;
    const obj = canvas?.getActiveObject() as fabric.IText;
    if (obj && obj.isType("i-text")) {
      obj.set("fontWeight", obj.fontWeight === "bold" ? "normal" : "bold");
      canvas.requestRenderAll();
    }
  };

  const toggleItalic = () => {
    const canvas = fabricRef.current;
    const obj = canvas?.getActiveObject() as fabric.IText;
    if (obj && obj.isType("i-text")) {
      obj.set("fontStyle", obj.fontStyle === "italic" ? "normal" : "italic");
      canvas.requestRenderAll();
    }
  };

  const updateFontFamily = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const canvas = fabricRef.current;
    const obj = canvas?.getActiveObject() as fabric.IText;
    if (obj && obj.isType("i-text")) {
      obj.set("fontFamily", e.target.value);
      canvas.requestRenderAll();
    }
  };

  const updateTextColor = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const canvas = fabricRef.current;
    const obj = canvas?.getActiveObject() as fabric.IText;
    if (obj && obj.isType("i-text")) {
      obj.set("fill", e.target.value);
      canvas.requestRenderAll();
    }
  };

  const setCanvasBackgroundImage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const url = e.target.value;
    if (!url) {
      canvas.setBackgroundImage(null, canvas.renderAll.bind(canvas));
      console.log("Background cleared");
      return;
    }

    fabric.Image.fromURL(url, (img) => {
      const cw = canvas.getWidth();
      const ch = canvas.getHeight();
      const scale = Math.max(cw / img.width, ch / img.height);
      img.scale(scale).set({ originX: "left", originY: "top", left: 0, top: 0 });
      canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
      console.log(`Background set to: ${url}`);
    });
  };

  const uploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const canvas = fabricRef.current;
    if (!canvas || !e.target.files?.[0]) {
      console.error("No file selected or canvas not initialized");
      return;
    }

    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        fabric.Image.fromURL(event.target.result as string, (img) => {
          img.scaleToWidth(300);
          img.scaleToHeight(300);
          img.set({ left: 100, top: 100 });
          canvas.add(img);
          canvas.setActiveObject(img);
          attachControls(img);
          canvas.requestRenderAll();
          console.log("Image uploaded");
        });
      }
    };
    reader.onerror = () => console.error("Error reading file");
    reader.readAsDataURL(file);
  };

  const attachControls = (obj: ObjectWithControlId) => {
    removeControls();
    const controlId = `controls-${Date.now()}`;
    obj._controlId = controlId;

    const controlDiv = document.createElement("div");
    controlDiv.id = controlId;
    controlDiv.className = "object-controls";
    let buttonsHTML = `
        <button onclick="document.getElementById('delete-${controlId}').click()"><i class="fa fa-trash red"></i></button>
      `;

    if (obj.type === "image") {
      buttonsHTML += `
          <button onclick="document.getElementById('remove-bg-${controlId}').click()"><i class="fa fa-eraser"></i></button>
        `;
    }

    controlDiv.innerHTML = buttonsHTML;

    document.body.appendChild(controlDiv);

    const deleteButton = document.createElement("button");
    deleteButton.id = `delete-${controlId}`;
    deleteButton.style.display = "none";
    deleteButton.onclick = () => deleteObject(controlId);
    document.body.appendChild(deleteButton);

    const removeBgButton = document.createElement("button");
    removeBgButton.id = `remove-bg-${controlId}`;
    removeBgButton.style.display = "none";
    removeBgButton.onclick = () => alert(`Remove background function for control ID: ${controlId} (not implemented yet)`);
    document.body.appendChild(removeBgButton);

    updateControlsPosition();
  };

  const updateControlsPosition = () => {
    const canvas = fabricRef.current;
    const obj = canvas?.getActiveObject() as ObjectWithControlId;
    if (obj && obj._controlId) {
      const bound = obj.getBoundingRect();
      const canvasEl = canvas?.getElement().getBoundingClientRect();
      const control = document.getElementById(obj._controlId);
      if (control && canvasEl) {
        control.style.left = `${canvasEl.left + bound.left + window.scrollX}px`;
        control.style.top = `${canvasEl.top + bound.top - 30 + window.scrollY}px`;
      }
    }
  };

  const deleteObject = (controlId: string) => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const control = document.getElementById(controlId);
    if (control) control.remove();

    const deleteButton = document.getElementById(`delete-${controlId}`);
    if (deleteButton) deleteButton.remove();

    const removeBgButton = document.getElementById(`remove-bg-${controlId}`);
    if (removeBgButton) removeBgButton.remove();

    const obj = canvas.getObjects().find((o) => (o as ObjectWithControlId)._controlId === controlId);
    if (obj) {
      canvas.remove(obj);
      canvas.requestRenderAll();
      console.log(`Deleted object with control ID: ${controlId}`);
    }
  };

  const uploadCanvasToCloudinary = async (canvas: fabric.Canvas): Promise<string | null> => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      console.error("Cloudinary config missing");
      return null;
    }

    // Convert canvas to base64 image (PNG)
    const base64Image = canvas.toDataURL({
      format: "png",
      quality: 1,
    });

    const formData = new FormData();
    formData.append("file", base64Image);
    formData.append("upload_preset", uploadPreset);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.secure_url) {
        console.log("✅ Uploaded to Cloudinary:", data.secure_url);
        return data.secure_url;
      } else {
        console.error("Cloudinary upload error:", data);
        return null;
      }
    } catch (err) {
      console.error("Upload failed:", err);
      return null;
    }
  };

  const removeControls = () => {
    const controls = document.getElementsByClassName("object-controls");
    Array.from(controls).forEach((control) => control.remove());
    const hiddenButtons = document.querySelectorAll('[id^="delete-controls-"], [id^="remove-bg-controls-"]');
    hiddenButtons.forEach((btn) => btn.remove());
  };

 const handleSubmit = async () => {
  const canvas = fabricRef.current;
  if (!canvas) return;

  try {
    setLoading(true); // Start loading

    const imageUrl = await uploadCanvasToCloudinary(canvas);
    if (!imageUrl) throw new Error("Cloudinary upload failed");

    const payload = {
      title: "sample banner", // Replace with dynamic title if needed
      image: imageUrl,
    };

    const res = await fetch("http://localhost:4000/api/banner", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Failed to upload banner");

    const result = await res.json();
    console.log("Banner saved:", result);
    alert("Banner successfully added!");

    fetchBanners(); // refresh banner list
  } catch (err) {
    console.error("Upload error:", err);
    alert("Something went wrong while uploading");
  } finally {
    setLoading(false); // Stop loading
  }
};


  const deleteBanner = async (bannerId: string) => {
    console.log("Trying to delete banner with ID:", bannerId);

    try {
      const res = await fetch(`http://localhost:4000/api/banner/${bannerId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      const responseText = await res.text();

      if (!res.ok) {
        throw new Error(`Delete failed: ${res.status} ${res.statusText} - ${responseText}`);
      }

      console.log(`✅ Deleted banner ${bannerId}`);
      alert("Banner deleted");
      fetchBanners();
    } catch (error) {
      console.error("❌ Error deleting:", error);
      alert("Delete failed. See console.");
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-start bg-gray-100 min-h-screen p-4 space-y-4 md:space-y-0 md:space-x-4">
      <style>{`
        .object-controls {
          position: absolute;
          background: transparent;
          padding: 4px 8px;
          font-size: 12px;
          border-radius: 4px;
          z-index: 10;
          display: flex;
          gap: 5px;
        }
        .object-controls button {
          background: white;
          color: purple;
          border-radius: 20px;
          border: 1px solid #ccc;
          padding: 4px 7px;
          font-size: 12px;
          cursor: pointer;
        }
      `}</style>

      {/* Controls Column */}
      <div className="flex flex-col gap-4 w-full md:w-80 overflow-x-auto min-w-[300]">
        {/* Text Controls */}
        <div className="controls rounded-lg shadow w-full border-2 border-gray-300 p-4 bg-white">
          <button onClick={addText} className="secondary text-white hover:bg-blue-700 px-3 py-2 rounded mb-2 w-full">
            Add Text
          </button>
          <label htmlFor="fontSize">Font Size:</label>
          <select
            id="fontSize"
            onChange={updateFontSize}
            disabled={!activeObject?.isType("i-text")}
            className="text-black px-2 py-1 rounded w-full"
          >
            <option value="20">20</option>
            <option value="30">30</option>
            <option value="40">40</option>
            <option value="50">50</option>
          </select>

          <button
            onClick={toggleBold}
            disabled={!activeObject?.isType("i-text")}
            className="bg-blue-950 enabled:text-white hover:bg-gray-900 px-3 py-1 rounded disabled:text-gray-600 disabled:bg-gray-600 mt-2 w-1/2 mr-2"
          >
            Bold
          </button>
          <button
            onClick={toggleItalic}
            disabled={!activeObject?.isType("i-text")}
            className="bg-blue-950 enabled:text-white hover:bg-gray-900 px-3 py-1 rounded disabled:text-gray-600 disabled:bg-gray-600 mt-2 w-1/2"
          >
            Italic
          </button>
          <br />

          <label htmlFor="fontFamily" className="mt-2">Font:</label>
          <select
            id="fontFamily"
            onChange={updateFontFamily}
            disabled={!activeObject?.isType("i-text")}
            className="text-black px-2 py-1 rounded w-full border-2 border-gray-300"
          >
            <option value="Arial">Arial</option>
            <option value="Georgia">Georgia</option>
            <option value="Verdana">Verdana</option>
            <option value="Courier New">Courier New</option>
          </select>

          <label htmlFor="textColor" className="mt-2">Text Color:</label>
          <select
            id="textColor"
            onChange={updateTextColor}
            disabled={!activeObject?.isType("i-text")}
            className="text-black px-2 py-1 rounded w-full border-2 border-gray-300"
          >
            <option selected value="black">Black</option>
            <option value="#333">Dark Gray</option>
            <option value="#999">Light Gray</option>
            <option value="white">White</option>
          </select>
        </div>

        {/* Insert Image */}
        <div className="controls rounded-lg shadow w-full border-2 border-gray-300 p-4 bg-white">
          <label htmlFor="imageInput">Upload Image:</label>
          <input
            type="file"
            id="imageInput"
            accept="image/*"
            onChange={uploadImage}
            className="bg-white text-black file:bg-purple-600 file:text-white file:px-3 file:py-1 file:rounded file:hover:bg-blue-700 w-full"
          />
        </div>

        {/* Background Controls */}
        <div className="controls rounded-lg shadow w-full border-2 border-gray-300 p-4 bg-white">
          <label htmlFor="bgImage">Change Background:</label>
          <select
            id="bgImage"
            onChange={setCanvasBackgroundImage}
            className="text-black px-2 py-1 rounded w-full"
          >
            <option value="">Solid White</option>
            <option value="/background 1.png">Background 1</option>
            <option value="/background 2.png">Background 2</option>
            <option value="/background 3.png">Background 3</option>
            <option value="/playstation.jpg">Background 4</option>
          </select>
        </div>
      </div>

      {/* Canvas and Banner Collection */}
      <div className="flex flex-col w-full">
        {/* Canvas */}
        <div className="flex flex-col w-full items-center">
          <canvas
            ref={canvasRef}
            className="w-full max-w-full h-auto border-2 border-gray-600 shadow-md mt-4 md:mt-0"
          />
          {loading && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <Loader/>
              </div>
            </div>
          )}


          <button
            onClick={handleSubmit}
            className="mt-10 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
            disabled={loading}
          >
            <i className="fas fa-download mr-2"></i> Add banner to the collection
          </button>

            
        </div>

        {/* Banner Collection Table */}
        <div className="mt-12 w-full">
          <div className="bg-white rounded-lg shadow-md border-2 border-gray-300 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Banner Collection</h2>
              <button
                onClick={fetchBanners}
                className="secondary mt-2 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
              >
                Refresh
              </button>
            </div>
            
            <div className="overflow-x-auto ">
              {loading ? (
                <div className="p-6 text-center text-gray-500">Loading banners...</div>
              ) : banners.length === 0 ? (
                <div className="p-6 text-center text-gray-500">No banners found. Create your first banner!</div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Preview
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Enable
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Linked Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {banners.map((banner) => (
                      <tr key={banner.productId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <img
                            src={banner.image}
                            alt={banner.title}
                            className="h-16 w-24 object-cover rounded border"
                            onError={(e) => {
                              e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMiAxNkM4LjY5IDIwIDQgMTYgNCAxNkM0IDEyIDggOCAxMiA4UzIwIDEyIDIwIDE2QzIwIDE2IDE1LjMxIDIwIDEyIDIwWiIgc3Ryb2tlPSIjOUI5QjlCIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIzIiBzdHJva2U9IiM5QjlCOUIiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=';
                            }}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                        <label className="relative inline-block w-11 h-6 cursor-pointer">
                                      <input
                                        type="checkbox"
                                        className="peer sr-only"
                                        checked={banner.enable}
                                        onChange={() => toggleEnable(banner._id, !banner.enable)} 
                                      />
                                      {/* Track */}
                                      <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-green-500 transition-colors"></div>
                                      {/* Knob */}
                                      <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full
                                                      transition-transform peer-checked:translate-x-5"></span>
                        </label>

                      </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {editBannerId === banner._id ? (
                            <input
                              type="text"
                              name="title"
                              value={editedValues.title}
                              onChange={handleInputChange}
                              className="border-1 border-gray-300 px-2 py-1 rounded w-full"
                            />
                          ) : (
                            banner.title
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                          {editBannerId === banner._id ? (
                            <input
                              type="text"
                              name="productId"
                              placeholder="place a product ID"
                              value={editedValues.productId}
                              onChange={handleInputChange}
                              className="border-1 border-gray-300 px-2 py-1 rounded w-full"
                            />
                          ) : (
                            banner.productId
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-4">
                          {editBannerId === banner._id ? (
                            <>
                              <button
                                onClick={applyChanges}
                                className="text-green-600 hover:text-green-800 font-semibold"
                              >
                                save
                              </button>
                              <button
                                onClick={() => setEditBannerId(null)}
                                className="text-gray-500 hover:text-gray-800"
                              >
                                cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <a
                                href={banner.image}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 hover:text-blue-600"
                              >
                                <FaEye />
                              </a>
                              
                              <button
                                onClick={() => {
                                  setEditBannerId(banner._id);
                                  setEditedValues({ title: banner.title, productId: banner.productId });
                                }}
                                className="text-blue-600 hover:text-blue-800 cursor-pointer"
                              >
                                <FaEdit/>
                              </button>
                              <button
                                onClick={() => deleteBanner(banner._id)}
                                className="text-red-600 hover:text-red-800 cursor-pointer"
                              >
                                <FaTrash />
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FabricCanvasEditor;