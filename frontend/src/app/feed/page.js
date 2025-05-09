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

  const followTopic = (topic) => {
    setFollowedTopics([...followedTopics, topic]);
    setTopicsToFollow(topicsToFollow.filter((t) => t !== topic));
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
            <Link href="/" className={styles.logo}>
              <img
                src="/medium-logo.png"
                alt="Medium Logo"
                className={styles.logoImg}
              />
            </Link>
            <div className={styles.searchContainer}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
                  fill="currentColor"
                ></path>
              </svg>
              <input
                type="text"
                placeholder="Search"
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
              <span>Write</span>
            </Link>
            <button className={styles.notificationBtn}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M15 18.5a3 3 0 1 1-6 0"
                  stroke="currentColor"
                  strokeLinecap="round"
                ></path>
                <path
                  d="M5.5 10.53V9a6.5 6.5 0 0 1 13 0v1.53c0 1.42.28 2.83.82 4.14l.9 2.33a1 1 0 0 1-.9 1.4h-13.6C4.97 18.4 4.42 17.73 4.67 17l.9-2.33a10.46 10.46 0 0 0 .82-4.14z"
                  stroke="currentColor"
                  strokeLinecap="round"
                ></path>
              </svg>
            </button>
            <div className={styles.profileContainer}>
              <UserButton afterSignOutUrl="/" />
            </div>
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
          {/* Main Content Area */}
          <div className={styles.articlesSection}>
            {loading ? (
              <div className={styles.loading}>Loading articles...</div>
            ) : error ? (
              <div className={styles.error}>{error}</div>
            ) : articles.length === 0 ? (
              <div className={styles.noArticles}>
                <p>No articles found.</p>
                <Link href="/write" className={styles.writeFirstLink}>
                  Write your first story
                </Link>
              </div>
            ) : (
              articles.map((article) => (
                <article key={article.id} className={styles.articleCard}>
                  <div className={styles.articleContent}>
                    <div className={styles.articleAuthor}>
                      <img
                        src={`https://ui-avatars.com/api/?name=${article.author.firstName}+${article.author.lastName}&background=random`}
                        alt={`${article.author.firstName} ${article.author.lastName}`}
                        className={styles.authorImage}
                      />
                      <span className={styles.authorName}>
                        {article.author.firstName} {article.author.lastName}
                      </span>
                      <span className={styles.articleDate}>
                        ·{" "}
                        {new Date(article.createdAt).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric" }
                        )}
                      </span>
                    </div>
                    <Link
                      href={`/article/${article.id}`}
                      className={styles.articleLink}
                    >
                      <h2 className={styles.articleTitle}>{article.title}</h2>
                    </Link>
                    <p className={styles.articleExcerpt}>{article.excerpt}</p>
                    <div className={styles.articleMeta}>
                      <div className={styles.metaLeft}>
                        <span className={styles.readTime}>
                          {article.readTime}
                        </span>
                        <span className={styles.dot}>·</span>
                        <span className={styles.category}>
                          {article.category || "Technology"}
                        </span>
                      </div>
                      <div className={styles.metaRight}>
                        <button className={styles.saveBtn}>
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M17.5 1.25a.75.75 0 0 1 .75.75v5.5a.75.75 0 0 1-1.5 0V2h-10v20h10v-5.25a.75.75 0 0 1 1.5 0v6a.75.75 0 0 1-.75.75h-11.5a.75.75 0 0 1-.75-.75v-21.5a.75.75 0 0 1 .75-.75h11.5z"
                              fill="currentColor"
                            ></path>
                            <path
                              d="M17.5 11.5a.75.75 0 0 1 .75-.75h5.5a.75.75 0 0 1 0 1.5h-5.5a.75.75 0 0 1-.75-.75z"
                              fill="currentColor"
                            ></path>
                            <path
                              d="M15 8a.75.75 0 0 1 .75.75v5.5a.75.75 0 0 1-1.5 0v-5.5A.75.75 0 0 1 15 8z"
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
              <div className={styles.staffPicks}>
                <h3 className={styles.sidebarHeading}>Staff Picks</h3>
                <div className={styles.staffPicksList}>
                  {staffPicks.map((pick, index) => (
                    <div key={index} className={styles.staffPickItem}>
                      <div className={styles.pickAuthor}>
                        <img
                          src={pick.avatar}
                          alt={pick.author}
                          className={styles.pickAuthorImage}
                        />
                        <span>
                          {pick.author}{" "}
                          {pick.isStarred && (
                            <span className={styles.starIcon}>✓</span>
                          )}
                        </span>
                      </div>
                      <h4 className={styles.pickTitle}>{pick.title}</h4>
                      <span className={styles.pickDate}>{pick.date}</span>
                    </div>
                  ))}
                </div>
                <Link href="#" className={styles.seeAllLink}>
                  See the full list
                </Link>
              </div>

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
                <p className={styles.copyright}>© 2023 Medium Clone</p>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
