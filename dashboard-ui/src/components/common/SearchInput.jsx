// src/components/common/SearchInput.jsx
import React from 'react';

const SearchInput = ({ value, onChange, placeholder = "🔍 Search..." }) => {
  return (
    <div className="relative w-full max-w-xs"> {/* Adjust max-width as needed */}
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      {/* If you want an actual icon element, you might position it absolutely within this div */}
      {/* For example, using react-icons:
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FaSearch className="text-gray-400" />
      </div>
      And then add more padding to the input: className="w-full pl-10 pr-4 py-2 ..."
      For now, the emoji in placeholder is simpler.
      */}
    </div>
  );
};

export default SearchInput;
