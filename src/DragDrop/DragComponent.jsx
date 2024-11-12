import { CustomDragDrop } from "./CustomContainer";
import { useState } from "react";

export default function DragComponent() {
  const [ownerLicense, setOwnerLicense] = useState([]);
  const [showBtn, setShowBtn] = useState(false);

  function uploadFiles(f) {
    setOwnerLicense([...ownerLicense, ...f]);
    setShowBtn(true);
  }

  function deleteFile(indexImg) {
    const updatedList = ownerLicense.filter((ele, index) => index !== indexImg);
    setOwnerLicense(updatedList);
    setShowBtn(updatedList.length > 0);
  }

  return (
    <div className="bg-white shadow-[0_100px_100px_30px_rgba(0,0,0,0.1)] rounded-lg w-1/3 px-5 pt-3 pb-5">
      <div className="flex justify-between items-center pb-[8px] border-b border-[#e0e0e0]">
        <h2 className="text-2xl text-slate-700 font-[600]">
        Macbook Notch Hide Wallpaper Creator
        </h2>
        <button className={`bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded ${showBtn || 'hidden'}`}>
          Generate
        </button>
      </div>
      <CustomDragDrop
        ownerLicense={ownerLicense}
        onUpload={uploadFiles}
        onDelete={deleteFile}
        count={5}
        formats={["jpg", "jpeg", "png"]}
      />
    </div>
  );
}
