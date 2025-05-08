"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function BookmarksPage() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in?redirect=/bookmarks");
    }
  }, [isLoaded, isSignedIn, router]);

  // Sample bookmarked posts - would come from your API
  const bookmarks = [
    {
      id: "1",
      title: "Building a Medium Clone with Next.js",
      excerpt:
        "Learn how to create a Medium clone using Next.js, Tailwind CSS, and Clerk for authentication.",
      author: {
        name: "John Doe",
        image: "https://via.placeholder.com/40",
      },
      savedAt: "Dec 20, 2023",
      readTime: "5 min read",
    },
    {
      id: "2",
      title: "The Future of Web Development",
      excerpt:
        "Exploring the latest trends and technologies shaping the future of web development.",
      author: {
        name: "Jane Smith",
        image: "https://via.placeholder.com/40",
      },
      savedAt: "Dec 15, 2023",
      readTime: "7 min read",
    },
  ];

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-6">
      <h1 className="text-3xl font-bold mb-8">Your bookmarks</h1>

      {bookmarks.length > 0 ? (
        <div className="space-y-8">
          {bookmarks.map((bookmark) => (
            <article
              key={bookmark.id}
              className="border-b border-gray-200 pb-8"
            >
              <div className="flex items-center gap-2 mb-2">
                <img
                  src={bookmark.author.image}
                  alt={bookmark.author.name}
                  className="w-6 h-6 rounded-full"
                />
                <span className="text-sm font-medium">
                  {bookmark.author.name}
                </span>
              </div>

              <Link href={`/post/${bookmark.id}`}>
                <h2 className="text-xl font-bold mb-2 hover:underline">
                  {bookmark.title}
                </h2>
                <p className="text-gray-700 mb-3 line-clamp-2">
                  {bookmark.excerpt}
                </p>
              </Link>

              <div className="flex justify-between items-center">
                <div className="flex items-center text-sm text-gray-500">
                  <span>Saved on {bookmark.savedAt}</span>
                  <span className="mx-1">·</span>
                  <span>{bookmark.readTime}</span>
                </div>

                <button className="text-gray-500 hover:text-gray-700 text-sm font-medium">
                  Remove
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-3">
            You haven't saved any stories yet.
          </p>
          <p className="text-gray-500 mb-6">
            Browse the feed and click the bookmark icon on any story to save it
            for later.
          </p>
          <Link
            href="/feed"
            className="px-5 py-2 bg-black text-white rounded-full font-medium"
          >
            Browse stories
          </Link>
        </div>
      )}
    </div>
  );
}
