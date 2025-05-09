"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user, isSignedIn } = useUser();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef(null);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim().length > 0) {
      // Get all articles from localStorage
      try {
        const allArticles = JSON.parse(
          localStorage.getItem("medium-published-articles") || "[]"
        );

        // Filter articles based on search query
        const filteredArticles = allArticles.filter(
          (article) =>
            article.title.toLowerCase().includes(query.toLowerCase()) ||
            article.excerpt.toLowerCase().includes(query.toLowerCase())
        );

        setSearchResults(filteredArticles.slice(0, 5)); // Limit to 5 results
        setShowSearchResults(true);
      } catch (error) {
        console.error("Error searching articles:", error);
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="max-w-5xl mx-auto px-4 py-2 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="mr-6">
            <svg viewBox="0 0 1043.63 592.71" className="w-10 h-10">
              <g data-name="Layer 2">
                <g data-name="Layer 1">
                  <path d="M588.67 296.36c0 163.67-131.78 296.35-294.33 296.35S0 460 0 296.36 131.78 0 294.34 0s294.33 132.69 294.33 296.36M911.56 296.36c0 154.06-65.89 279-147.17 279s-147.17-124.94-147.17-279 65.88-279 147.16-279 147.17 124.9 147.17 279M1043.63 296.36c0 138-23.17 249.94-51.76 249.94s-51.75-111.91-51.75-249.94 23.17-249.94 51.75-249.94 51.76 111.9 51.76 249.94"></path>
                </g>
              </g>
            </svg>
          </Link>

          <div className="relative" ref={searchRef}>
            <div className="flex items-center bg-gray-100 rounded-full px-3 py-2">
              <svg
                className="h-5 w-5 text-gray-500 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search Medium"
                className="bg-transparent outline-none text-sm w-56 text-black"
                value={searchQuery}
                onChange={handleSearch}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
              />
            </div>

            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 mt-1 w-72 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                <div className="py-2">
                  {searchResults.map((article) => (
                    <div
                      key={article.id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        router.push(`/article/${article.id}`);
                        setShowSearchResults(false);
                      }}
                    >
                      <div className="text-sm font-medium">{article.title}</div>
                      <div className="text-xs text-gray-500 truncate">
                        {article.excerpt}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center">
          {isSignedIn ? (
            <>
              <Link
                href="/write"
                className="flex items-center text-gray-500 hover:text-gray-900 mr-6"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="mr-1"
                >
                  <path
                    d="M14 4a.5.5 0 0 0 0-1v1zm7 6a.5.5 0 0 0-1 0h1zm-7-7H4v1h10V3zM3 4v16h1V4H3zm1 17h16v-1H4v1zm17-1V10h-1v10h1zm-1 1a1 1 0 0 0 1-1h-1v1zM3 20a1 1 0 0 0 1 1v-1H3zM4 3a1 1 0 0 0-1 1h1V3z"
                    fill="currentColor"
                  ></path>
                  <path
                    d="M17.5 4.5l-8.46 8.46a.25.25 0 0 0-.06.1l-.82 2.47c-.07.2.12.38.31.31l2.47-.82a.25.25 0 0 0 .1-.06L19.5 6.5m-2-2l2.32-2.32c.1-.1.26-.1.36 0l1.64 1.64c.1.1.1.26 0 .36L19.5 6.5"
                    stroke="currentColor"
                  ></path>
                </svg>
                Write
              </Link>
              <Link
                href="/notifications"
                className="text-gray-500 hover:text-gray-900 mr-6"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
              </Link>
              <Link href="/profile" className="flex items-center">
                {user.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt={user.firstName || user.username}
                    className="h-8 w-8 rounded-full"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium text-gray-600">
                    {(
                      user.firstName?.[0] ||
                      user.username?.[0] ||
                      ""
                    ).toUpperCase()}
                  </div>
                )}
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="text-gray-600 hover:text-gray-900 mr-6"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="bg-black text-white px-4 py-2 rounded-full"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
