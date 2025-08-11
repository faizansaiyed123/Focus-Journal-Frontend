import React from "react";

export default function OptionsMenu({ onEdit, onDelete }) {
  return (
    <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg transition-all ease-in-out duration-200">
      <button
        onClick={onEdit}
        className="block w-full text-left px-4 py-2 text-gray-800 font-medium rounded-t-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200"
      >
        Edit
      </button>
      <button
        onClick={onDelete}
        className="block w-full text-left px-4 py-2 text-red-600 font-medium rounded-b-lg hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-all duration-200"
      >
        Delete
      </button>
    </div>
  );
}
