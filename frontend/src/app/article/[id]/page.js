"use client";

import { use } from "react";
import { useState, useEffect, useRef } from "react";
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
  const [commentText, setCommentText] = useState("");
  const [readingProgress, setReadingProgress] = useState(0);
  const articleRef = useRef(null);
  const [hasClapped, setHasClapped] = useState(false);

  // Track reading progress
  useEffect(() => {
    const handleScroll = () => {
      if (!articleRef.current) return;

      const element = articleRef.current;
      const totalHeight = element.clientHeight;
      const windowHeight = window.innerHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;

      const currentPosition = scrollTop + windowHeight;
      const articleOffset = element.offsetTop;

      const scrollPercentage = Math.min(
        100,
        Math.max(0, ((currentPosition - articleOffset) / totalHeight) * 100)
      );

      setReadingProgress(scrollPercentage);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Load article
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

        // Check if the current user has already clapped for this article
        const clappedArticles = JSON.parse(
          localStorage.getItem("medium-clapped-articles") || "[]"
        );

        // If user is logged in, check against their ID, otherwise use a fallback
        const userId = user?.id || "anonymous";
        const hasUserClapped = clappedArticles.some(
          (item) => item.articleId === articleId && item.userId === userId
        );

        setHasClapped(hasUserClapped);
      } else {
        console.error("Article not found");
      }
    } catch (error) {
      console.error("Error loading article:", error);
    } finally {
      setLoading(false);
    }
  }, [articleId, user]);

  const handleClap = () => {
    // If user already clapped, don't allow another clap
    if (hasClapped) return;

    // Create updated article with incremented clap count
    const updatedArticle = {
      ...article,
      claps: (article.claps || 0) + 1,
    };

    setArticle(updatedArticle);
    setHasClapped(true);

    // Record that this user has clapped this article
    const userId = user?.id || "anonymous";
    const clappedArticles = JSON.parse(
      localStorage.getItem("medium-clapped-articles") || "[]"
    );

    // Add this article to the list of articles the user has clapped for
    clappedArticles.push({
      articleId,
      userId,
      timestamp: new Date().toISOString(),
    });

    localStorage.setItem(
      "medium-clapped-articles",
      JSON.stringify(clappedArticles)
    );

    // Update article in localStorage
    const savedArticles = JSON.parse(
      localStorage.getItem("medium-published-articles") || "[]"
    );

    const updatedArticles = savedArticles.map((a) =>
      a.id.toString() === articleId ? updatedArticle : a
    );

    localStorage.setItem(
      "medium-published-articles",
      JSON.stringify(updatedArticles)
    );

    // Simulate real-time updates by dispatching an event
    window.dispatchEvent(
      new CustomEvent("article-updated", {
        detail: { article: updatedArticle },
      })
    );
  };

  const handleAddComment = () => {
    if (!commentText.trim()) return;

    const newComment = {
      id: Date.now(),
      content: commentText,
      author: {
        firstName: user?.firstName || "Anonymous",
        lastName: user?.lastName || "",
        imageUrl: user?.imageUrl || "",
      },
      createdAt: new Date().toISOString(),
    };

    // Create updated article with new comment
    const updatedArticle = {
      ...article,
      comments: [...(article.comments || []), newComment],
    };

    setArticle(updatedArticle);
    setCommentText("");

    // Update in localStorage
    const savedArticles = JSON.parse(
      localStorage.getItem("medium-published-articles") || "[]"
    );

    const updatedArticles = savedArticles.map((a) =>
      a.id.toString() === articleId ? updatedArticle : a
    );

    localStorage.setItem(
      "medium-published-articles",
      JSON.stringify(updatedArticles)
    );

    // Simulate real-time updates
    window.dispatchEvent(
      new CustomEvent("article-updated", {
        detail: { article: updatedArticle },
      })
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 w-64 bg-gray-200 rounded"></div>
        </div>
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
          className="inline-block bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition-colors"
        >
          Go to your profile
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Reading progress bar */}
      <div className="fixed top-0 left-0 z-50 w-full h-1 bg-gray-100">
        <div
          className="h-full bg-green-600 transition-all duration-150 ease-out"
          style={{ width: `${readingProgress}%` }}
        ></div>
      </div>

      {/* Article header with featured image */}
      {article.image && (
        <div className="w-full h-[50vh] relative">
          <div className="absolute inset-0 bg-black/40 z-10"></div>
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 z-20 text-white p-10 bg-gradient-to-t from-black/80 to-transparent pt-32">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                {article.title}
              </h1>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-200 rounded-full mr-3 flex items-center justify-center overflow-hidden">
                  {article.author?.imageUrl ? (
                    <img
                      src={article.author.imageUrl}
                      alt={`${article.author.firstName || ""} ${
                        article.author.lastName || ""
                      }`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-600 text-lg font-medium">
                      {article.author?.firstName?.[0] || "A"}
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-medium">
                    {article.author?.firstName || ""}{" "}
                    {article.author?.lastName || ""}
                  </p>
                  <p className="text-sm opacity-80">
                    {new Date(article.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}{" "}
                    · {article.readTime}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 py-10" ref={articleRef}>
        {/* If no featured image, show title here instead */}
        {!article.image && (
          <header className="mb-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-gray-900">
              {article.title}
            </h1>
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gray-200 rounded-full mr-4 flex items-center justify-center overflow-hidden">
                {article.author?.imageUrl ? (
                  <img
                    src={article.author.imageUrl}
                    alt={`${article.author.firstName || ""} ${
                      article.author.lastName || ""
                    }`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-600 text-xl font-medium">
                    {article.author?.firstName?.[0] || "A"}
                  </span>
                )}
              </div>
              <div>
                <p className="font-medium text-lg text-gray-900">
                  {article.author?.firstName || ""}{" "}
                  {article.author?.lastName || ""}
                </p>
                <p className="text-gray-500">
                  {new Date(article.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}{" "}
                  · {article.readTime}
                </p>
              </div>
            </div>
          </header>
        )}

        <article className="bg-white rounded-lg shadow-sm p-8 mb-8">
          {/* Article content */}
          <div className="article-content prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-green-600 prose-blockquote:border-l-green-500 prose-blockquote:bg-gray-50 prose-blockquote:p-4 prose-blockquote:italic">
            {article.blocks && article.blocks.length > 0 ? (
              <div>
                {article.blocks.map((block, index) => (
                  <div
                    key={block.id}
                    className={`mb-8 ${
                      index === 0
                        ? "first-letter:text-4xl first-letter:font-bold first-letter:text-green-600 first-letter:mr-1 first-letter:float-left first-paragraph"
                        : ""
                    }`}
                  >
                    {block.type === "text" && (
                      <div className="whitespace-pre-wrap leading-relaxed">
                        {block.content}
                      </div>
                    )}

                    {block.type === "image" && (
                      <div className="my-10">
                        <img
                          src={block.content}
                          alt="Article image"
                          className="max-w-full rounded-lg shadow-md mx-auto"
                        />
                      </div>
                    )}

                    {block.type === "video" && (
                      <div className="my-10">
                        <div className="relative pt-[56.25%] bg-gray-100 rounded-lg shadow overflow-hidden">
                          <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                            <p>Video: {block.content}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {block.type === "embed" && (
                      <div className="my-10">
                        <div className="relative pt-[56.25%] bg-gray-100 rounded-lg shadow overflow-hidden">
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
              <p className="leading-relaxed text-gray-700 first-letter:text-4xl first-letter:font-bold first-letter:text-green-600 first-letter:mr-1 first-letter:float-left">
                {article.content || article.excerpt}
              </p>
            )}
          </div>

          {/* Article topics */}
          {article.topics && article.topics.length > 0 && (
            <div className="mt-10 pt-6 border-t border-gray-100">
              <div className="flex flex-wrap gap-2">
                {article.topics.map((topic, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Interaction section */}
          <div className="mt-10 mb-6 pt-6 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <button
                  onClick={handleClap}
                  className={`flex items-center space-x-1 ${
                    hasClapped
                      ? "text-green-600 cursor-default"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  disabled={hasClapped}
                >
                  <span
                    className={`inline-block transition-transform duration-200 ease-in-out ${
                      !hasClapped && "hover:scale-110"
                    }`}
                  >
                    👏
                  </span>
                  <span className="font-medium">{article.claps || 0}</span>
                </button>
                <button
                  onClick={() =>
                    document
                      .getElementById("comments-section")
                      .scrollIntoView({ behavior: "smooth" })
                  }
                  className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M18 16.8a7.14 7.14 0 0 0 2.24-5.32c0-4.12-3.53-7.48-8.05-7.48C7.67 4 4 7.36 4 11.48c0 4.13 3.67 7.48 8.2 7.48a8.9 8.9 0 0 0 2.38-.32c.23.2.48.39.75.56 1.06.69 2.2 1.04 3.4 1.04.22 0 .4-.11.48-.29a.5.5 0 0 0-.04-.52 6.4 6.4 0 0 1-1.16-2.65v.02zm-3.12 1.06l-.06-.22-.32.1a8 8 0 0 1-2.3.33c-4.03 0-7.3-2.96-7.3-6.59S8.17 4.9 12.2 4.9c4.02 0 7.3 2.96 7.3 6.6 0 1.8-.6 3.47-2.02 4.72l-.2.16v.26l.02.3a6.74 6.74 0 0 0 .88 2.4 5.27 5.27 0 0 1-2.17-.86c-.28-.17-.72-.38-.94-.59l.01-.02z"
                      fill="currentColor"
                    ></path>
                  </svg>
                  <span className="font-medium">
                    {article.comments?.length || 0}
                  </span>
                </button>
              </div>
              <div className="flex items-center space-x-4">
                <button className="text-gray-500 hover:text-gray-700 transition-colors">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M15.22 4.93a.42.42 0 0 1-.12.13h.01a.45.45 0 0 1-.29.08.52.52 0 0 1-.3-.13L12.5 3v7.07a.5.5 0 0 1-.5.5.5.5 0 0 1-.5-.5V3.02l-2 2a.45.45 0 0 1-.3.08.5.5 0 0 1-.3-.13.42.42 0 0 1-.12-.12l-.02-.03a.5.5 0 0 1 .11-.68l3-2.5a.5.5 0 0 1 .64 0l3 2.5a.5.5 0 0 1 .12.68z"
                      fill="currentColor"
                    ></path>
                    <path
                      d="M12 21.5a9.5 9.5 0 1 0 0-19 9.5 9.5 0 0 0 0 19z"
                      stroke="currentColor"
                    ></path>
                  </svg>
                </button>
                <button className="text-gray-500 hover:text-gray-700 transition-colors">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M4.39 12c0 .55.2 1.02.59 1.41.39.4.86.59 1.4.59.56 0 1.03-.2 1.42-.59.4-.39.59-.86.59-1.41 0-.55-.2-1.02-.6-1.41A1.93 1.93 0 0 0 6.4 10c-.55 0-1.02.2-1.41.59-.4.39-.6.86-.6 1.41zM10 12c0 .55.2 1.02.58 1.41.4.4.87.59 1.42.59.54 0 1.02-.2 1.4-.59.4-.39.6-.86.6-1.41 0-.55-.2-1.02-.6-1.41a1.93 1.93 0 0 0-1.4-.59c-.55 0-1.04.2-1.42.59-.4.39-.58.86-.58 1.41zm5.6 0c0 .55.2 1.02.57 1.41.4.4.88.59 1.43.59.57 0 1.04-.2 1.43-.59.39-.39.57-.86.57-1.41 0-.55-.2-1.02-.57-1.41A1.93 1.93 0 0 0 17.6 10c-.55 0-1.04.2-1.43.59-.38.39-.57.86-.57 1.41z"
                      fill="currentColor"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Comments section */}
          <div id="comments-section" className="mt-12 mb-8">
            <h3 className="text-xl font-bold mb-6 text-gray-900">Comments</h3>

            {article.comments && article.comments.length > 0 ? (
              <div className="space-y-8">
                {article.comments.map((comment, index) => (
                  <div key={index} className="border-b border-gray-100 pb-6">
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3 overflow-hidden">
                        {comment.author.imageUrl ? (
                          <img
                            src={comment.author.imageUrl}
                            alt={`${comment.author.firstName || ""}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-gray-600 text-lg font-medium">
                            {comment.author.firstName?.[0] || "A"}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {comment.author.firstName} {comment.author.lastName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(comment.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-900">{comment.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-6 text-center mb-8">
                <p className="text-gray-600">
                  No comments yet. Be the first to share your thoughts!
                </p>
              </div>
            )}

            {/* Comment form */}
            <div className="mt-10 bg-gray-50 rounded-lg p-6">
              <h4 className="text-lg font-semibold mb-4 text-gray-900">
                Add a comment
              </h4>
              <div className="flex space-x-4">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center overflow-hidden">
                  {user?.imageUrl ? (
                    <img
                      src={user.imageUrl}
                      alt={user?.firstName || ""}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-600 text-lg font-medium">
                      {user?.firstName?.[0] || "Y"}
                    </span>
                  )}
                </div>
                <div className="flex-grow">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-4 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white text-gray-900"
                    placeholder="What are your thoughts?"
                  ></textarea>
                  <div className="flex justify-end mt-3">
                    <button
                      onClick={handleAddComment}
                      disabled={!commentText.trim()}
                      className={`px-5 py-2 rounded-full transition-all ${
                        commentText.trim()
                          ? "bg-green-600 text-white hover:bg-green-700"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      Respond
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Author section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-16">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden mr-5">
                {article.author?.imageUrl ? (
                  <img
                    src={article.author.imageUrl}
                    alt={`${article.author.firstName || ""}`}
                    className="w-full h-full object-cover"
                  />
                ) : user?.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt={user.firstName || ""}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600 text-xl font-bold">
                    {article.author?.firstName?.[0] ||
                      user?.firstName?.[0] ||
                      "A"}
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-medium text-gray-900 text-lg mb-1">
                  Written by {article.author?.firstName || ""}{" "}
                  {article.author?.lastName || ""}
                </h3>
                <p className="text-gray-600 text-sm">
                  Author of thoughtful articles on Medium. Follow for more
                  insights.
                </p>
              </div>
            </div>

            <button className="border border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-colors rounded-full px-5 py-2 font-medium text-sm">
              Follow
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
