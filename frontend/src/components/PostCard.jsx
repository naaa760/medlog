import Link from "next/link";

export default function PostCard({ post }) {
  return (
    <article className="border-b border-gray-200 pb-8">
      <div className="flex items-center gap-2 mb-2">
        <img
          src={post.author.image}
          alt={post.author.name}
          className="w-6 h-6 rounded-full"
        />
        <span className="text-sm font-medium">{post.author.name}</span>
      </div>

      <Link href={`/post/${post.id}`}>
        <h2 className="text-xl font-bold mb-2 hover:underline">{post.title}</h2>
        <p className="text-gray-700 mb-3 line-clamp-2">{post.excerpt}</p>
      </Link>

      <div className="flex justify-between items-center">
        <div className="flex items-center text-sm text-gray-500">
          <span>{post.date}</span>
          <span className="mx-1">·</span>
          <span>{post.readTime}</span>
        </div>

        <div className="flex gap-4">
          <button className="text-gray-500 hover:text-gray-700">
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
          </button>

          <button className="text-gray-500 hover:text-gray-700">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M17.5 1.25a.5.5 0 0 1 1 0v2.5H21a.5.5 0 0 1 0 1h-2.5v2.5a.5.5 0 0 1-1 0v-2.5H15a.5.5 0 0 1 0-1h2.5v-2.5zm-11 4.5a1 1 0 0 1 1-1H11a.5.5 0 0 0 0-1H7.5a2 2 0 0 0-2 2v14a.5.5 0 0 0 .8.4l5.7-4.4 5.7 4.4a.5.5 0 0 0 .8-.4v-8.5a.5.5 0 0 0-1 0v7.48l-5.2-4a.5.5 0 0 0-.6 0l-5.2 4V5.75z"
                fill="currentColor"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
}
