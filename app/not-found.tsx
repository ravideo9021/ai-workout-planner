import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
      <div className="text-blue-500 text-6xl mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            clipRule="evenodd" />
        </svg>
      </div>
      <h2 className="text-3xl font-bold mb-4 text-center">Page Not Found</h2>
      <p className="mb-6 text-gray-400 text-center max-w-md">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
      >
        Return Home
      </Link>
    </div>
  );
} 