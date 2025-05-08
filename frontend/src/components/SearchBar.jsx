"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        placeholder="Search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="py-2 pl-10 pr-4 rounded-full bg-gray-100 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:bg-white w-56"
      />
      <svg
        className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </form>
  );
}
