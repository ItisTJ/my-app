"use client";

import React, { useRef, useEffect, useState } from "react";
import { fabric } from "fabric";

interface ObjectWithControlId extends fabric.Object {
  _controlId?: string;
}

const FabricCanvasEditor: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const [activeObject, setActiveObject] = useState<ObjectWithControlId | null>(null);

  useEffect(() => {
    const canvasEl = canvasRef.current;
  if (!canvasEl) return;

  // Get screen/container width (up to max of 800)
  const parentWidth = canvasEl.parentElement?.offsetWidth || 800;
  const width = Math.min(parentWidth, 800);
  const height = (width * 500) / 800; // Maintain 16:10 aspect ratio

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

  const removeControls = () => {
    const controls = document.getElementsByClassName("object-controls");
    Array.from(controls).forEach((control) => control.remove());
    const hiddenButtons = document.querySelectorAll('[id^="delete-controls-"], [id^="remove-bg-controls-"]');
    hiddenButtons.forEach((btn) => btn.remove());
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
    <div className="flex flex-col gap-4 w-full md:w-80 overflow-x-auto">
      {/* Text Controls */}
      <div className="controls rounded-lg shadow w-full border-2 border-gray-300 p-4 bg-white">
        <button onClick={addText} className="bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded mb-2 w-full">
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
        <br></br>

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
          className="bg-white text-black file:bg-blue-600 file:text-white file:px-3 file:py-1 file:rounded file:hover:bg-blue-700 w-full"
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


    {/* Canvas */}
<div className="flex flex-col w-full items-center">
  <canvas
    ref={canvasRef}
    className="w-full max-w-full h-auto border-2 border-gray-600 shadow-md mt-4 md:mt-0"
  />

  <button
    onClick={() => {

    }}
    className="mt-10 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
  >
    <i className="fas fa-download mr-2"></i> Add banner to the collection
  </button>
</div>

  </div>
);



};

export default FabricCanvasEditor;