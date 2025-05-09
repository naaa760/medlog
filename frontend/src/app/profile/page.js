"use client";

import { useState, useEffect } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import styles from "./profile.module.css";

export default function ProfilePage() {
  const { user } = useUser();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("stories");

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
              title: "React vs Vue: My Perspective",
              excerpt:
                "Comparing two popular frontend frameworks from a developer's point of view.",
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

  if (!user) {
    return <div className={styles.loading}>Loading profile...</div>;
  }

  return (
    <div className={styles.profileContainer}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link href="/feed" className={styles.logo}>
            <img src="/medium-logo.png" alt="Medium Logo" />
          </Link>
          <div className={styles.headerRight}>
            <Link href="/write" className={styles.writeLink}>
              Write
            </Link>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.profileHeader}>
          <div className={styles.userInfo}>
            <h1 className={styles.userName}>
              {user.fullName || user.username}
            </h1>
            <p className={styles.userBio}>Writer and tech enthusiast</p>
          </div>
          <div className={styles.profileActions}>
            <button className={styles.editProfileButton}>Edit profile</button>
          </div>
        </div>

        <div className={styles.tabs}>
          <button
            className={`${styles.tabButton} ${
              activeTab === "stories" ? styles.activeTab : ""
            }`}
            onClick={() => setActiveTab("stories")}
          >
            Stories
          </button>
          <button
            className={`${styles.tabButton} ${
              activeTab === "about" ? styles.activeTab : ""
            }`}
            onClick={() => setActiveTab("about")}
          >
            About
          </button>
        </div>

        <div className={styles.tabContent}>
          {activeTab === "stories" && (
            <div className={styles.storiesTab}>
              {loading ? (
                <div className={styles.loading}>Loading stories...</div>
              ) : articles.length === 0 ? (
                <div className={styles.emptyState}>
                  <h2>You haven&apos;t published any stories yet</h2>
                  <p>Start writing to share your thoughts with the world</p>
                  <Link href="/write" className={styles.startWritingButton}>
                    Start Writing
                  </Link>
                </div>
              ) : (
                <div className={styles.articlesList}>
                  {articles.map((article) => (
                    <article key={article.id} className={styles.articleItem}>
                      <Link href={`/article/${article.id}`}>
                        <h2 className={styles.articleTitle}>{article.title}</h2>
                      </Link>
                      <p className={styles.articleExcerpt}>{article.excerpt}</p>
                      <div className={styles.articleMeta}>
                        <span>{article.date}</span>
                        <span className={styles.dot}>·</span>
                        <span>{article.readTime}</span>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "about" && (
            <div className={styles.aboutTab}>
              <h2 className={styles.aboutHeading}>
                About {user.fullName || user.username}
              </h2>
              <p className={styles.aboutText}>
                This is where your bio would appear. Edit your profile to add
                information about yourself.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
