"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState(query);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);

  // Simulate search results - would be fetched from the backend
  useEffect(() => {
    if (query) {
      setIsLoading(true);
      // Simulate API call delay
      setTimeout(() => {
        // Dummy search results
        setResults([
          {
            id: "1",
            title: `Article about ${query}`,
            excerpt: `This is a sample article that includes the search term "${query}" multiple times to demonstrate search functionality.`,
            author: {
              name: "John Smith",
              image: "https://via.placeholder.com/40",
            },
            date: "Dec 15",
            readTime: "5 min read",
          },
          {
            id: "2",
            title: `Learning about ${query} in 2023`,
            excerpt: `Here's everything you need to know about ${query} in the modern web development landscape.`,
            author: {
              name: "Jane Doe",
              image: "https://via.placeholder.com/40",
            },
            date: "Nov 20",
            readTime: "7 min read",
          },
          {
            id: "3",
            title: `The Future of ${query}`,
            excerpt: `Exploring how ${query} is evolving and what it means for developers and users alike.`,
            author: {
              name: "Alex Johnson",
              image: "https://via.placeholder.com/40",
            },
            date: "Oct 5",
            readTime: "10 min read",
          },
        ]);
        setIsLoading(false);
      }, 500);
    }
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-6">
      {/* Search Form */}
      <form onSubmit={handleSubmit} className="mb-10">
        <div className="relative max-w-xl mx-auto">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Medium"
            className="w-full py-3 pl-12 pr-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent"
          />
          <svg
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
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
        </div>
      </form>

      {/* Search Results */}
      {query ? (
        <div>
          <h1 className="text-3xl font-bold mb-6">Results for "{query}"</h1>

          {isLoading ? (
            <div className="flex justify-center my-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-10">
              {results.map((post) => (
                <article
                  key={post.id}
                  className="border-b border-gray-200 pb-8"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <img
                      src={post.author.image}
                      alt={post.author.name}
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="text-sm font-medium">
                      {post.author.name}
                    </span>
                  </div>

                  <Link href={`/post/${post.id}`}>
                    <h2 className="text-xl font-bold mb-2 hover:underline">
                      {post.title}
                    </h2>
                    <p className="text-gray-700 mb-3 line-clamp-2">
                      {post.excerpt}
                    </p>
                  </Link>

                  <div className="flex items-center text-sm text-gray-500">
                    <span>{post.date}</span>
                    <span className="mx-1">·</span>
                    <span>{post.readTime}</span>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">
                No results found for "{query}"
              </p>
              <p className="text-gray-500 text-sm">
                Try searching for a different term or browse trending topics
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">What are you looking for?</h2>
          <p className="text-gray-600 max-w-md mx-auto">
            Search for topics, publications, or authors to discover stories on
            Medium
          </p>
        </div>
      )}
    </div>
  );
}
