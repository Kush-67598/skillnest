"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function BookmarkPage() {
  const router = useRouter();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/Bookmarks`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("USER_TOKEN")}`,
          },
        });

        const data = await res.json();
        if (data.success) {
          setBookmarks(data.bookmarks);
        } else {
          toast.error(data.error || "Failed to fetch bookmarks");
        }
      } catch (err) {
        console.error(err);
        toast.error("Something went wrong while fetching bookmarks");
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, []);

  if (loading) {
    return <div className="text-center py-10 text-gray-400">Loading...</div>;
  }

  if (!bookmarks.length) {
    return <div className="text-center py-10 text-gray-400">No bookmarks found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold text-white mb-4">My Bookmarks</h1>
      {bookmarks.map((course) => (
        <div
          key={course._id}
          onClick={() => router.push(`/Course/${course._id}`)}
          className="bg-gray-900 border border-gray-700 rounded-2xl shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow duration-200"
        >
          <h2 className="text-xl font-bold text-white mb-2">{course.title}</h2>
          <h3 className="text-gray-300 font-medium mb-2">
            By: <span className="text-indigo-400">{course.creator.creatorName}</span>
          </h3>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="inline-block bg-gray-800 text-gray-300 text-xs font-semibold px-2 py-1 rounded-full">
              {course.category}
            </span>
            <span className="text-green-400 font-semibold">₹{course.price}</span>
          </div>
          <p className="text-gray-400 text-sm line-clamp-2">{course.description}</p>
        </div>
      ))}
    </div>
  );
}
