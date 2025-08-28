"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CommentsPage from "@/Components/Comments";

export default function SingleCourseCard({ course }) {
  const Count_chapter = course.chapters.length;
  let countSubchapters = 0;
  let countLessons = 0;

  for (let i = 0; i < course.chapters.length; i++) {
    const chapter = course.chapters[i];
    countSubchapters += chapter.subChapters.length;
    for (let j = 0; j < chapter.subChapters.length; j++) {
      const sub_ch = chapter.subChapters[j];
      countLessons += sub_ch.lessons.length;
    }
  }

  const router = useRouter();
  const [token, setToken] = useState(null);

  useEffect(() => {
    const t = localStorage.getItem("USER_TOKEN");
    setToken(t);
  }, []);

  const handleEnroll = async () => {
    if (!token) {
      alert("Please login to enroll in the course.");
      return;
    }

    if (course.price && course.price !== 0) {
      router.push(`/Course/${course._id}/Orders`);
    } else {
      try {
        const enrolledcourse = await fetch(
          `${process.env.NEXT_PUBLIC_API}/api/enrolledCourse`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ courseId: course._id }),
          }
        );
        const res = await enrolledcourse.json();
        if (!enrolledcourse.ok)
          throw new Error(res.message || "Failed to enroll");
        router.push(`/Course/${course._id}/chapters`);
      } catch (err) {
        alert(err.message);
      }
    }
  };

  return (
    <div className="w-full mx-auto p-10 border border-gray-700 rounded-3xl shadow-xl hover:shadow-2xl transition-shadow duration-300 mt-10 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800">
      {/* Course Title */}
      <h1 className="text-5xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-500 to-blue-500 drop-shadow-lg">
        {course.title}
      </h1>

      {/* Category */}
      <p className="text-sm text-gray-400 mb-6 uppercase tracking-[0.15em]">
        Category:{" "}
        <span className="text-indigo-400 font-semibold">{course.category}</span>
      </p>

      {/* Description */}
      <p className="text-gray-300 mb-8 leading-relaxed text-lg">
        {course.description}
      </p>

      {/* Price */}
      <div className="mb-8 flex items-center gap-2">
        <span className="text-gray-400 text-base">Price:</span>
        <span className="text-green-400 font-bold text-2xl">
          ₹{course.price}
        </span>
      </div>

      {/* Chapters / Hierarchical Data */}
      {course.chapters && course.chapters.length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
            📘 Chapters
          </h2>
          <ul className="space-y-3">
            {course.chapters.map((chapter, idx) => (
              <li
                key={chapter._id}
                className="p-4 bg-gray-800/70 rounded-xl border border-gray-700 hover:bg-gray-700/80 transition flex items-center justify-between shadow-md"
              >
                <span className="text-gray-200 font-medium text-lg">
                  {idx + 1}. {chapter.title}
                </span>
                <span className="text-indigo-400 text-sm">
                  {chapter.lessons?.length || 0} lessons
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-6 mt-6">
        <button
          onClick={() => router.push("/Course")}
          className="flex-1 bg-gray-800 text-gray-300 px-6 py-3 rounded-xl hover:bg-gray-700 transition font-semibold shadow-md hover:shadow-lg"
        >
          ⬅ Back
        </button>

        <button
          onClick={handleEnroll}
          className="flex-1 bg-gradient-to-r from-green-500 via-green-600 to-green-700 text-white px-6 py-3 rounded-xl hover:brightness-110 transition font-semibold shadow-md hover:shadow-lg"
        >
          🚀 Enroll Now
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mt-10">
        <div className="h-4 w-full bg-gray-700 rounded-full overflow-hidden shadow-inner">
          <div className="h-full w-2/3 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 rounded-full animate-pulse"></div>
        </div>
        <p className="mt-2 text-sm text-gray-400">Course Progress: 67%</p>
      </div>

      {/* Comments Section */}
      <div className="mt-12 border-t border-gray-700 pt-8">
        <CommentsPage course={course} />
      </div>
    </div>
  );
}
