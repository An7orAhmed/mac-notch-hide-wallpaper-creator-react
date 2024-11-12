import { CustomDragDrop } from "./CustomContainer";
import { useState } from "react";
import Swal from 'sweetalert2';

const resolutions = [[1800, 1169], [3024, 1964]];

export default function DragComponent() {
  const [photoFiles, setPhotoFiles] = useState([]);
  const [selectedSize, setSelectedSize] = useState(1);

  function showToast(icon, title, text) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
      toast: true,
      position: "bottom-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
  }

  async function uploadFiles(newpics) {
    try {
      const processedImgs = await Promise.all(newpics.map((file) => processImage(file)));
      setPhotoFiles((prevFiles) => [...prevFiles, ...processedImgs]);
      showToast("success", "Upload Successful.", `${processedImgs.length} images processed and uploaded.`);
    } catch (error) {
      showToast("error", "Processing Error!", error.message || "An error occurred while processing images.");
    }
  }

  async function processImage(file) {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const resolution = resolutions[selectedSize - 1];

      // Set desired canvas dimensions
      canvas.width = resolution[0];
      canvas.height = resolution[1];

      // Decode base64 data to Blob if file is in base64 format
      const base64Data = file.photo.split(',')[1];
      const binary = atob(base64Data);
      const array = [];
      for (let i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
      }
      const blob = new Blob([new Uint8Array(array)], { type: file.type });

      const image = new Image();
      const url = URL.createObjectURL(blob);
      image.src = url;

      image.onload = () => {
        // Scale image to fit canvas
        const scale = Math.max(canvas.width / image.width, (canvas.height - 44) / image.height);
        const x = (canvas.width - image.width * scale) / 2;
        const y = 44 + (canvas.height - 44 - image.height * scale) / 2;

        ctx.drawImage(image, 0, 0, image.width, image.height, x, y, image.width * scale, image.height * scale);

        // Draw a black line at the top of the canvas
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, image.width, 44);

        URL.revokeObjectURL(url); // Clean up
        const base64DataUrl = canvas.toDataURL("image/jpeg");

        canvas.toBlob((blob) => {
          if (blob) {
            const processedFile = new File([blob], file.name, {
              type: "image/jpeg",
              lastModified: Date.now(),
            });

            processedFile.photo = base64DataUrl;
            resolve(processedFile);
          } else {
            reject(new Error("Canvas processing failed - Blob is empty."));
          }
        }, "image/jpeg");
      };

      image.onerror = (err) => {
        URL.revokeObjectURL(url);
        reject(new Error(err || "Image load failed."));
      };
    });
  }

  function deleteFile(indexImg) {
    const updatedList = photoFiles.filter((ele, index) => index !== indexImg);
    setPhotoFiles(updatedList);
  }

  return (
    <div className="bg-white shadow-[0_100px_100px_30px_rgba(0,0,0,0.1)] rounded-lg w-1/3 px-5 pt-3 pb-5">
      <div className="flex flex-col justify-between gap-3 pb-4 border-b border-[#e0e0e0]">
        <h2 className="text-3xl text-slate-600 font-[600]">
          Macbook Notch Hide Wallpaper Creator
        </h2>
        <div className="flex space-x-3">
          {/* Size Options */}
          <button
            className={`px-4 py-2 rounded ${selectedSize === 1 ? "bg-blue-500 text-white" : "bg-gray-300"}`}
            onClick={() => setSelectedSize(1)}
          >
            1800 x 1169
          </button>
          <button
            className={`px-4 py-2 rounded ${selectedSize === 2 ? "bg-blue-500 text-white" : "bg-gray-300"}`}
            onClick={() => setSelectedSize(2)}
          >
            3024 x 1964
          </button>
        </div>
      </div>
      <CustomDragDrop
        photos={photoFiles}
        onUpload={uploadFiles}
        onDelete={deleteFile}
        count={5}
        formats={["jpg", "jpeg", "png", "webp"]}
      />
    </div>
  );
}
