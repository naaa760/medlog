"use client";

import { useParams } from "next/navigation";
import Link from "next/link";

export default function TagPage() {
  const { tag } = useParams();
  const decodedTag = decodeURIComponent(tag);

  // Sample posts for this tag - would come from your API
  const posts = [
    {
      id: "1",
      title: `${decodedTag}: A Complete Guide`,
      excerpt: `Learn everything you need to know about ${decodedTag} in this comprehensive guide.`,
      author: {
        name: "John Smith",
        image: "https://via.placeholder.com/40",
      },
      date: "Dec 15, 2023",
      readTime: "8 min read",
    },
    {
      id: "2",
      title: `How ${decodedTag} is Changing the Industry`,
      excerpt: `An exploration of the impact ${decodedTag} is having on modern technology and business.`,
      author: {
        name: "Sarah Johnson",
        image: "https://via.placeholder.com/40",
      },
      date: "Nov 28, 2023",
      readTime: "6 min read",
    },
    {
      id: "3",
      title: `Getting Started with ${decodedTag}`,
      excerpt: `A beginner-friendly introduction to ${decodedTag} with practical examples and tutorials.`,
      author: {
        name: "David Lee",
        image: "https://via.placeholder.com/40",
      },
      date: "Oct 12, 2023",
      readTime: "5 min read",
    },
  ];

  // Sample related tags - would come from your API
  const relatedTags = [
    `${decodedTag} Tutorial`,
    `Learn ${decodedTag}`,
    "Web Development",
    "Programming",
    "Technology",
  ];

  return (
    <div className="max-w-5xl mx-auto py-10 px-6">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">{decodedTag}</h1>
        <p className="text-gray-600 mb-6">
          Latest stories and resources about {decodedTag}
        </p>

        <div className="flex flex-wrap gap-2">
          {relatedTags.map((relatedTag) => (
            <Link
              key={relatedTag}
              href={`/tag/${encodeURIComponent(relatedTag)}`}
              className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-sm text-gray-800"
            >
              {relatedTag}
            </Link>
          ))}
        </div>
      </div>

      <div className="space-y-10">
        {posts.map((post) => (
          <article key={post.id} className="border-b border-gray-200 pb-8">
            <div className="flex items-center gap-2 mb-2">
              <img
                src={post.author.image}
                alt={post.author.name}
                className="w-6 h-6 rounded-full"
              />
              <span className="text-sm font-medium">{post.author.name}</span>
            </div>

            <Link href={`/post/${post.id}`}>
              <h2 className="text-xl font-bold mb-2 hover:underline">
                {post.title}
              </h2>
              <p className="text-gray-700 mb-3 line-clamp-2">{post.excerpt}</p>
            </Link>

            <div className="flex items-center text-sm text-gray-500">
              <span>{post.date}</span>
              <span className="mx-1">·</span>
              <span>{post.readTime}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
