"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function WritePage() {
  const { isSignedIn, user } = useUser();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isSignedIn) {
    router.push("/sign-in");
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content) {
      alert("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);

    // Here you would submit to your API
    // const response = await fetch('/api/posts', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ title, content }),
    // });

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    alert("Post created successfully!");
    router.push("/feed");
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full text-4xl font-bold outline-none placeholder-gray-300"
            autoFocus
          />
        </div>

        <div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Tell your story..."
            className="w-full min-h-[60vh] text-xl outline-none resize-none placeholder-gray-300"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-green-600 text-white px-5 py-2 rounded-full font-medium disabled:opacity-70"
          >
            {isSubmitting ? "Publishing..." : "Publish"}
          </button>
        </div>
      </form>
    </div>
  );
}
