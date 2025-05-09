"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import styles from "./write.module.css";

export default function WritePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePublish = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert("Please add both title and content to publish");
      return;
    }

    setIsSubmitting(true);

    // This is a mock API call - will be replaced with real API
    try {
      // Mock successful submission
      console.log("Article published:", { title, content });

      // Redirect to feed page after successful submission
      setTimeout(() => {
        router.push("/feed");
      }, 1000);
    } catch (error) {
      console.error("Error publishing article:", error);
      alert("Failed to publish your article. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.writeContainer}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link href="/feed" className={styles.logo}>
            <img src="/medium-logo.png" alt="Medium Logo" />
          </Link>
          <div className={styles.headerRight}>
            <button
              className={styles.publishButton}
              onClick={handlePublish}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Publishing..." : "Publish"}
            </button>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>

      <main className={styles.editorContainer}>
        <div className={styles.editor}>
          <input
            type="text"
            placeholder="Title"
            className={styles.titleInput}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            placeholder="Tell your story..."
            className={styles.contentInput}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
      </main>
    </div>
  );
}
