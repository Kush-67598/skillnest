export default function ThankYouPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4 text-center">
      <div className="bg-white shadow rounded-2xl p-8 max-w-md space-y-4">
        <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-semibold">Thank you for your purchase!</h1>
        <p className="text-gray-600">
          You’re now enrolled in <span className="font-medium">React for Beginners</span>.
        </p>
        <a
          href="/my-courses"
          className="inline-block bg-blue-600 text-white py-2 px-4 rounded-xl hover:bg-blue-700 transition"
        >
          Go to My Courses
        </a>
      </div>
    </div>
  );
}
