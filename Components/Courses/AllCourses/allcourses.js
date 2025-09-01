"use client";
import { useRouter } from "next/navigation";
import { FaBookmark } from "react-icons/fa";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import Loader from "@/Components/Loader/loader";

export default function CourseCard({ course }) {
  const router = useRouter();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetch_Bookmarks = async (courseId) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/Bookmarks`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("USER_TOKEN")}`,
          },
          body: JSON.stringify({ courseId }),
        }
      );
      setLoading(false);
      const res = await response.json();
      if (res.success) {
        setTimeout(() => {
          setBookmarks((prev) => {
            if (!prev) prev = []; // fallback if null
            if (prev.some((item) => item._id === courseId)) {
              toast.info("Bookmark Removed", {
                autoClose: 1000,
                toastId: `bm-${courseId}`,
              });
              return prev.filter((item) => item._id !== courseId);
            } else {
              toast.success("Bookmark Added", {
                autoClose: 1000,
                toastId: `bm-${courseId}`,
                hideProgressBar: true,
              });
              return [...prev, { _id: courseId }];
            }
          });
        }, 0);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getBookmarks = async () => {
      const getB = await fetch(`/api/Bookmarks`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("USER_TOKEN")}`,
        },
      });
      const res = await getB.json();
      setBookmarks(res.bookmarks);
    };
    getBookmarks();
  }, []);

  if (!course || Object.keys(course).length === 0) {
    return (
      <div className="text-center text-gray-400 py-8">No Courses Found</div>
    );
  }

  return (
    <>
      {loading && <Loader />}
      <div
        key={course._id}
        onClick={() => {
          setLoading(true);
          router.push(`/Course/${course._id}`);
        }}
        className="w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border border-gray-700 my-4 rounded-3xl shadow-xl cursor-pointer hover:shadow-2xl transition-shadow duration-300 relative overflow-hidden"
      >
        {/* Bookmark Icon */}
        <div
          className={`absolute top-4 right-4 z-10 p-2 rounded-full cursor-pointer ${
            bookmarks?.some((item) => item._id == course._id)
              ? "text-yellow-400 bg-gray-800/60"
              : "text-white bg-gray-800/30"
          } hover:bg-gray-700/50 transition`}
          onClick={(e) => {
            e.stopPropagation();
            fetch_Bookmarks(course._id);
          }}
        >
          <FaBookmark size={24} />
        </div>

        {/* Card Content */}
        <div className="p-6 flex flex-col gap-3">
          {/* Title */}
          <h2 className="text-2xl lg:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-500 to-blue-500 drop-shadow-lg">
            {course.title}
          </h2>

          {/* Creator */}
          <h3 className="text-gray-300 font-medium">
            By:{" "}
            <span className="text-indigo-400 font-semibold">
              {course.creator.creatorName}
            </span>
          </h3>

          {/* Category & Price */}
          <div className="flex flex-wrap items-center gap-3 mt-2">
            <span className="inline-block bg-gray-800 text-gray-300 text-xs font-semibold px-3 py-1 rounded-full">
              {course.category}
            </span>
            <span className="text-green-400 font-bold text-lg">
              ₹{course.price}
            </span>
          </div>

          {/* Description */}
          <p className="text-gray-400 text-sm lg:text-base line-clamp-3 mt-2">
            {course.description}
          </p>
        </div>
      </div>
    </>
  );
}
