"use client";

import { useState, useRef, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function WritePage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isDraft, setIsDraft] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const contentRef = useRef(null);
  const titleRef = useRef(null);
  const userMenuRef = useRef(null);

  // Auto-resize the content textarea as user types
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.style.height = "auto";
      contentRef.current.style.height = contentRef.current.scrollHeight + "px";
    }
  }, [content]);

  // Handle clicks outside the user menu
  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Redirect if not signed in
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/");
    }
  }, [isLoaded, isSignedIn, router]);

  // Auto-save draft
  useEffect(() => {
    const saveDraft = setTimeout(() => {
      if ((title || content) && isDraft) {
        console.log("Auto-saving draft...");

        // Save draft to localStorage
        if (title || content) {
          const draft = {
            title,
            content,
            lastUpdated: new Date().toISOString(),
          };
          localStorage.setItem("medium-draft", JSON.stringify(draft));
        }
      }
    }, 3000);

    return () => clearTimeout(saveDraft);
  }, [title, content, isDraft]);

  // Load draft on initial load
  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem("medium-draft");
      if (savedDraft) {
        const { title: savedTitle, content: savedContent } =
          JSON.parse(savedDraft);
        if (!title && savedTitle) setTitle(savedTitle);
        if (!content && savedContent) setContent(savedContent);
      }
    } catch (error) {
      console.error("Error loading draft:", error);
    }
  }, []);

  const handleTitleKeyDown = (e) => {
    // When Enter is pressed in the title field, move to content area
    if (e.key === "Enter") {
      e.preventDefault();
      contentRef.current?.focus();
    }
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  const handlePublish = async () => {
    if (!title || !content) {
      alert("Please add a title and content to your story");
      return;
    }

    setIsSaving(true);

    try {
      // Store the published article in localStorage for demo purposes
      const existingArticles = JSON.parse(
        localStorage.getItem("medium-published-articles") || "[]"
      );

      const newArticle = {
        id: Date.now(),
        title,
        content,
        excerpt:
          content.substring(0, 150) + (content.length > 150 ? "..." : ""),
        author: user?.firstName || user?.username || "Anonymous",
        date: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
        readTime: `${Math.max(
          1,
          Math.ceil(content.split(" ").length / 200)
        )} min read`,
        image:
          "https://picsum.photos/id/" +
          Math.floor(Math.random() * 100) +
          "/200/200",
      };

      existingArticles.unshift(newArticle);
      localStorage.setItem(
        "medium-published-articles",
        JSON.stringify(existingArticles)
      );

      // Clear the draft
      localStorage.removeItem("medium-draft");

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      router.push("/feed"); // Redirect to feed after publishing
    } catch (error) {
      console.error("Error publishing:", error);
      alert("Failed to publish your story. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 sticky top-0 bg-white z-10">
        <div className="max-w-[1192px] w-full mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="font-serif text-lg md:text-xl font-bold">
              Medium
            </Link>
            {isDraft && (
              <div className="ml-4 text-sm text-gray-500">
                Draft in {user?.firstName || user?.username || "untitled"}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handlePublish}
              disabled={isSaving || !title || !content}
              className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                isSaving || !title || !content
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
            >
              {isSaving ? "Publishing..." : "Publish"}
            </button>

            <button className="text-gray-600 hover:text-gray-800">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-more-horizontal"
              >
                <circle cx="12" cy="12" r="1"></circle>
                <circle cx="19" cy="12" r="1"></circle>
                <circle cx="5" cy="12" r="1"></circle>
              </svg>
            </button>

            <div className="relative" ref={userMenuRef}>
              <button
                className="w-8 h-8 rounded-full overflow-hidden focus:outline-none"
                onClick={toggleUserMenu}
              >
                {user?.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt="Profile"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600">
                    {user?.firstName?.[0] || user?.username?.[0] || "U"}
                  </div>
                )}
              </button>

              {/* User dropdown menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-20">
                  <div className="p-3 border-b border-gray-200">
                    <div className="flex items-center mb-2">
                      <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                        {user?.imageUrl ? (
                          <img
                            src={user.imageUrl}
                            alt="Profile"
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600 text-lg">
                            {user?.firstName?.[0] || user?.username?.[0] || "U"}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-medium">
                          {user?.fullName || user?.username}
                        </div>
                        <div className="text-gray-500 text-sm">
                          @{user?.username || "username"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/write"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Write
                    </Link>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Library
                    </Link>
                    <Link
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Stories
                    </Link>
                    <Link
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Stats
                    </Link>
                  </div>

                  <div className="border-t border-gray-200 py-1">
                    <Link
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Settings
                    </Link>
                    <Link
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Refine recommendations
                    </Link>
                    <Link
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Manage publications
                    </Link>
                    <Link
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Help
                    </Link>
                  </div>

                  <div className="border-t border-gray-200 py-1">
                    <Link
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Apply to the Partner Program
                    </Link>
                    <Link
                      href="#"
                      className="block px-4 py-2 text-sm text-green-600 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Become a member
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Editor */}
      <main className="flex-1 max-w-[800px] w-full mx-auto px-4 py-8 bg-white">
        <div className="mb-8">
          <input
            ref={titleRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleTitleKeyDown}
            placeholder="Title"
            className="w-full text-3xl md:text-4xl lg:text-5xl font-serif text-gray-800 focus:text-gray-800 outline-none placeholder-gray-300 font-normal"
            autoFocus
          />
        </div>

        <div className="flex">
          <button className="w-8 h-8 text-gray-400 hover:text-gray-600 mr-2 flex-shrink-0 mt-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="16"></line>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
          </button>

          <textarea
            ref={contentRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Tell your story..."
            className="w-full text-lg md:text-xl text-gray-700 outline-none resize-none placeholder-gray-400 min-h-[300px]"
            style={{ overflow: "hidden" }}
          />
        </div>
      </main>
    </div>
  );
}
