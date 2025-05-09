"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import Link from "next/link";
import PostCard from "../../components/PostCard";

// Mock data
const posts = [
  {
    id: 1,
    title: "The Future of Web Development: What's Coming in 2023",
    excerpt:
      "Web development continues to evolve at a rapid pace. Here's what to expect in the coming year with new frameworks, tools, and methodologies.",
    readTime: 5,
    date: "Jan 15",
    author: {
      name: "John Doe",
      avatar: "/placeholder-avatar.png",
    },
  },
  {
    id: 2,
    title: "Understanding React Hooks: A Beginner's Guide",
    excerpt:
      "React Hooks have revolutionized how we manage state and side effects in React components. This guide breaks down the most common hooks and how to use them effectively.",
    readTime: 7,
    date: "Feb 2",
    author: {
      name: "Jane Smith",
      avatar: "/placeholder-avatar.png",
    },
  },
  {
    id: 3,
    title: "Building Responsive Layouts with Tailwind CSS",
    excerpt:
      "Tailwind CSS provides a utility-first approach to styling. Learn how to create beautiful, responsive layouts without writing custom CSS.",
    readTime: 4,
    date: "Mar 10",
    author: {
      name: "Alex Johnson",
      avatar: "/placeholder-avatar.png",
    },
  },
];

export default function Feed() {
  const { isSignedIn, isLoaded } = useUser();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (isLoaded && !isSignedIn && !isRedirecting) {
      setIsRedirecting(true);
      window.location.href = "/sign-in?redirect=/feed";
    }
  }, [isLoaded, isSignedIn, isRedirecting]);

  if (!isLoaded || isRedirecting) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Feed</h1>

      <div className="mb-8">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      <div className="text-center">
        <Link
          href="/discover"
          className="text-green-600 hover:text-green-700 font-medium"
        >
          Discover more content
        </Link>
      </div>
    </div>
  );
}
