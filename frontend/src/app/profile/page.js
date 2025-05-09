"use client";

import { useState, useEffect, useRef } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import styles from "./profile.module.css";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user } = useUser();
  const router = useRouter();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("home");
  const [followers, setFollowers] = useState(3); // Mock data
  const [following, setFollowing] = useState([
    { id: 1, name: "Bap", image: "/avatars/avatar1.png" },
    { id: 2, name: "fatfish", image: "/avatars/avatar2.png" },
    { id: 3, name: "Xuer Old", image: "/avatars/avatar3.png" },
    {
      id: 4,
      name: "JavaScript in Plain English",
      image: "/avatars/avatar4.png",
    },
    { id: 5, name: "Leonie Monigatti", image: "/avatars/avatar5.png" },
  ]);
  const articleMenuRefs = useRef({});
  const [activeArticleMenu, setActiveArticleMenu] = useState(null);

  useEffect(() => {
    if (user) {
      // Load published articles from localStorage
      try {
        const savedArticles = localStorage.getItem("medium-published-articles");
        if (savedArticles) {
          setArticles(JSON.parse(savedArticles));
        } else {
          // Fallback default articles
          setArticles([
            {
              id: 1,
              title: "My Journey with JavaScript",
              excerpt:
                "Personal experiences learning and mastering JavaScript.",
              date: "Oct 15, 2023",
              readTime: "6 min read",
            },
            {
              id: 2,
              title: "The Future of Web Development",
              excerpt:
                "Exploring emerging technologies and trends in web development.",
              date: "Sep 28, 2023",
              readTime: "8 min read",
            },
          ]);
        }
      } catch (error) {
        console.error("Error loading articles:", error);
        // Fallback to empty array
        setArticles([]);
      }

      setLoading(false);
    }
  }, [user]);

  const formatDate = (dateString) => {
    // If it's a date object or timestamp, convert to string
    if (dateString instanceof Date || !isNaN(new Date(dateString).getTime())) {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
    return dateString;
  };

  const goToArticle = (id) => {
    router.push(`/article/${id}`);
  };

  const toggleArticleMenu = (id) => {
    setActiveArticleMenu(activeArticleMenu === id ? null : id);
  };

  const pinArticle = (id) => {
    try {
      const savedArticles = JSON.parse(
        localStorage.getItem("medium-published-articles") || "[]"
      );

      // First, unpin all articles
      const updatedArticles = savedArticles.map((article) => ({
        ...article,
        isPinned: false,
      }));

      // Find the article to pin
      const articleIndex = updatedArticles.findIndex(
        (article) => article.id === id
      );

      if (articleIndex > -1) {
        // Remove the article from its current position
        const articleToPin = updatedArticles.splice(articleIndex, 1)[0];
        // Mark it as pinned
        articleToPin.isPinned = true;
        // Add it to the beginning of the array
        updatedArticles.unshift(articleToPin);

        localStorage.setItem(
          "medium-published-articles",
          JSON.stringify(updatedArticles)
        );

        setArticles(updatedArticles);
        setActiveArticleMenu(null);

        alert("Story pinned to top of your profile.");
      }
    } catch (error) {
      console.error("Error pinning article:", error);
      alert("Failed to pin the story.");
    }
  };

  const deleteArticle = (id) => {
    if (
      confirm(
        "Are you sure you want to delete this story? This cannot be undone."
      )
    ) {
      try {
        const savedArticles = JSON.parse(
          localStorage.getItem("medium-published-articles") || "[]"
        );
        const updatedArticles = savedArticles.filter(
          (article) => article.id !== id
        );
        localStorage.setItem(
          "medium-published-articles",
          JSON.stringify(updatedArticles)
        );
        setArticles(updatedArticles);
        setActiveArticleMenu(null);
      } catch (error) {
        console.error("Error deleting article:", error);
        alert("Failed to delete the story.");
      }
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (activeArticleMenu) {
        const activeMenuRef = articleMenuRefs.current[activeArticleMenu];
        if (activeMenuRef && !activeMenuRef.contains(event.target)) {
          setActiveArticleMenu(null);
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeArticleMenu]);

  if (!user) {
    return (
      <div className="h-screen flex justify-center items-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="py-4 px-4 lg:px-0">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">
              {user?.firstName || user?.username || "Profile"}
            </h1>
            <button className="text-gray-400">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path
                  d="M12 3c-2.444 0-2.75.01-3.71.054-.959.044-1.613.196-2.185.419-.592.23-1.094.537-1.594 1.038-.5.5-.809 1.002-1.039 1.594-.223.572-.375 1.226-.419 2.184C3.01 9.25 3 9.556 3 12s.01 2.75.054 3.71c.044.959.196 1.613.419 2.185.23.592.538 1.094 1.039 1.594.5.5 1.002.808 1.594 1.038.572.223 1.226.375 2.184.419.96.044 1.267.054 3.71.054s2.75-.01 3.71-.054c.959-.044 1.613-.196 2.185-.419.592-.23 1.094-.538 1.594-1.038.5-.5.808-1.002 1.038-1.594.223-.572.375-1.226.419-2.184.044-.96.054-1.267.054-3.71s-.01-2.75-.054-3.71c-.044-.959-.196-1.613-.419-2.185-.23-.592-.538-1.094-1.038-1.594-.5-.5-1.002-.809-1.594-1.039-.572-.223-1.226-.375-2.184-.419C14.75 3.01 14.444 3 12 3zm0 1.622c2.403 0 2.688.009 3.637.052.877.04 1.354.187 1.67.31.42.163.72.358 1.036.673.315.315.51.616.673 1.035.123.317.27.794.31 1.671.043.95.052 1.234.052 3.637s-.009 2.688-.052 3.637c-.04.877-.187 1.354-.31 1.67-.163.42-.358.72-.673 1.036-.315.315-.615.51-1.035.673-.317.123-.794.27-1.671.31-.95.043-1.234.052-3.637.052s-2.688-.009-3.637-.052c-.877-.04-1.354-.187-1.67-.31-.42-.163-.72-.358-1.036-.673-.315-.315-.51-.615-.673-1.035-.123-.317-.27-.794-.31-1.671-.043-.95-.052-1.234-.052-3.637s.009-2.688.052-3.637c.04-.877.187-1.354.31-1.67.163-.42.358-.72.673-1.036.315-.315.616-.51 1.035-.673.317-.123.794-.27 1.671-.31.95-.043 1.234-.052 3.637-.052z"
                  fill="currentColor"
                ></path>
                <path
                  d="M12 15a3 3 0 100-6 3 3 0 000 6zm0 1.622a4.622 4.622 0 110-9.244 4.622 4.622 0 010 9.244zM16.5 7.5a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25z"
                  fill="currentColor"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div className="border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 lg:px-0">
          <div className="flex space-x-8 -mb-px">
            <button
              onClick={() => setActiveTab("home")}
              className={`py-2 px-1 font-medium transition duration-200 ${
                activeTab === "home"
                  ? "text-gray-900 border-b-2 border-gray-900"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setActiveTab("lists")}
              className={`py-2 px-1 font-medium transition duration-200 ${
                activeTab === "lists"
                  ? "text-gray-900 border-b-2 border-gray-900"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Lists
            </button>
            <button
              onClick={() => setActiveTab("about")}
              className={`py-2 px-1 font-medium transition duration-200 ${
                activeTab === "about"
                  ? "text-gray-900 border-b-2 border-gray-900"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              About
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-4 md:flex md:gap-12">
        {/* Main content */}
        <div className="w-full md:w-2/3">
          {activeTab === "home" && (
            <div>
              {loading ? (
                <div className="animate-pulse">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="mb-8">
                      <div className="h-7 bg-gray-200 rounded w-3/4 mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    </div>
                  ))}
                </div>
              ) : articles.length > 0 ? (
                <div className="space-y-10">
                  {articles.map((article) => (
                    <article key={article.id} className="group">
                      <div className="flex justify-between">
                        <div
                          onClick={() => goToArticle(article.id)}
                          className="flex-1 cursor-pointer"
                        >
                          <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-gray-700 transition duration-200">
                            {article.title}
                          </h2>
                          <p className="text-gray-600 mb-4 line-clamp-2">
                            {article.excerpt}
                          </p>
                        </div>

                        <div
                          className="relative"
                          ref={(el) =>
                            (articleMenuRefs.current[article.id] = el)
                          }
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleArticleMenu(article.id);
                            }}
                            className="p-2 text-gray-400 hover:text-gray-700 transition duration-200"
                          >
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <path
                                d="M4.39 12c0 .55.2 1.02.59 1.41.39.4.86.59 1.4.59.56 0 1.03-.2 1.42-.59.4-.39.59-.86.59-1.41 0-.55-.2-1.02-.59-1.41A1.93 1.93 0 0 0 6.4 10c-.55 0-1.02.2-1.41.59-.4.39-.6.86-.6 1.41zM10 12c0 .55.2 1.02.58 1.41.4.4.87.59 1.42.59.54 0 1.02-.2 1.4-.59.4-.39.6-.86.6-1.41 0-.55-.2-1.02-.6-1.41a1.93 1.93 0 0 0-1.4-.59c-.55 0-1.04.2-1.42.59-.4.39-.58.86-.58 1.41zm5.6 0c0 .55.2 1.02.57 1.41.4.4.88.59 1.43.59.57 0 1.04-.2 1.43-.59.39-.39.57-.86.57-1.41 0-.55-.2-1.02-.57-1.41A1.93 1.93 0 0 0 17.6 10c-.55 0-1.04.2-1.43.59-.38.39-.57.86-.57 1.41z"
                                fill="currentColor"
                              ></path>
                            </svg>
                          </button>

                          {activeArticleMenu === article.id && (
                            <div className="absolute right-0 mt-1 w-56 bg-white rounded-lg shadow-xl z-10 border border-gray-200 overflow-hidden">
                              <div className="py-1">
                                <Link
                                  href="/settings"
                                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center transition duration-150"
                                >
                                  <svg
                                    className="w-5 h-5 mr-3 text-gray-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    />
                                  </svg>
                                  Edit profile
                                </Link>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    pinArticle(article.id);
                                  }}
                                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center transition duration-150"
                                >
                                  <svg
                                    className="w-5 h-5 mr-3 text-gray-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M5 15l7-7 7 7"
                                    />
                                  </svg>
                                  Pin to top of profile
                                </button>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteArticle(article.id);
                                  }}
                                  className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center transition duration-150"
                                >
                                  <svg
                                    className="w-5 h-5 mr-3 text-red-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                  </svg>
                                  Delete story
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div
                        onClick={() => goToArticle(article.id)}
                        className="flex items-center text-gray-500 text-sm cursor-pointer"
                      >
                        <span className="font-medium">
                          {formatDate(article.date)}
                        </span>
                        <span className="mx-1.5">·</span>
                        <span>{article.readTime}</span>

                        <div className="ml-auto flex">
                          <button className="group-hover:text-gray-700 transition duration-200">
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              className="text-gray-400 group-hover:text-gray-700 transition duration-200"
                            >
                              <path
                                d="M17.5 1.25a.5.5 0 0 1 1 0v2.5H21a.5.5 0 0 1 0 1h-2.5v2.5a.5.5 0 0 1-1 0v-2.5H15a.5.5 0 0 1 0-1h2.5v-2.5zm-11 4.5a1 1 0 0 1 1-1H11a.5.5 0 0 0 0-1H7.5a2 2 0 0 0-2 2v14a.5.5 0 0 0 .8.4l5.7-4.4 5.7 4.4a.5.5 0 0 0 .8-.4v-8.5a.5.5 0 0 0-1 0v7.48l-5.2-4a.5.5 0 0 0-.6 0l-5.2 4V5.75z"
                                fill="currentColor"
                              ></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div className="mt-6 border-b border-gray-100"></div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-gray-50 rounded-lg">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1M19 8l-7 5-7-5m14 6v3a2 2 0 01-2 2h-3"
                    />
                  </svg>
                  <h3 className="mt-2 text-lg font-medium text-gray-900">
                    No stories yet
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Get started by writing a new story.
                  </p>
                  <div className="mt-6">
                    <Link
                      href="/write"
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-full text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                    >
                      <svg
                        className="-ml-1 mr-2 h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Write a story
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "lists" && (
            <div className="text-center py-16 bg-gray-50 rounded-lg">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                No lists yet
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Create a list to organize and share stories.
              </p>
              <div className="mt-6">
                <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-full text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900">
                  <svg
                    className="-ml-1 mr-2 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Create a list
                </button>
              </div>
            </div>
          )}

          {activeTab === "about" && (
            <div className="py-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                About {user?.firstName || user?.username}
              </h2>
              <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                Hey there! I am {user?.firstName || user?.username}. Thank you
                for reading my content and keep reading share it with others.
                Thank you!
              </p>
              <div className="mt-8 pt-8 border-t border-gray-100">
                <h3 className="font-semibold text-lg text-gray-900 mb-4">
                  More information
                </h3>
                <div className="text-gray-700">
                  <p className="mb-2">
                    Joined:{" "}
                    {new Date().toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                    })}
                  </p>
                  <p>Member since {new Date().getFullYear()}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Redesigned sidebar with beautiful aesthetics */}
        <div className="w-full md:w-1/3 mt-10 md:mt-0">
          <div className="sticky top-24">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full overflow-hidden mb-4 bg-gradient-to-br from-gray-100 to-gray-200 p-0.5">
                  {user?.imageUrl ? (
                    <img
                      src={user.imageUrl}
                      alt={user.firstName || user.username}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-50 flex items-center justify-center text-2xl font-bold text-gray-500 rounded-full">
                      {(
                        user?.firstName?.[0] ||
                        user?.username?.[0] ||
                        ""
                      ).toUpperCase()}
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {user?.firstName || user?.username}
                </h3>
                <p className="text-gray-500 mb-3">{followers} followers</p>
                <p className="text-gray-600 mb-4 text-sm">
                  Hey there! I am {user?.firstName || user?.username}. Thank you
                  for reading my content and keep reading share it with others.
                  Thank you!
                </p>
                <Link
                  href="/settings"
                  className="text-green-600 font-medium hover:text-green-700 transition duration-150"
                >
                  Edit profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
