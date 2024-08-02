import React, { useState } from "react";

const SearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Search Term:", searchTerm);
  };

  return (
    <form onSubmit={handleSearchSubmit} className="mt-2 w-full">
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Search..."
        className="w-full px-4 py-2 border rounded-md"
      />
    </form>
  );
};

export default SearchBar;
