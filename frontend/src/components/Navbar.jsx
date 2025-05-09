"use client";

import Link from "next/link";
import { useUser, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation";
import SearchBar from "./SearchBar";

export default function Navbar() {
  const { isSignedIn, isLoaded, user } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  // Check if we're on the homepage
  const isHomePage = pathname === "/";

  // Only show navigation items when auth state is loaded
  const handleHomeClick = (e) => {
    if (!isLoaded) {
      e.preventDefault();
      return;
    }

    if (!isSignedIn) {
      e.preventDefault();
      router.push("/sign-in?redirect=/feed");
    }
  };

  // Add this function to handle logo clicks
  const handleLogoClick = (e) => {
    if (isLoaded && isSignedIn) {
      e.preventDefault();
      router.push("/feed");
    }
  };

  return (
    <nav
      className={`py-2 px-4 md:px-8 border-b ${
        isHomePage ? "bg-[#ffead0] border-black" : "border-gray-200"
      }`}
    >
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Logo/Brand */}
        <div>
          <Link href="/" className="font-serif text-lg font-bold">
            Medium
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-4">
          {!isSignedIn ? (
            <>
              <Link
                href="/our-story"
                className="hidden md:inline-block text-sm hover:text-gray-900"
              >
                Our story
              </Link>
              <Link
                href="/membership"
                className="hidden md:inline-block text-sm hover:text-gray-900"
              >
                Membership
              </Link>
              <Link
                href="/write"
                className="hidden md:inline-block text-sm hover:text-gray-900"
              >
                Write
              </Link>
              <SignInButton mode="modal">
                <button className="text-sm hover:text-gray-900">Sign in</button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="bg-black text-white rounded-full px-3 py-1.5 text-sm hover:bg-gray-900">
                  Get started
                </button>
              </SignUpButton>
            </>
          ) : (
            <>
              <Link
                href="/feed"
                className="hidden md:inline-block text-sm hover:text-gray-900"
              >
                Home
              </Link>
              <div className="hidden md:block">
                <SearchBar />
              </div>
              <Link
                href="/write"
                className="hidden md:flex items-center gap-1 text-sm hover:text-gray-900"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-5 h-5"
                >
                  <path
                    d="M14 4a.5.5 0 0 0 0-1v1zm7 6a.5.5 0 0 0-1 0h1zm-7-7H4v1h10V3zM3 4v16h1V4H3zm1 17h16v-1H4v1zm17-1V10h-1v10h1zm-1 1a1 1 0 0 0 1-1h-1v1zM3 20a1 1 0 0 0 1 1v-1H3zM4 3a1 1 0 0 0-1 1h1V3z"
                    fill="currentColor"
                  ></path>
                  <path
                    d="M17.5 4.5l-8.46 8.46a.25.25 0 0 0-.06.1l-.82 2.47c-.07.2.12.38.31.31l2.47-.82a.25.25 0 0 0 .1-.06L19.5 6.5m-2-2l2.32-2.32c.1-.1.26-.1.36 0l1.64 1.64c.1.1.1.26 0 .36L19.5 6.5"
                    stroke="currentColor"
                  ></path>
                </svg>
                Write
              </Link>
              <Link
                href="/notifications"
                className="text-sm hover:text-gray-900"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-5 h-5"
                >
                  <path
                    d="M15 18.5a3 3 0 1 1-6 0"
                    stroke="currentColor"
                    strokeLinecap="round"
                  ></path>
                  <path
                    d="M5.5 10.53V9a6.5 6.5 0 0 1 13 0v1.53c0 1.42.56 2.78 1.57 3.79l.03.03c.26.26.4.6.4.97v2.93c0 .14-.11.25-.25.25H3.75a.25.25 0 0 1-.25-.25v-2.93c0-.37.14-.71.4-.97l.03-.03c1-1 1.57-2.37 1.57-3.79z"
                    stroke="currentColor"
                    strokeLinejoin="round"
                  ></path>
                </svg>
              </Link>
              <Link href="/bookmarks" className="text-sm hover:text-gray-900">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-5 h-5"
                >
                  <path
                    d="M17.5 1.25a.5.5 0 0 1 1 0v2.5H21a.5.5 0 0 1 0 1h-2.5v2.5a.5.5 0 0 1-1 0v-2.5H15a.5.5 0 0 1 0-1h2.5v-2.5zm-11 4.5a1 1 0 0 1 1-1H11a.5.5 0 0 0 0-1H7.5a2 2 0 0 0-2 2v14a.5.5 0 0 0 .8.4l5.7-4.4 5.7 4.4a.5.5 0 0 0 .8-.4v-8.5a.5.5 0 0 0-1 0v7.48l-5.2-4a.5.5 0 0 0-.6 0l-5.2 4V5.75z"
                    fill="currentColor"
                  />
                </svg>
              </Link>
              <UserButton
                afterSignOutUrl="/"
                afterSignInUrl="/feed"
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-8 h-8",
                  },
                }}
              />
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
