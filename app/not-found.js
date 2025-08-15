import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
        <h1 className="text-7xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-gradient-x">
          404
        </h1>
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Page Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link href="/">
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white w-full md:w-auto">
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
