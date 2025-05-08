import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { auth } from "@clerk/nextjs/server";

// This would typically come from your database
const getPosts = () => {
  return [
    {
      id: "1",
      title: "Building a Medium Clone with Next.js",
      content: `
        <p>Creating a Medium clone with Next.js is a fantastic project to learn modern web development techniques. In this article, we'll explore how to build a full-featured publishing platform with authentication, dynamic routing, and a clean user interface.</p>
        
        <h2>Why Next.js?</h2>
        <p>Next.js offers the perfect balance of developer experience and performance. With features like server-side rendering, API routes, and file-based routing, it's an excellent choice for content-heavy applications.</p>
        
        <h2>Key Features</h2>
        <p>Our Medium clone includes:</p>
        <ul>
          <li>User authentication with Clerk</li>
          <li>Rich text editing</li>
          <li>Commenting system</li>
          <li>Social sharing</li>
          <li>Responsive design</li>
        </ul>
        
        <h2>The Tech Stack</h2>
        <p>For this project, we're using:</p>
        <ul>
          <li>Next.js for the frontend and API</li>
          <li>Tailwind CSS for styling</li>
          <li>Clerk for authentication</li>
          <li>A database for content storage</li>
        </ul>
        
        <p>Stay tuned for more articles in this series where we'll dive deeper into each component of our Medium clone!</p>
      `,
      excerpt:
        "Learn how to create a Medium clone using Next.js, Tailwind CSS, and Clerk for authentication.",
      coverImage:
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000",
      readTime: "5 min read",
      date: "Dec 15, 2023",
      author: {
        id: "author1",
        name: "John Doe",
        image:
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100",
        bio: "Full-stack developer passionate about React and Next.js",
      },
      tags: ["Next.js", "React", "Web Development"],
    },
    {
      id: "2",
      title: "The Future of Web Development",
      content: `
        <p>Web development is evolving rapidly, with new tools and technologies emerging every day. In this article, we'll explore the trends that are shaping the future of how we build for the web.</p>
        
        <h2>AI-Assisted Development</h2>
        <p>Tools like GitHub Copilot and ChatGPT are revolutionizing how developers write code, providing intelligent suggestions and automating repetitive tasks.</p>
        
        <h2>The Rise of Edge Computing</h2>
        <p>Edge computing is bringing computation closer to data sources, enabling faster processing and reducing latency for web applications.</p>
        
        <h2>Web Assembly</h2>
        <p>WebAssembly (WASM) is enabling high-performance code to run in browsers, opening new possibilities for complex applications on the web.</p>
        
        <p>As developers, staying ahead of these trends is crucial for building modern, efficient, and user-friendly applications.</p>
      `,
      excerpt:
        "Exploring the latest trends and technologies shaping the future of web development.",
      coverImage:
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1000",
      readTime: "7 min read",
      date: "Dec 10, 2023",
      author: {
        id: "author2",
        name: "Jane Smith",
        image:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100",
        bio: "Tech writer and software engineer specializing in emerging web technologies",
      },
      tags: ["Web Development", "Technology", "Future"],
    },
    // Add more posts as needed
  ];
};

