"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useUser, UserButton } from "@clerk/nextjs";
import Image from "next/image";

export default function WritePage() {
  const { isSignedIn, isLoaded, user } = useUser();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const titleRef = useRef(null);
  const contentRef = useRef(null);
  const accountMenuRef = useRef(null);
  const notificationsRef = useRef(null);

  useEffect(() => {
    // Focus the title input when the page loads
    if (titleRef.current) {
      titleRef.current.focus();
    }

    // Add click outside listener
    const handleClickOutside = (event) => {
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(event.target)
      ) {
        setShowAccountMenu(false);
      }
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Redirect if not signed in
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      window.location.href = "/sign-in?redirect=/write";
    }
  }, [isLoaded, isSignedIn]);

  const handlePublish = () => {
    setIsSaving(true);
    // Simulate publishing
    setTimeout(() => {
      setIsSaving(false);
      // Redirect to the post or show success message
      alert("Published successfully!");
    }, 1500);
  };

  // Handle Enter key in title field
  const handleTitleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (contentRef.current) {
        contentRef.current.focus();
      }
    }
  };

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 backdrop-blur-sm bg-white/90 sticky top-0 z-40 shadow-sm">
        <div className="max-w-[1320px] mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <Link
              href="/"
              className="font-serif text-xl font-bold mr-4 tracking-tight hover:text-green-600 transition duration-200"
            >
              Medium
            </Link>
            <div className="text-gray-500 text-sm font-medium flex items-center">
              <span className="mr-1">Draft in</span>
              <span className="text-gray-700 font-medium truncate max-w-[180px]">
                {title ? title : user?.firstName || "Untitled"}
              </span>
              <span className="ml-1.5 text-gray-400 text-xs">•</span>
              <span className="ml-1.5 text-xs text-gray-400">Saved</span>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <button
              onClick={handlePublish}
              disabled={!title || !content || isSaving}
              className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                !title || !content || isSaving
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700 shadow-sm hover:shadow"
              }`}
            >
              {isSaving ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Publishing...
                </span>
              ) : (
                "Publish"
              )}
            </button>

            <button className="text-gray-500 hover:text-gray-900 transition-colors duration-200 p-1.5 rounded-full hover:bg-gray-100">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="1"></circle>
                <circle cx="19" cy="12" r="1"></circle>
                <circle cx="5" cy="12" r="1"></circle>
              </svg>
            </button>

            {/* Notifications dropdown */}
            <div className="relative" ref={notificationsRef}>
              <button
                className="text-gray-500 hover:text-gray-900 transition-colors duration-200 p-1.5 rounded-full hover:bg-gray-100 relative"
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowAccountMenu(false);
                }}
              >
                <svg
                  width="22"
                  height="22"
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
                {/* Notification dot indicator */}
                <span className="absolute top-0.5 right-1 h-2 w-2 bg-green-500 rounded-full"></span>
              </button>

              {showNotifications && (
                <div className="absolute right-0 w-80 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 animate-fadeIn overflow-hidden">
                  <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <h3 className="font-medium text-base text-gray-800">
                      Notifications
                    </h3>
                  </div>
                  <div className="p-6 text-center text-gray-500 bg-white">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                      <svg
                        className="h-6 w-6 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                        />
                      </svg>
                    </div>
                    <p className="text-sm mb-1 font-medium">All caught up!</p>
                    <p className="text-xs text-gray-400">
                      You have no new notifications.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Account dropdown */}
            <div className="relative" ref={accountMenuRef}>
              <button
                className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white hover:shadow-md transition-shadow duration-200"
                onClick={() => {
                  setShowAccountMenu(!showAccountMenu);
                  setShowNotifications(false);
                }}
              >
                {user?.firstName ? user.firstName.charAt(0).toUpperCase() : "U"}
              </button>

              {showAccountMenu && (
                <div className="absolute right-0 w-64 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 animate-fadeIn overflow-hidden">
                  <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-lg shadow-sm">
                        {user?.firstName
                          ? user.firstName.charAt(0).toUpperCase()
                          : "U"}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {user?.fullName || user?.firstName || "User"}
                        </div>
                        <div className="text-sm text-gray-500">
                          @
                          {user?.username ||
                            user?.firstName?.toLowerCase() ||
                            "user"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="py-1">
                    {[
                      { label: "Write", href: "/write" },
                      { label: "Profile", href: "/profile" },
                      { label: "Library", href: "/library" },
                      { label: "Stories", href: "/stories" },
                      { label: "Stats", href: "/stats" },
                    ].map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>

                  <div className="border-t border-gray-200 py-1">
                    {[
                      { label: "Settings", href: "/settings" },
                      {
                        label: "Refine recommendations",
                        href: "/recommendations",
                      },
                      { label: "Manage publications", href: "/publications" },
                      { label: "Help", href: "/help" },
                    ].map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>

                  <div className="border-t border-gray-200 py-1">
                    <Link
                      href="/partner-program"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Apply to the Partner Program
                    </Link>
                    <Link
                      href="/membership"
                      className="flex items-center px-4 py-2 text-sm text-green-600 hover:bg-gray-50 font-medium"
                    >
                      Become a member
                    </Link>
                  </div>

                  <div className="border-t border-gray-200 py-1">
                    <button
                      onClick={() => (window.location.href = "/sign-out")}
                      className="flex w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Editor */}
      <main className="max-w-[800px] mx-auto px-6 py-10">
        <div className="min-h-[calc(100vh-140px)]">
          <input
            ref={titleRef}
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleTitleKeyDown}
            className="w-full text-3xl md:text-4xl lg:text-5xl font-serif font-medium placeholder-gray-300 border-none outline-none mb-8 text-gray-800 focus:text-black transition-colors duration-200"
          />

          <div className="relative">
            <textarea
              ref={contentRef}
              placeholder="Tell your story..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full min-h-[300px] text-lg text-gray-700 placeholder-gray-400 border-none outline-none resize-none font-serif leading-relaxed focus:text-black transition-colors duration-200"
            />

            {/* Formatting toolbar - enhanced */}
            <div className="absolute right-0 top-0 flex space-x-2">
              <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors duration-200">
                <svg
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  className="text-green-600"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="12"
                    fill="currentColor"
                    fillOpacity="0.2"
                  />
                  <path
                    d="M7.5 12.5H16.5M12 7V18"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
              </button>

              <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors duration-200">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="text-gray-500"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 7V4h16v3"></path>
                  <path d="M9 20h6"></path>
                  <path d="M12 4v16"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Add a subtle helper text at the bottom */}
        <div className="text-xs text-gray-400 mt-8 italic text-center">
          Write something inspiring today...
        </div>
      </main>
    </div>
  );
}
