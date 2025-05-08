"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const [shouldRedirect, setShouldRedirect] = useState(true);

  useEffect(() => {
    // Check if this is a direct navigation to the home page
    // or a navigation from another page within the app
    const fromApp = document.referrer.includes(window.location.host);

    // Only redirect if it's a first visit/direct navigation
    // and not when user explicitly clicks to view the homepage
    if (isLoaded && isSignedIn && !fromApp && shouldRedirect) {
      router.push("/feed");
    }

    // After the first check, disable future redirects
    // This allows users to explicitly navigate to the home page
    setShouldRedirect(false);
  }, [isLoaded, isSignedIn, router, shouldRedirect]);

  // If we're still checking auth status, show a minimal loading state
  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="relative bg-yellow-400">
      {/* Hero Section */}
      <section className="border-b border-black">
        <div className="max-w-7xl mx-auto py-24 px-6 md:px-10">
          <div className="flex flex-col gap-8 max-w-2xl">
            <h1 className="text-7xl md:text-8xl font-serif font-bold">
              Stay curious.
            </h1>
            <p className="text-2xl text-gray-800 font-medium">
              Discover stories, thinking, and expertise from writers on any
              topic.
            </p>
            <div>
              <Link
                href="/sign-up"
                className="bg-black text-white px-12 py-3 rounded-full text-xl font-medium inline-block"
              >
                Start reading
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="max-w-7xl mx-auto py-10 px-6 md:px-10">
        <div className="flex items-center gap-3 mb-6">
          <svg
            width="28"
            height="29"
            viewBox="0 0 28 29"
            fill="none"
            className="w-6 h-6"
          >
            <path fill="#fff" d="M0 .8h28v28H0z"></path>
            <g clipPath="url(#trending_svg__clip0_1049_11)">
              <path fill="#fff" d="M4 4.8h20v20H4z"></path>
              <circle cx="14" cy="14.8" r="9.5" stroke="#000"></circle>
              <path
                d="M5.46 18.36l4.47-4.48M9.97 13.87l3.67 3.66M13.67 17.53l5.1-5.09M16.62 11.6h3M19.62 11.6v3"
                stroke="#000"
                strokeWidth="1.5"
              ></path>
            </g>
            <defs>
              <clipPath id="trending_svg__clip0_1049_11">
                <path
                  fill="#fff"
                  transform="translate(4 4.8)"
                  d="M0 0h20v20H0z"
                ></path>
              </clipPath>
            </defs>
          </svg>
          <span className="font-medium text-sm">Trending on Medium</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Placeholder for trending articles - we'll replace with real data later */}
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="flex gap-3">
              <div className="text-3xl font-bold text-gray-200">0{item}</div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 rounded-full bg-gray-200"></div>
                  <span className="text-sm font-medium">Author Name</span>
                </div>
                <h3 className="font-bold text-base mb-2 line-clamp-2">
                  This is a sample trending article title that might be quite
                  long
                </h3>
                <div className="flex items-center text-sm text-gray-500">
                  <span>Dec 15</span>
                  <span className="mx-1">·</span>
                  <span>5 min read</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
