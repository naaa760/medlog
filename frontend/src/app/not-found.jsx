import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6">
      <h1 className="text-4xl font-bold mb-4">Page not found</h1>
      <p className="text-gray-600 mb-8 text-center">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-black text-white rounded-full font-medium"
      >
        Back to home
      </Link>
    </div>
  );
}
