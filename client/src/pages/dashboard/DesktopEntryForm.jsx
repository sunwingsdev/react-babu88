
import { useState } from "react";
import { FaUpload, FaSave, FaTrash } from "react-icons/fa";

const DesktopEntryForm = ({ onSave, onCancel, baseURL, uploading, handleFileUpload, entry, index, handleUpdateDesktopEntry }) => {
  return (
    <div className="p-4">
      <div className="border border-[#041d3c] p-4 rounded-md relative">
        <label className="block text-sm font-medium text-gray-700 mb-2">Desktop Image</label>
        {entry.image ? (
          <>
            <img
              className="w-full h-40 object-cover rounded-md"
              src={`${baseURL}${entry.image}`}
              alt={`Temporary Desktop Image ${index + 1}`}
            />
            <button
              onClick={() => handleUpdateDesktopEntry(index, "image", "")}
              className="absolute top-2 right-2 p-2 group rounded-full bg-red-600 hover:bg-white duration-200"
            >
              <FaTrash className="text-xl text-white group-hover:text-red-600 duration-200" />
            </button>
          </>
        ) : (
          <div className="w-full h-40 flex items-center justify-center bg-gray-200 rounded-md">
            <label className="cursor-pointer flex flex-col items-center">
              <FaUpload className="text-2xl text-gray-500" />
              <span className="text-sm text-gray-600 mt-2">Upload Image</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileUpload(e, "featuresImageDesktop", false, index)}
                disabled={uploading.featuresImageDesktop}
              />
            </label>
          </div>
        )}
        {uploading.featuresImageDesktop && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-md">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
          </div>
        )}
        <div className="mt-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Link</label>
          <input
            type="url"
            value={entry.link}
            onChange={(e) => handleUpdateDesktopEntry(index, "link", e.target.value)}
            placeholder="Enter link"
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => onSave(index)}
            className="p-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <FaSave /> Save Entry
          </button>
          <button
            onClick={onCancel}
            className="p-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            <FaTrash /> Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DesktopEntryForm;
