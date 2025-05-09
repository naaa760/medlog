"use client";

import { useState, useEffect } from "react";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import styles from "./feed.module.css";

export default function Feed() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for now - will be replaced with real API calls
    setArticles([
      {
        id: 1,
        title: "The Power of JavaScript",
        excerpt:
          "Exploring the versatility of JavaScript in modern web development.",
        author: "John Doe",
        date: "Oct 10, 2023",
        readTime: "5 min read",
        category: "Programming",
        image: "https://picsum.photos/id/237/200/200",
      },
      {
        id: 2,
        title: "Getting Started with Next.js",
        excerpt:
          "A beginner-friendly guide to building applications with Next.js.",
        author: "Jane Smith",
        date: "Oct 8, 2023",
        readTime: "8 min read",
        category: "Web Development",
        image: "https://picsum.photos/id/238/200/200",
      },
      {
        id: 3,
        title: "PostgreSQL Best Practices",
        excerpt:
          "Optimize your database performance with these PostgreSQL tips.",
        author: "Alex Johnson",
        date: "Oct 5, 2023",
        readTime: "10 min read",
        category: "Databases",
        image: "https://picsum.photos/id/239/200/200",
      },
    ]);
    setLoading(false);
  }, []);

  return (
    <div className={styles.feedContainer}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link href="/feed" className={styles.logo}>
            <img src="/medium-logo.png" alt="Medium Logo" />
          </Link>
          <div className={styles.headerRight}>
            <Link href="/write" className={styles.writeLink}>
              Write
            </Link>
            <Link href="/profile" className={styles.profileLink}>
              Profile
            </Link>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.feedContent}>
          <div className={styles.articlesSection}>
            {loading ? (
              <div className={styles.loading}>Loading articles...</div>
            ) : (
              articles.map((article) => (
                <article key={article.id} className={styles.articleCard}>
                  <div className={styles.articleContent}>
                    <div className={styles.articleAuthor}>
                      <span>{article.author}</span> •{" "}
                      <span>{article.date}</span>
                    </div>
                    <Link href={`/article/${article.id}`}>
                      <h2 className={styles.articleTitle}>{article.title}</h2>
                    </Link>
                    <p className={styles.articleExcerpt}>{article.excerpt}</p>
                    <div className={styles.articleMeta}>
                      <span className={styles.readTime}>
                        {article.readTime}
                      </span>
                      <span className={styles.category}>
                        {article.category}
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/article/${article.id}`}
                    className={styles.articleImage}
                  >
                    <img src={article.image} alt={article.title} />
                  </Link>
                </article>
              ))
            )}
          </div>
          <aside className={styles.sidebar}>
            <div className={styles.sidebarSticky}>
              <h3>Discover more of what matters to you</h3>
              <div className={styles.topicTags}>
                <span>Programming</span>
                <span>Data Science</span>
                <span>Technology</span>
                <span>Self Improvement</span>
                <span>Writing</span>
                <span>Relationships</span>
                <span>Machine Learning</span>
                <span>Productivity</span>
              </div>
              <div className={styles.sidebarLinks}>
                <Link href="/">Help</Link>
                <Link href="/">Status</Link>
                <Link href="/">Writers</Link>
                <Link href="/">Blog</Link>
                <Link href="/">Careers</Link>
                <Link href="/">Privacy</Link>
                <Link href="/">Terms</Link>
                <Link href="/">About</Link>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
