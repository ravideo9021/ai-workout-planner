'use client'; // Error components must be Client Components

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
      <div className="text-red-500 text-6xl mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      </div>
      <h2 className="text-3xl font-bold mb-4 text-center">Something went wrong!</h2>
      <p className="mb-6 text-gray-400 text-center max-w-md">{error.message || 'An unexpected error occurred while loading this page.'}</p>
      <button
        onClick={reset}
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
      >
        Try again
      </button>
    </div>
  );
} 