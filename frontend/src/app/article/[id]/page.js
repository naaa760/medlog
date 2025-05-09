"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ArticlePage({ params }) {
  const { id } = params;
  const { user } = useUser();
  const router = useRouter();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load article from localStorage
    try {
      const savedArticles = JSON.parse(
        localStorage.getItem("medium-published-articles") || "[]"
      );
      const foundArticle = savedArticles.find(
        (article) => article.id.toString() === id
      );

      if (foundArticle) {
        setArticle(foundArticle);
      } else {
        console.error("Article not found");
      }
    } catch (error) {
      console.error("Error loading article:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading article...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Article not found</h1>
        <p className="text-gray-600 mb-8">
          The article you are looking for doesn&apos;t exist or has been
          removed.
        </p>
        <Link
          href="/profile"
          className="inline-block bg-gray-900 text-white px-6 py-3 rounded-full"
        >
          Go to your profile
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <article>
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {article.title}
          </h1>

          <div className="flex items-center mb-6">
            <div className="flex items-center">
              {user?.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt={user.firstName || user.username}
                  className="w-12 h-12 rounded-full mr-3"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 mr-3">
                  {(
                    user?.firstName?.[0] ||
                    user?.username?.[0] ||
                    ""
                  ).toUpperCase()}
                </div>
              )}

              <div>
                <p className="font-medium text-gray-900">
                  {article.author ||
                    user?.firstName ||
                    user?.username ||
                    "Anonymous"}
                </p>
                <div className="text-gray-500 text-sm flex items-center">
                  <span>{article.date}</span>
                  <span className="mx-1">·</span>
                  <span>{article.readTime}</span>
                </div>
              </div>
            </div>

            <div className="ml-auto flex space-x-4">
              <button className="text-gray-400 hover:text-gray-600">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M17.5 1.25a.5.5 0 0 1 1 0v2.5H21a.5.5 0 0 1 0 1h-2.5v2.5a.5.5 0 0 1-1 0v-2.5H15a.5.5 0 0 1 0-1h2.5v-2.5zm-11 4.5a1 1 0 0 1 1-1H11a.5.5 0 0 0 0-1H7.5a2 2 0 0 0-2 2v14a.5.5 0 0 0 .8.4l5.7-4.4 5.7 4.4a.5.5 0 0 0 .8-.4v-8.5a.5.5 0 0 0-1 0v7.48l-5.2-4a.5.5 0 0 0-.6 0l-5.2 4V5.75z"
                    fill="currentColor"
                  ></path>
                </svg>
              </button>

              <button
                onClick={() => router.push(`/write?edit=${article.id}`)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>
            </div>
          </div>
        </header>

        <div className="article-content prose prose-lg max-w-none">
          {article.blocks && article.blocks.length > 0 ? (
            <div>
              {article.blocks.map((block) => (
                <div key={block.id} className="mb-6">
                  {block.type === "text" && (
                    <div className="whitespace-pre-wrap">{block.content}</div>
                  )}

                  {block.type === "image" && (
                    <div className="my-6">
                      <img
                        src={block.content}
                        alt="Article image"
                        className="max-w-full rounded-md"
                      />
                    </div>
                  )}

                  {block.type === "video" && (
                    <div className="my-6">
                      <div className="relative pt-[56.25%] bg-gray-100 rounded-md">
                        <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                          <p>Video: {block.content}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {block.type === "embed" && (
                    <div className="my-6">
                      <div className="relative pt-[56.25%] bg-gray-100 rounded-md">
                        <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                          <p>Embed: {block.content}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p>{article.content || article.excerpt}</p>
          )}
        </div>
      </article>

      <hr className="my-8 border-gray-200" />

      <div className="flex items-center justify-between py-6">
        <div className="flex items-center">
          {user?.imageUrl ? (
            <img
              src={user.imageUrl}
              alt={user.firstName || user.username}
              className="w-16 h-16 rounded-full mr-4"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 mr-4">
              {(
                user?.firstName?.[0] ||
                user?.username?.[0] ||
                ""
              ).toUpperCase()}
            </div>
          )}

          <div>
            <h3 className="font-medium text-gray-900 mb-1">
              Written by{" "}
              {article.author ||
                user?.firstName ||
                user?.username ||
                "Anonymous"}
            </h3>
            <p className="text-gray-600 text-sm">
              Author of articles on Medium.
            </p>
          </div>
        </div>

        <button className="border border-gray-300 rounded-full px-4 py-1 text-sm text-gray-700 hover:bg-gray-50">
          Follow
        </button>
      </div>
    </div>
  );
}
