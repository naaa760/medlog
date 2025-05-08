"use client";

import { useUser } from "@clerk/nextjs";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function ProfilePage() {
  const { username } = useParams();
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("posts");

  // Dummy profile data - would be fetched from the backend
  const profile = {
    username: username,
    displayName: "John Doe",
    bio: "Writer and developer passionate about technology and storytelling.",
    image:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100",
    following: 234,
    followers: 567,
  };

  // Dummy posts - would be fetched from the backend
  const posts = [
    {
      id: "1",
      title: "Building a Medium Clone with Next.js",
      excerpt:
        "Learn how to create a Medium clone using Next.js, Tailwind CSS, and Clerk for authentication.",
      date: "Dec 15",
      readTime: "5 min read",
    },
    {
      id: "2",
      title: "The Future of Web Development",
      excerpt:
        "Exploring the latest trends and technologies shaping the future of web development.",
      date: "Dec 10",
      readTime: "7 min read",
    },
  ];

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-6">
      {/* Profile Header */}
      <div className="mb-12">
        <div className="flex items-center gap-6 mb-6">
          <img
            src={profile.image}
            alt={profile.displayName}
            className="w-20 h-20 rounded-full object-cover"
          />
          <div>
            <h1 className="text-3xl font-bold mb-1">{profile.displayName}</h1>
            <div className="flex items-center gap-4 text-gray-600">
              <span>{profile.followers} Followers</span>
              <span>·</span>
              <span>{profile.following} Following</span>
            </div>
          </div>

          {/* Show follow button if not the user's own profile */}
          {isSignedIn && user.username !== username && (
            <button className="ml-auto border border-gray-900 rounded-full px-4 py-1.5 font-medium hover:bg-gray-100">
              Follow
            </button>
          )}

          {/* Show edit profile button if the user's own profile */}
          {isSignedIn && user.username === username && (
            <button
              onClick={() => router.push("/settings")}
              className="ml-auto border border-gray-300 rounded-full px-4 py-1.5 font-medium hover:bg-gray-100"
            >
              Edit profile
            </button>
          )}
        </div>

        <p className="text-gray-700 max-w-xl">{profile.bio}</p>
      </div>

      {/* Profile Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <div className="flex gap-8">
          <button
            onClick={() => setActiveTab("posts")}
            className={`pb-4 relative ${
              activeTab === "posts"
                ? "text-gray-900 font-medium"
                : "text-gray-500"
            }`}
          >
            Posts
            {activeTab === "posts" && (
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-900"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab("about")}
            className={`pb-4 relative ${
              activeTab === "about"
                ? "text-gray-900 font-medium"
                : "text-gray-500"
            }`}
          >
            About
            {activeTab === "about" && (
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-900"></div>
            )}
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "posts" ? (
        <div className="space-y-8">
          {posts.map((post) => (
            <div key={post.id} className="border-b border-gray-200 pb-8">
              <Link href={`/post/${post.id}`}>
                <h2 className="text-xl font-bold mb-2 hover:underline">
                  {post.title}
                </h2>
                <p className="text-gray-700 mb-3 line-clamp-2">
                  {post.excerpt}
                </p>
              </Link>
              <div className="flex items-center text-sm text-gray-500">
                <span>{post.date}</span>
                <span className="mx-1">·</span>
                <span>{post.readTime}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="prose">
          <h3 className="text-xl font-bold mb-4">
            About {profile.displayName}
          </h3>
          <p>
            This is where you can add more detailed information about yourself,
            your interests, projects, and background.
          </p>
          <h4 className="text-lg font-bold mt-6 mb-2">Contact</h4>
          <p>
            You can add contact information or links to your social media
            profiles here.
          </p>
        </div>
      )}
    </div>
  );
}