export default function PostPage({ params }) {
  const { userId } = auth();
  const posts = getPosts();
  const post = posts.find((p) => p.id === params.id);

  if (!post) {
    notFound();
  }

  return (
    <article className="max-w-4xl mx-auto px-6 py-10">
      {/* Article header */}
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold font-serif mb-4">
          {post.title}
        </h1>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Image
              src={post.author.image}
              alt={post.author.name}
              width={40}
              height={40}
              className="rounded-full"
            />
            <div>
              <div className="font-medium">{post.author.name}</div>
              <div className="text-sm text-gray-500 flex items-center gap-1">
                <span>{post.date}</span>
                <span>·</span>
                <span>{post.readTime}</span>
              </div>
            </div>
          </div>

          {/* Share buttons */}
          <div className="ml-auto flex gap-2">
            <button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M20 5.34c-.67.41-1.4.7-2.18.87a3.45 3.45 0 0 0-5.02-.1 3.49 3.49 0 0 0-1.02 2.47c0 .28.03.54.07.8a9.91 9.91 0 0 1-7.17-3.66 3.9 3.9 0 0 0-.41 1.76c0 1.2.58 2.26 1.46 2.89a3.6 3.6 0 0 1-1.6-.4v.05c0 1.67 1.2 3.08 2.8 3.42-.3.05-.62.1-.94.1-.23 0-.45-.03-.67-.06a3.5 3.5 0 0 0 3.24 2.43 7.34 7.34 0 0 1-4.36 1.49c-.28 0-.56-.01-.84-.05a9.96 9.96 0 0 0 5.33 1.56c6.4 0 9.9-5.32 9.9-9.9v-.5c.69-.49 1.28-1.1 1.74-1.81-.63.3-1.3.48-2 .56A3.33 3.33 0 0 0 20 5.33"
                  fill="currentColor"
                ></path>
              </svg>
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M19.75 12.04c0-4.3-3.47-7.79-7.75-7.79a7.77 7.77 0 0 0-7.75 7.8c0 3.87 2.81 7.1 6.5 7.69v-5.49H8.7v-2.2h2.05V9.85c0-2.06 1.22-3.2 3.08-3.2.9 0 1.84.16 1.84.16v2.04h-1.03c-1.02 0-1.34.64-1.34 1.3v1.56h2.28l-.36 2.2H13.3v5.5c3.7-.6 6.46-3.82 6.46-7.7z"
                  fill="currentColor"
                ></path>
              </svg>
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M7.88 7.88v8.24h8.24v-8.24H7.88zm.84.84h6.56v6.56H8.72V8.72z"
                  fill="currentColor"
                ></path>
                <path
                  d="M8.72 8.72h6.56v6.56H8.72V8.72z"
                  fill="currentColor"
                ></path>
                <path
                  d="M17.2 3.6H6.8c-1.77 0-3.2 1.43-3.2 3.2v10.4c0 1.77 1.43 3.2 3.2 3.2h10.4c1.77 0 3.2-1.43 3.2-3.2V6.8c0-1.77-1.43-3.2-3.2-3.2zM6.8 4.8h10.4c1.1 0 2 .9 2 2v10.4c0 1.1-.9 2-2 2H6.8c-1.1 0-2-.9-2-2V6.8c0-1.1.9-2 2-2z"
                  fill="currentColor"
                ></path>
              </svg>
            </button>
          </div>
        </div>

        {post.coverImage && (
          <div className="mb-8 rounded-lg overflow-hidden">
            <Image
              src={post.coverImage}
              alt={post.title}
              width={1000}
              height={500}
              className="w-full object-cover"
            />
          </div>
        )}
      </header>

      {/* Article content */}
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Article footer */}
      <footer className="mt-12 pt-8 border-t">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-6">
          {post.tags.map((tag) => (
            <Link
              key={tag}
              href={`/tag/${encodeURIComponent(tag)}`}
              className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-sm text-gray-800"
            >
              {tag}
            </Link>
          ))}
        </div>

        {/* Author bio */}
        <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-lg">
          <Image
            src={post.author.image}
            alt={post.author.name}
            width={60}
            height={60}
            className="rounded-full"
          />
          <div>
            <Link
              href={`/profile/${post.author.id}`}
              className="font-bold hover:underline"
            >
              {post.author.name}
            </Link>
            <p className="text-gray-600 mt-1">{post.author.bio}</p>
            <button className="mt-3 px-4 py-1 border border-gray-800 text-gray-800 rounded-full text-sm font-medium hover:bg-gray-800 hover:text-white">
              Follow
            </button>
          </div>
        </div>

        {/* Interactions */}
        <div className="mt-8 flex justify-between items-center border-t border-b py-6">
          <div className="flex gap-4">
            <button className="flex items-center gap-1 text-gray-600 hover:text-black">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M11.36 18.63c3.1 0 5.6-2.5 5.6-5.6 0-3.08-2.5-5.6-5.6-5.6-3.08 0-5.6 2.52-5.6 5.6 0 3.1 2.52 5.6 5.6 5.6z"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="0.25"
                ></path>
                <path
                  d="M16.38 2.3a22.15 22.15 0 00-10.5 0c-.7.16-1.16.38-1.44.67-.29.29-.51.74-.67 1.44a22.2 22.2 0 000 10.5c.16.7.38 1.16.67 1.44.28.29.74.51 1.44.67a22.2 22.2 0 0010.5 0c.7-.16 1.16-.38 1.44-.67.29-.28.51-.74.67-1.44a22.14 22.14 0 000-10.5c-.16-.7-.38-1.16-.67-1.44-.28-.29-.74-.51-1.44-.67zM6.3 3.3c3.22-.64 6.48-.64 9.7 0 .58.12.84.28 1 .44.16.16.32.42.44 1 .64 3.22.64 6.48 0 9.7-.12.58-.28.84-.44 1-.16.16-.42.32-1 .44-3.22.64-6.48.64-9.7 0-.58-.12-.84-.28-1-.44-.16-.16-.32-.42-.44-1a20.98 20.98 0 010-9.7c.12-.58.28-.84.44-1 .16-.16.42-.32 1-.44z"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="0.25"
                ></path>
              </svg>
              <span>125</span>
            </button>
            <button className="flex items-center gap-1 text-gray-600 hover:text-black">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M18 16.8a7.14 7.14 0 0 0 2.24-5.32c0-4.12-3.53-7.48-8.05-7.48C7.67 4 4 7.36 4 11.48c0 4.13 3.67 7.48 8.2 7.48a8.9 8.9 0 0 0 2.38-.32c.23.2.48.39.75.56 1.06.69 2.2 1.04 3.4 1.04.22 0 .4-.11.48-.29a.5.5 0 0 0-.04-.52 6.4 6.4 0 0 1-1.16-2.65v.02zm-3.41 1.93c-.5.13-1.03.2-1.58.2-3.87 0-7.01-2.8-7.01-6.28 0-3.48 3.14-6.28 7.01-6.28 3.88 0 7.01 2.8 7.01 6.28 0 1.8-.75 3.43-2.01 4.58-.57.52-1.26 1-2.02 1.3 0 0-1.39.4-1.4.4z"
                  fill="currentColor"
                ></path>
              </svg>
              <span>24</span>
            </button>
          </div>

          <div>
            <button className="flex items-center gap-1 text-gray-600 hover:text-black">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M17.5 1.25a.5.5 0 0 1 1 0v2.5H21a.5.5 0 0 1 0 1h-2.5v2.5a.5.5 0 0 1-1 0v-2.5H15a.5.5 0 0 1 0-1h2.5v-2.5zm-11 4.5a1 1 0 0 1 1-1H11a.5.5 0 0 0 0-1H7.5a2 2 0 0 0-2 2v14a.5.5 0 0 0 .8.4l5.7-4.4 5.7 4.4a.5.5 0 0 0 .8-.4v-8.5a.5.5 0 0 0-1 0v7.48l-5.2-4a.5.5 0 0 0-.6 0l-5.2 4V5.75z"
                  fill="currentColor"
                ></path>
              </svg>
              <span>Save</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Comments section - placeholder for now */}
      <section className="mt-12">
        <h3 className="text-xl font-bold mb-6">Comments (24)</h3>

        {userId ? (
          <div className="mb-8">
            <textarea
              className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
              placeholder="Write a comment..."
              rows={3}
            ></textarea>
            <div className="mt-2 flex justify-end">
              <button className="bg-green-600 text-white px-4 py-2 rounded-full font-medium">
                Respond
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 bg-gray-50 rounded-lg mb-8">
            <p className="mb-4">Sign in to leave a comment</p>
            <Link
              href="/sign-in"
              className="px-4 py-2 bg-green-600 text-white rounded-full font-medium"
            >
              Sign in
            </Link>
          </div>
        )}

        {/* Sample comments */}
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border-b pb-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                <div>
                  <div className="font-medium">Comment User {i}</div>
                  <div className="text-xs text-gray-500">
                    Dec {10 + i}, 2023
                  </div>
                </div>
              </div>
              <p className="text-gray-800">
                This is a sample comment. Great article! I really enjoyed
                reading about{" "}
                {i === 1
                  ? "the future of web development"
                  : "building with Next.js"}
                .
              </p>
              <div className="mt-2 flex gap-4 text-sm text-gray-500">
                <button className="hover:text-black">Like</button>
                <button className="hover:text-black">Reply</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Related articles */}
      <section className="mt-16">
        <h3 className="text-xl font-bold mb-6">More from {post.author.name}</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts
            .filter((p) => p.id !== post.id && p.author.id === post.author.id)
            .slice(0, 2)
            .map((relatedPost) => (
              <div key={relatedPost.id} className="border-b pb-4">
                <Link href={`/post/${relatedPost.id}`}>
                  <h4 className="text-lg font-bold mb-2 hover:underline">
                    {relatedPost.title}
                  </h4>
                  <p className="text-gray-600 line-clamp-2 mb-3">
                    {relatedPost.excerpt}
                  </p>
                </Link>
                <div className="flex items-center text-sm text-gray-500">
                  <span>{relatedPost.date}</span>
                  <span className="mx-1">·</span>
                  <span>{relatedPost.readTime}</span>
                </div>
              </div>
            ))}
        </div>
      </section>
    </article>
  );
}
