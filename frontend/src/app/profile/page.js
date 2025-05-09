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
      <header className="border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">
              {user.firstName || user.username}
            </h1>
            <button className="text-gray-500">
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
          </div>
          <div className="flex space-x-6 mt-6">
            <button
              onClick={() => setActiveTab("home")}
              className={`pb-2 ${
                activeTab === "home"
                  ? "text-gray-900 font-medium border-b border-gray-900"
                  : "text-gray-500"
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setActiveTab("lists")}
              className={`pb-2 ${
                activeTab === "lists"
                  ? "text-gray-900 font-medium border-b border-gray-900"
                  : "text-gray-500"
              }`}
            >
              Lists
            </button>
            <button
              onClick={() => setActiveTab("about")}
              className={`pb-2 ${
                activeTab === "about"
                  ? "text-gray-900 font-medium border-b border-gray-900"
                  : "text-gray-500"
              }`}
            >
              About
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row">
          {/* Main content */}
          <div className="w-full md:w-2/3 md:pr-12">
            {activeTab === "home" && (
              <div>
                {loading ? (
                  <p>Loading articles...</p>
                ) : articles.length === 0 ? (
                  <div className="text-center py-12">
                    <h2 className="text-xl font-medium text-gray-900 mb-2">
                      You haven&apos;t published any stories yet
                    </h2>
                    <p className="text-gray-600 mb-6">
                      Click the button below to write your first story.
                    </p>
                    <Link
                      href="/write"
                      className="inline-block bg-gray-900 text-white px-4 py-2 rounded-full font-medium"
                    >
                      Write a story
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {articles.map((article) => (
                      <article key={article.id} className="py-6 cursor-pointer">
                        <div className="flex justify-between">
                          <div
                            onClick={() => goToArticle(article.id)}
                            className="flex-1"
                          >
                            <h2 className="text-xl font-bold text-gray-900 mb-2">
                              {article.title}
                            </h2>
                            <p className="text-gray-700 mb-4">
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
                              className="p-2 text-gray-500 hover:text-gray-700"
                            >
                              <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                              >
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M4.39 12c0 .55.2 1.02.59 1.41.39.4.86.59 1.4.59.56 0 1.03-.2 1.42-.59.4-.39.59-.86.59-1.41 0-.55-.2-1.02-.59-1.41A1.93 1.93 0 0 0 6.4 10c-.55 0-1.02.2-1.41.59-.4.39-.6.86-.6 1.41zM10 12c0 .55.2 1.02.58 1.41.4.4.87.59 1.42.59.54 0 1.02-.2 1.4-.59.4-.39.6-.86.6-1.41 0-.55-.2-1.02-.6-1.41a1.93 1.93 0 0 0-1.4-.59c-.55 0-1.04.2-1.42.59-.4.39-.58.86-.58 1.41zm5.6 0c0 .55.2 1.02.57 1.41.4.4.88.59 1.43.59.57 0 1.04-.2 1.43-.59.39-.39.57-.86.57-1.41 0-.55-.2-1.02-.57-1.41A1.93 1.93 0 0 0 17.6 10c-.55 0-1.04.2-1.43.59-.38.39-.57.86-.57 1.41z"
                                  fill="currentColor"
                                ></path>
                              </svg>
                            </button>

                            {activeArticleMenu === article.id && (
                              <div className="absolute right-0 mt-1 w-56 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                                <div className="py-1">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      router.push(`/write?edit=${article.id}`);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                  >
                                    <svg
                                      className="w-5 h-5 mr-2"
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
                                    Edit story
                                  </button>

                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      pinArticle(article.id);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                  >
                                    <svg
                                      className="w-5 h-5 mr-2"
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
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                                  >
                                    <svg
                                      className="w-5 h-5 mr-2"
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
                          className="flex items-center text-gray-500 text-sm"
                        >
                          <span>{formatDate(article.date)}</span>
                          <span className="mx-1">·</span>
                          <span>{article.readTime}</span>

                          <div className="ml-auto flex">
                            <button className="mr-4">
                              <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                              >
                                <path
                                  d="M17.5 1.25a.5.5 0 0 1 1 0v2.5H21a.5.5 0 0 1 0 1h-2.5v2.5a.5.5 0 0 1-1 0v-2.5H15a.5.5 0 0 1 0-1h2.5v-2.5zm-11 4.5a1 1 0 0 1 1-1H11a.5.5 0 0 0 0-1H7.5a2 2 0 0 0-2 2v14a.5.5 0 0 0 .8.4l5.7-4.4 5.7 4.4a.5.5 0 0 0 .8-.4v-8.5a.5.5 0 0 0-1 0v7.48l-5.2-4a.5.5 0 0 0-.6 0l-5.2 4V5.75z"
                                  fill="currentColor"
                                ></path>
                              </svg>
                            </button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "lists" && (
              <div className="py-12 text-center">
                <h2 className="text-xl font-medium text-gray-900 mb-2">
                  No lists yet
                </h2>
                <p className="text-gray-600">
                  Create a list to organize and share stories.
                </p>
              </div>
            )}

            {activeTab === "about" && (
              <div className="py-6">
                <h2 className="text-xl font-bold mb-4">
                  About {user.firstName || user.username}
                </h2>
                <p className="text-gray-700 mb-6">
                  Hey there! I am {user.firstName || user.username}. Thank you
                  for reading my content and keep reading share it with others.
                  Thank you!
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="w-full md:w-1/3 mt-10 md:mt-0">
            <div className="sticky top-10">
              <div className="mb-6">
                <div className="w-20 h-20 rounded-full overflow-hidden mb-4">
                  {user.imageUrl ? (
                    <img
                      src={user.imageUrl}
                      alt={user.firstName || user.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-500">
                      {(
                        user.firstName?.[0] ||
                        user.username?.[0] ||
                        ""
                      ).toUpperCase()}
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-bold mb-1">
                  {user.firstName || user.username}
                </h3>
                <p className="text-gray-500 mb-2">{followers} followers</p>
                <p className="text-gray-700 mb-4">
                  Hey there! I am {user.firstName || user.username}. Thank you
                  for reading my content and keep reading share it with others.
                  Thank you!
                </p>
                <button className="text-green-600 font-medium">
                  Edit profile
                </button>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-bold mb-4">Following</h3>
                <div className="space-y-4">
                  {following.map((account) => (
                    <div
                      key={account.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-200 mr-3 flex-shrink-0">
                          {/* Avatar would go here */}
                        </div>
                        <span className="font-medium">{account.name}</span>
                      </div>
                      <button>
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M4.39 12c0 .55.2 1.02.59 1.41.39.4.86.59 1.4.59.56 0 1.03-.2 1.42-.59.4-.39.59-.86.59-1.41 0-.55-.2-1.02-.59-1.41A1.93 1.93 0 0 0 6.4 10c-.55 0-1.02.2-1.41.59-.4.39-.6.86-.6 1.41zM10 12c0 .55.2 1.02.58 1.41.4.4.87.59 1.42.59.54 0 1.02-.2 1.4-.59.4-.39.6-.86.6-1.41 0-.55-.2-1.02-.6-1.41a1.93 1.93 0 0 0-1.4-.59c-.55 0-1.04.2-1.42.59-.4.39-.58.86-.58 1.41zm5.6 0c0 .55.2 1.02.57 1.41.4.4.88.59 1.43.59.57 0 1.04-.2 1.43-.59.39-.39.57-.86.57-1.41 0-.55-.2-1.02-.57-1.41A1.93 1.93 0 0 0 17.6 10c-.55 0-1.04.2-1.43.59-.38.39-.57.86-.57 1.41z"
                            fill="currentColor"
                          ></path>
                        </svg>
                      </button>
                    </div>
                  ))}
                  <button className="text-gray-500 font-medium">
                    See all ({following.length})
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
