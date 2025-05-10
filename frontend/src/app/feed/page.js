"use client";

import { useState, useEffect } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import styles from "./feed.module.css";
import { fetchArticles } from "@/services/articleService";
import { syncUserWithBackend } from "@/services/authService";

export default function Feed() {
  const { user, isLoaded } = useUser();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("for-you");
  const [topicsToFollow, setTopicsToFollow] = useState([
    "Data Science",
    "Self Improvement",
    "Programming",
    "Technology",
    "Writing",
    "Relationships",
    "Machine Learning",
    "Productivity",
  ]);
  const [followedTopics, setFollowedTopics] = useState([]);
  const [staffPicks, setStaffPicks] = useState([
    {
      author: "Steven C. Hayes",
      title: "What If You Didn't Need to Feel Better to Live Better?",
      date: "Apr 23",
      isStarred: true,
      avatar:
        "https://miro.medium.com/v2/resize:fill:40:40/1*Y-QdW6_rzbeQg-cGhChUOA.jpeg",
    },
    {
      author: "Andrea Romeo RN, BN",
      title:
        "Can You Spot Fake News? Many Can't When Scored on a Validated Test",
      date: "Apr 18",
      isStarred: false,
      avatar:
        "https://miro.medium.com/v2/resize:fill:40:40/1*sHhtYhaCe2Uc3IU0IgKwIQ.png",
    },
    {
      author: "Daniel B. Gallagher",
      title: "I worked for Pope Francis. Here is what he was really like.",
      date: "Apr 22",
      isStarred: false,
      avatar:
        "https://miro.medium.com/v2/resize:fill:40:40/1*VJCuJTQ6-kMQmKqIlzOtRg.jpeg",
    },
  ]);
  const [followedTopicsInStorage, setFollowedTopicsInStorage] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [allTopics, setAllTopics] = useState([]);

  useEffect(() => {
    // Load articles from localStorage instead of API
    try {
      const savedArticles = JSON.parse(
        localStorage.getItem("medium-published-articles") || "[]"
      );

      if (savedArticles.length > 0) {
        console.log("Found articles in localStorage:", savedArticles);
        setArticles(savedArticles);
      } else {
        console.log("No articles found in localStorage");
      }
      setLoading(false);
    } catch (err) {
      console.error("Failed to load articles:", err);
      setError("Failed to load articles. Please try again.");
      setLoading(false);
    }

    // Sync Clerk user with backend if user is loaded
    if (isLoaded && user) {
      syncUserWithBackend(user).then((backendUser) => {
        console.log("User synced with backend:", backendUser);
      });
    }
  }, [isLoaded, user]);

  useEffect(() => {
    // Load followed topics from localStorage
    try {
      const savedTopics = JSON.parse(
        localStorage.getItem("medium-followed-topics") || "[]"
      );
      setFollowedTopics(savedTopics);
      setFollowedTopicsInStorage(savedTopics);
    } catch (err) {
      console.error("Failed to load followed topics:", err);
    }
  }, []);

  useEffect(() => {
    if (followedTopics.length !== followedTopicsInStorage.length) {
      localStorage.setItem(
        "medium-followed-topics",
        JSON.stringify(followedTopics)
      );
      setFollowedTopicsInStorage(followedTopics);
    }
  }, [followedTopics, followedTopicsInStorage]);

  useEffect(() => {
    // Filter articles based on active tab and followed topics
    const filterArticles = () => {
      if (activeTab === "for-you") {
        setFilteredArticles(articles);
      } else if (activeTab === "following" && followedTopics.length > 0) {
        // Show only articles with topics the user follows
        setFilteredArticles(
          articles.filter(
            (article) =>
              article.topics &&
              article.topics.some((topic) => followedTopics.includes(topic))
          )
        );
      } else {
        // Filter by the currently active tab as a topic
        const topicToFilter = activeTab.replace(/-/g, " ");
        setFilteredArticles(
          articles.filter(
            (article) =>
              article.topics &&
              article.topics.some(
                (topic) => topic.toLowerCase() === topicToFilter.toLowerCase()
              )
          )
        );
      }
    };

    filterArticles();

    // Listen for real-time article updates (simulating WebSocket)
    const handleNewArticle = (event) => {
      const { article } = event.detail;
      console.log("New article received in real-time:", article);

      // Update main articles list
      setArticles((prevArticles) => [article, ...prevArticles]);

      // Explicitly determine if this article should be shown in current view
      const shouldShowInCurrentTab =
        activeTab === "for-you" ||
        (activeTab === "following" &&
          article.topics?.some((topic) => followedTopics.includes(topic))) ||
        article.topics?.some(
          (topic) => topic.toLowerCase().replace(/\s+/g, "-") === activeTab
        );

      if (shouldShowInCurrentTab) {
        // If it matches the current tab criteria, add it to filtered articles too
        setFilteredArticles((prevFiltered) => [article, ...prevFiltered]);
      }

      // Show notification for followed topics
      if (article.topics?.some((topic) => followedTopics.includes(topic))) {
        const matchedTopic = article.topics.find((t) =>
          followedTopics.includes(t)
        );
        showNotification(`New article in ${matchedTopic}`);
      }
    };

    // Add event listener for new articles
    window.addEventListener("new-article-published", handleNewArticle);

    // Cleanup
    return () => {
      window.removeEventListener("new-article-published", handleNewArticle);
    };
  }, [articles, activeTab, followedTopics]);

  useEffect(() => {
    // Extract all unique topics from articles
    const topics = new Set();
    articles.forEach((article) => {
      if (article.topics) {
        article.topics.forEach((topic) => topics.add(topic));
      }
    });
    setAllTopics(Array.from(topics));
  }, [articles]);

  const showNotification = (message) => {
    // You could use a toast library here, but for simplicity:
    const notification = document.createElement("div");
    notification.className = styles.notification;
    notification.textContent = message;
    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
      notification.classList.add(styles.fadeOut);
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 500);
    }, 3000);
  };

  const followTopic = (topic) => {
    const newFollowedTopics = [...followedTopics, topic];
    setFollowedTopics(newFollowedTopics);
    setTopicsToFollow(topicsToFollow.filter((t) => t !== topic));

    // Re-filter articles immediately to show relevant content
    if (activeTab === "following") {
      setFilteredArticles(
        articles.filter(
          (article) =>
            article.topics &&
            article.topics.some((t) => newFollowedTopics.includes(t))
        )
      );
    }
  };

  const unfollowTopic = (topic) => {
    setTopicsToFollow([...topicsToFollow, topic]);
    setFollowedTopics(followedTopics.filter((t) => t !== topic));
  };

  return (
    <div className={styles.feedContainer}>
      {/* Top Navigation Bar */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <div className={styles.logo}>
              <Link href="/">
                <img src="/fl.png" alt="Medium" className={styles.logoImg} />
              </Link>
            </div>

            <div className={styles.searchContainer}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M4.1 11.06a6.95 6.95 0 1 1 13.9 0 6.95 6.95 0 0 1-13.9 0zm6.94-8.05a8.05 8.05 0 1 0 5.13 14.26l3.75 3.75a.56.56 0 1 0 .8-.79l-3.74-3.73A8.05 8.05 0 0 0 11.04 3v.01z"
                  fill="rgba(117, 117, 117, 1)"
                ></path>
              </svg>
              <input
                type="text"
                placeholder="Search Medium"
                className={styles.searchInput}
              />
            </div>
          </div>

          <div className={styles.headerRight}>
            <Link href="/write" className={styles.writeLink}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
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

            <button className={styles.notificationBtn}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M15 18.5a3 3 0 1 1-6 0"
                  stroke="currentColor"
                  strokeLinecap="round"
                ></path>
                <path
                  d="M5.5 10.53V9a6.5 6.5 0 0 1 13 0v1.53c0 1.42.56 2.78 1.57 3.79l.03.03c.26.26.4.6.4.97v2.93c0 .14-.11.25-.25.25H3.75a.25.25 0 0 1-.25-.25v-2.93c0-.37.14-.71.4-.97l.03-.03c1-1 1.57-2.37 1.57-3.79z"
                  stroke="currentColor"
                ></path>
              </svg>
            </button>

            {user ? (
              <div className={styles.profileContainer}>
                <UserButton />
              </div>
            ) : (
              <Link href="/sign-in" className={styles.signInBtn}>
                Sign in
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Topic Navigation */}
      <div className={styles.topicNav}>
        <div className={styles.topicNavContent}>
          <button
            className={`${styles.topicTab} ${
              activeTab === "for-you" ? styles.activeTab : ""
            }`}
            onClick={() => setActiveTab("for-you")}
          >
            For you
          </button>
          <button
            className={`${styles.topicTab} ${
              activeTab === "following" ? styles.activeTab : ""
            }`}
            onClick={() => setActiveTab("following")}
          >
            Following
          </button>
          <button
            className={`${styles.topicTab} ${
              activeTab === "featured" ? styles.activeTab : ""
            }`}
            onClick={() => setActiveTab("featured")}
          >
            <span className={styles.featuredTag}>New</span>
            Featured
          </button>
          <button
            className={`${styles.topicTab} ${
              activeTab === "web-dev" ? styles.activeTab : ""
            }`}
            onClick={() => setActiveTab("web-dev")}
          >
            Web Development
          </button>
          <button
            className={`${styles.topicTab} ${
              activeTab === "coding" ? styles.activeTab : ""
            }`}
            onClick={() => setActiveTab("coding")}
          >
            Coding
          </button>
          <button
            className={`${styles.topicTab} ${
              activeTab === "javascript" ? styles.activeTab : ""
            }`}
            onClick={() => setActiveTab("javascript")}
          >
            JavaScript
          </button>
          {allTopics.map((topic, index) => (
            <button
              key={index}
              className={`${styles.topicTab} ${
                activeTab === topic.toLowerCase().replace(/\s+/g, "-")
                  ? styles.activeTab
                  : ""
              }`}
              onClick={() =>
                setActiveTab(topic.toLowerCase().replace(/\s+/g, "-"))
              }
            >
              {topic}
            </button>
          ))}
          <button className={styles.moreTopicsBtn}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4.5 12a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0zm6.5 1.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm8-1.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0z"
                fill="currentColor"
              ></path>
            </svg>
          </button>
        </div>
      </div>

      <main className={styles.main}>
        <div className={styles.contentLayout}>
          {/* Article Section */}
          <div className={styles.articlesSection}>
            {loading ? (
              <div className={styles.loadingArticles}>
                <div className={styles.articleSkeleton}>
                  <div className={styles.skeletonTitle}></div>
                  <div className={styles.skeletonExcerpt}></div>
                  <div
                    className={styles.skeletonExcerpt}
                    style={{ width: "70%" }}
                  ></div>
                </div>
                <div className={styles.articleSkeleton}>
                  <div className={styles.skeletonTitle}></div>
                  <div className={styles.skeletonExcerpt}></div>
                  <div
                    className={styles.skeletonExcerpt}
                    style={{ width: "60%" }}
                  ></div>
                </div>
              </div>
            ) : error ? (
              <div className={styles.errorMessage}>{error}</div>
            ) : filteredArticles.length === 0 ? (
              <div className={styles.noArticles}>
                <h3>No articles found in this category yet.</h3>
                <p>Be the first to write about this topic!</p>
                <Link href="/write" className={styles.writeFirstLink}>
                  Write your first story
                </Link>
              </div>
            ) : (
              filteredArticles.map((article) => (
                <article key={article.id} className={styles.articleCard}>
                  <div className={styles.articleContent}>
                    <div className={styles.articleMeta}>
                      <Link
                        href={`/profile/${article.author?.id || "anonymous"}`}
                        className={styles.authorInfo}
                      >
                        <div className={styles.authorAvatar}>
                          {article.author?.imageUrl ? (
                            <img
                              src={article.author.imageUrl}
                              alt={article.author.firstName || "Author"}
                            />
                          ) : (
                            <span>{article.author?.firstName?.[0] || "A"}</span>
                          )}
                        </div>
                        <span className={styles.authorName}>
                          {article.author?.firstName || "Anonymous"}{" "}
                          {article.author?.lastName || ""}
                        </span>
                      </Link>
                      <span className={styles.dot}>·</span>
                      <span className={styles.articleDate}>
                        {new Date(article.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </span>
                      {article.topics && article.topics.length > 0 && (
                        <div className={styles.articleTopics}>
                          {article.topics.map((topic, index) => (
                            <span
                              key={index}
                              className={styles.articleTopic}
                              onClick={() => {
                                // Set active tab to this topic's tab
                                const topicTab = topic
                                  .toLowerCase()
                                  .replace(/\s+/g, "-");
                                setActiveTab(topicTab);
                              }}
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <Link
                      href={`/article/${article.id}`}
                      className={styles.articleTitle}
                    >
                      <h2>{article.title}</h2>
                    </Link>
                    <Link href={`/article/${article.id}`}>
                      <p className={styles.articleExcerpt}>{article.excerpt}</p>
                    </Link>
                    <div className={styles.articleActions}>
                      <div className={styles.leftActions}>
                        <div className={styles.actionButton}>
                          <span>👏</span>
                          <span>{article.claps || 0}</span>
                        </div>
                        <div className={styles.actionButton}>
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M18 16.8a7.14 7.14 0 0 0 2.24-5.32c0-4.12-3.53-7.48-8.05-7.48C7.67 4 4 7.36 4 11.48c0 4.13 3.67 7.48 8.2 7.48a8.9 8.9 0 0 0 2.38-.32c.23.2.48.39.75.56 1.06.69 2.2 1.04 3.4 1.04.22 0 .4-.11.48-.29a.5.5 0 0 0-.04-.52 6.4 6.4 0 0 1-1.16-2.65v.02zm-3.12 1.06l-.06-.22-.32.1a8 8 0 0 1-2.3.33c-4.03 0-7.3-2.96-7.3-6.59S8.17 4.9 12.2 4.9c4.02 0 7.3 2.96 7.3 6.6 0 1.8-.6 3.47-2.02 4.72l-.2.16v.26l.02.3a6.74 6.74 0 0 0 .88 2.4 5.27 5.27 0 0 1-2.17-.86c-.28-.17-.72-.38-.94-.59l.01-.02z"
                              fill="currentColor"
                            ></path>
                          </svg>
                          <span>{article.comments?.length || 0}</span>
                        </div>
                      </div>
                      <div className={styles.rightActions}>
                        <button className={styles.saveButton} title="Save">
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
                  </div>
                  {article.image && (
                    <Link
                      href={`/article/${article.id}`}
                      className={styles.articleImage}
                    >
                      <img src={article.image} alt={article.title} />
                    </Link>
                  )}
                </article>
              ))
            )}
          </div>

          {/* Sidebar */}
          <aside className={styles.sidebar}>
            <div className={styles.sidebarSticky}>
              <div className={styles.topicsSection}>
                <h3 className={styles.sidebarHeading}>Recommended topics</h3>
                <div className={styles.topicTags}>
                  {topicsToFollow.map((topic, index) => (
                    <button
                      key={index}
                      className={styles.topicTag}
                      onClick={() => followTopic(topic)}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
                {followedTopics.length > 0 && (
                  <>
                    <h4 className={styles.followedTopicsHeading}>Following</h4>
                    <div className={styles.followedTopics}>
                      {followedTopics.map((topic, index) => (
                        <button
                          key={index}
                          className={styles.followedTopicTag}
                          onClick={() => unfollowTopic(topic)}
                        >
                          {topic} <span className={styles.unfollowIcon}>×</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className={styles.footerLinks}>
                <Link href="#">Help</Link>
                <Link href="#">Status</Link>
                <Link href="#">Writers</Link>
                <Link href="#">Blog</Link>
                <Link href="#">Careers</Link>
                <Link href="#">Privacy</Link>
                <Link href="#">Terms</Link>
                <Link href="#">About</Link>
                <Link href="#">Text to speech</Link>
                <p className={styles.copyright}>© 2025 Medlog</p>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
