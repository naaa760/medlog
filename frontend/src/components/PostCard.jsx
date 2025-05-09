import Link from "next/link";
import Image from "next/image";

export default function PostCard({ post }) {
  return (
    <div className="border-b border-gray-200 pb-7 mb-7">
      <div className="flex items-center mb-4">
        <Image
          src={post.author.avatar || "/placeholder-avatar.png"}
          alt={post.author.name}
          width={24}
          height={24}
          className="rounded-full mr-2"
        />
        <span className="text-sm font-medium">{post.author.name}</span>
      </div>

      <Link href={`/post/${post.id}`}>
        <h2 className="text-xl font-bold mb-2 hover:underline">{post.title}</h2>
      </Link>

      <p className="text-gray-700 mb-4 line-clamp-3">{post.excerpt}</p>

      <div className="flex justify-between items-center">
        <div className="flex items-center text-sm text-gray-500">
          <span>{post.readTime} min read</span>
          <span className="mx-2">·</span>
          <span>{post.date}</span>
        </div>

        <button className="text-gray-500 hover:text-gray-700">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M17.5 1.25a.5.5 0 0 1 1 0v2.5H21a.5.5 0 0 1 0 1h-2.5v2.5a.5.5 0 0 1-1 0v-2.5H15a.5.5 0 0 1 0-1h2.5v-2.5zm-11 4.5a1 1 0 0 1 1-1H11a.5.5 0 0 0 0-1H7.5a2 2 0 0 0-2 2v14a.5.5 0 0 0 .8.4l5.7-4.4 5.7 4.4a.5.5 0 0 0 .8-.4v-8.5a.5.5 0 0 0-1 0v7.48l-5.2-4a.5.5 0 0 0-.6 0l-5.2 4V5.75z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
