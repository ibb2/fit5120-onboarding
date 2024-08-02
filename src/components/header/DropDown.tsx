import React, { useState } from "react";
import SearchBar from "./SearchBar";

const DropDown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="px-4 py-2 bg-blue-600 text-white rounded-md"
      >
        Menu
      </button>
      {isOpen && (
        <div className="absolute left-0 mt-2 w-48 bg-white border rounded-md shadow-lg">
          <ul className="py-1">
            <li>
              <a
                href="#"
                className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
              >
                Option 1
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
              >
                Option 2
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
              >
                Option 3
              </a>
            </li>
          </ul>
        </div>
      )}
      <SearchBar />
    </div>
  );
};

export default DropDown;
