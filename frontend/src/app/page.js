"use client";

import Link from "next/link";
import Image from "next/image";
import { useUser, SignInButton, SignUpButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Gradient styles
const gradientTextStyle = {
  background:
    "linear-gradient(to right, rgba(0, 0, 0, 1), rgba(169, 169, 169, 0.8))",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
  display: "inline-block",
};

export default function Home() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const [shouldRedirect, setShouldRedirect] = useState(true);

  useEffect(() => {
    if (isLoaded && isSignedIn && shouldRedirect) {
      router.push("/feed");
    }
    setShouldRedirect(false);
  }, [isLoaded, isSignedIn, router, shouldRedirect]);

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-[#d8c798] border-b border-black flex-auto">
        {/* Navigation */}
        <nav className="border-b border-black py-2.5">
          <div className="max-w-[1192px] w-full mx-auto px-6 flex justify-between items-center">
            <div>
              <Link href="/" className="font-serif text-xl font-bold">
                Medlog
              </Link>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/our-story" className="text-sm text-gray-800">
                Our stories
              </Link>
              <Link href="/membership" className="text-sm text-gray-800">
                Membership
              </Link>
              <Link href="/write" className="text-sm text-gray-800">
                Write
              </Link>

              {!isSignedIn ? (
                <>
                  <SignInButton mode="modal">
                    <button className="text-sm text-gray-800 cursor-pointer">
                      Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="bg-black text-white rounded-full px-4 py-2 text-sm font-medium cursor-pointer">
                      Get started
                    </button>
                  </SignUpButton>
                </>
              ) : (
                <Link
                  href="/feed"
                  className="bg-black text-white rounded-full px-4 py-2 text-sm font-medium"
                >
                  Go to feed
                </Link>
              )}
            </div>
          </div>
        </nav>

        {/* Hero section */}
        <div className="max-w-[1192px] w-full mx-auto px-6 py-16 md:py-24 relative">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="flex flex-col justify-center md:col-span-7">
              <h1
                className="font-normal text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-serif mb-8"
                style={gradientTextStyle}
              >
                Human stories & differentideas
              </h1>
              <p className="text-xl text-gray-800 mb-8">
                A place to read, write, and deepen your understanding
              </p>
              <div>
                <SignUpButton mode="modal">
                  <button className="bg-black hover:bg-gray-900 text-white px-8 py-2 rounded-full text-base font-medium cursor-pointer">
                    Start reading
                  </button>
                </SignUpButton>
              </div>
            </div>

            <div className="hidden md:block md:col-span-5 relative">
              <div className="absolute right-0 top-[-80px]">
                <Image
                  src="/bg.png"
                  alt="Medium illustration"
                  width={450}
                  height={400}
                  priority
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="py-4 bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-[1192px] w-full mx-auto px-6">
          <div className="flex flex-wrap justify-center text-xs text-gray-500 gap-4">
            <Link href="#" className="hover:text-gray-700">
              Help
            </Link>
            <Link href="#" className="hover:text-gray-700">
              Status
            </Link>
            <Link href="#" className="hover:text-gray-700">
              About
            </Link>
            <Link href="#" className="hover:text-gray-700">
              Careers
            </Link>
            <Link href="#" className="hover:text-gray-700">
              Press
            </Link>
            <Link href="#" className="hover:text-gray-700">
              Blog
            </Link>
            <Link href="#" className="hover:text-gray-700">
              Privacy
            </Link>
            <Link href="#" className="hover:text-gray-700">
              Rules
            </Link>
            <Link href="#" className="hover:text-gray-700">
              Terms
            </Link>
            <Link href="#" className="hover:text-gray-700">
              Text to speech
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
