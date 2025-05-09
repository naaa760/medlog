"use client";

import { useState, useEffect } from "react";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import styles from "./article.module.css";

export default function ArticlePage({ params }) {
  const { id } = params;
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [claps, setClaps] = useState(0);
  const [userClapped, setUserClapped] = useState(false);

  useEffect(() => {
    // Mock data - will be replaced with API call
    setArticle({
      id: id,
      title: "The Power of JavaScript",
      content: `
        <p>JavaScript has become the backbone of modern web development. From simple websites to complex applications, JavaScript powers the interactive elements that users have come to expect.</p>
        <h2>Why JavaScript Matters</h2>
        <p>As the only programming language native to web browsers, JavaScript has a unique position in the web development ecosystem. It allows developers to create dynamic content, control multimedia, animate images, and pretty much everything else.</p>
        <p>With the advent of Node.js, JavaScript broke free from the browser, enabling server-side applications with the same language used on the frontend. This gave rise to the concept of "JavaScript everywhere" and full-stack development with a single language.</p>
        <h2>Modern JavaScript Features</h2>
        <p>ECMAScript 6 (ES6) and subsequent versions have introduced powerful features that make JavaScript more expressive and developer-friendly:</p>
        <ul>
          <li>Arrow functions</li>
          <li>Template literals</li>
          <li>Destructuring</li>
          <li>Spread/rest operators</li>
          <li>Classes</li>
          <li>Modules</li>
          <li>Promises and async/await</li>
        </ul>
        <p>These features have transformed JavaScript into a more mature language suitable for large-scale applications.</p>
        <h2>The JavaScript Ecosystem</h2>
        <p>One of JavaScript's greatest strengths is its vast ecosystem. Libraries and frameworks like React, Vue, and Angular have revolutionized frontend development, while Express, Next.js, and NestJS have become popular choices for backend development.</p>
        <p>The npm registry, JavaScript's package manager, is the largest software registry in the world, with over a million packages available for developers to use.</p>
        <h2>Conclusion</h2>
        <p>JavaScript's journey from a simple scripting language to a powerful programming language used by millions of developers worldwide is remarkable. As web technologies continue to evolve, JavaScript remains at the forefront, adapting and growing to meet new challenges.</p>
        <p>Whether you're just starting your programming journey or you're a seasoned developer, JavaScript offers something for everyone, making it an essential language to learn in today's digital world.</p>
      `,
      author: "John Doe",
      authorBio: "Frontend Developer and JavaScript enthusiast",
      date: "Oct 10, 2023",
      readTime: "5 min read",
      category: "Programming",
      claps: 42,
      image: "https://picsum.photos/id/237/1200/600",
    });
    setClaps(42);
    setLoading(false);
  }, [id]);

  const handleClap = () => {
    if (!userClapped) {
      setClaps(claps + 1);
      setUserClapped(true);
      // API call would go here in a real implementation
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading article...</div>;
  }

  return (
    <div className={styles.articleContainer}>
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
        <article className={styles.article}>
          <h1 className={styles.articleTitle}>{article.title}</h1>

          <div className={styles.articleMeta}>
            <div className={styles.authorInfo}>
              <div className={styles.author}>
                <span>{article.author}</span>
              </div>
              <div className={styles.articleDetails}>
                <span>{article.date}</span>
                <span className={styles.dot}>·</span>
                <span>{article.readTime}</span>
              </div>
            </div>

            <div className={styles.socialActions}>
              <button className={styles.clapButton} onClick={handleClap}>
                <span className={styles.clapIcon}>👏</span>
                <span>{claps}</span>
              </button>
            </div>
          </div>

          <div className={styles.featuredImage}>
            <img src={article.image} alt={article.title} />
          </div>

          <div
            className={styles.articleContent}
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          <div className={styles.articleFooter}>
            <div className={styles.authorBio}>
              <h3>About the author</h3>
              <p>{article.authorBio}</p>
            </div>

            <div className={styles.articleActions}>
              <button className={styles.clapButtonLarge} onClick={handleClap}>
                <span className={styles.clapIcon}>👏</span>
                <span>{claps}</span>
              </button>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}
