"use client";

import { use } from "react";
import { useState, useEffect, Suspense } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ArticlePage({ params }) {
  // Unwrap params in the main component
  const unwrappedParams = use(params);
  const { id } = unwrappedParams;

  // Then render the content component with just the ID
  return <ArticleContent articleId={id} />;
}

function ArticleContent({ articleId }) {
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
        (article) => article.id.toString() === articleId
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
  }, [articleId]);

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
            <div className="w-10 h-10 bg-gray-200 rounded-full mr-3 flex items-center justify-center">
              {article.author?.imageUrl ? (
                <img
                  src={article.author.imageUrl}
                  alt={`${article.author.firstName || ""} ${
                    article.author.lastName || ""
                  }`}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-gray-600 text-lg font-medium">
                  {article.author?.firstName?.[0] || "A"}
                </span>
              )}
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {article.author?.firstName || ""}{" "}
                {article.author?.lastName || ""}
              </p>
              <p className="text-sm text-gray-500">
                {new Date(article.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}{" "}
                · {article.readTime}
              </p>
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
              Written by {article.author?.firstName || ""}{" "}
              {article.author?.lastName || ""}
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
