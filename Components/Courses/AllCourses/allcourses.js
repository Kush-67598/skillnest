"use client";
import { useRouter } from "next/navigation";
import { FaBookmark } from "react-icons/fa";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

export default function CourseCard({ course }) {
  const router = useRouter();
  console.log(course);
  const [bookmarks, setBookmarks] = useState([]);
  const fetch_Bookmarks = async (courseId) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/Bookmarks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("USER_TOKEN")}`,
        },
        body: JSON.stringify({ courseId }),
      });
      const res = await response.json();
      console.log(res);
      if (res.success) {
        setTimeout(() => {
          setBookmarks((prev) => {
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
              });
              return [...prev, { _id: courseId }];
            }
          });
        }, 0);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const getBookmarks = async () => {
      const getB = await fetch(`${process.env.NEXT_PUBLIC_API}/api/Bookmarks`, {
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
      <div
        key={course._id}
        onClick={() => router.push(`/Course/${course._id}`)}
        className="bg-gray-900 border border-gray-700 my-4 rounded-2xl shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow duration-200 relative"
      >
        <div className="flex justify-between">
          <h2 className="text-xl font-bold text-white mb-2">{course.title}</h2>

          <div
            className={`${
              bookmarks?.some((item) => item._id == course._id)
                ? "text-yellow-400"
                : "text-white"
            }`}
            onClick={(e) => {
              e.stopPropagation(); // prevent navigation click
              fetch_Bookmarks(course._id);
            }}
          >
            <FaBookmark size={25} />
          </div>
        </div>

        <h3 className="text-gray-300 font-medium mb-2">
          By:{" "}
          <span className="text-indigo-400">{course.creator.creatorName}</span>
        </h3>

        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="inline-block bg-gray-800 text-gray-300 text-xs font-semibold px-2 py-1 rounded-full">
            {course.category}
          </span>
          <span className="text-green-400 font-semibold">₹{course.price}</span>
        </div>

        <p className="text-gray-400 text-sm line-clamp-2">
          {course.description}
        </p>
      </div>
    </>
  );
}
