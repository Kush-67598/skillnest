"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
  let progress;

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
      // Paid course → go to order/payment page
      router.push(`/Course/${course._id}/Orders`);
    } else {
      try {
        const enrolledcourse = await fetch(`${process.env.NEXT_PUBLIC_API}/api/enrolledCourse`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ courseId: course._id }),
        });
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
    <div className="max-w-3xl mx-auto p-8 border border-gray-700 rounded-3xl shadow-xl hover:shadow-2xl transition-shadow duration-300 mt-10 bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Course Title */}
      <h1 className="text-4xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-500 to-blue-500">
        {course.title}
      </h1>

      {/* Category */}
      <p className="text-sm text-gray-400 mb-4 uppercase tracking-wider">
        Category: <span className="text-indigo-400">{course.category}</span>
      </p>

      {/* Description */}
      <p className="text-gray-300 mb-6">{course.description}</p>

      {/* Price */}
      <div className="mb-6">
        <span className="text-gray-300 text-sm">Price:</span>{" "}
        <span className="text-green-400 font-bold text-lg">
          ₹{course.price}
        </span>
      </div>

      {/* Chapters / Hierarchical Data */}
      {course.chapters && course.chapters.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white mb-2">Chapters</h2>
          <ul className="space-y-2">
            {course.chapters.map((chapter, idx) => (
              <li
                key={chapter._id}
                className="p-3 bg-gray-800 rounded-xl border border-gray-700 hover:bg-gray-700 transition flex items-center justify-between"
              >
                <span className="text-gray-200 font-medium">
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
      <div className="flex gap-4 mt-4">
        <button
          onClick={() => router.push("/Course")}
          className="flex-1 bg-gray-700 text-gray-200 px-5 py-3 rounded-xl hover:bg-gray-600 transition font-semibold"
        >
          Back
        </button>

        <button
          onClick={handleEnroll}
          className="flex-1 bg-gradient-to-r from-green-500 via-green-600 to-green-700 text-white px-5 py-3 rounded-xl hover:brightness-110 transition font-semibold"
        >
          Enroll Now
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mt-8 h-3 w-full bg-gray-700 rounded-full overflow-hidden">
        <div className="h-full w-2/3 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 rounded-full"></div>
      </div>
    </div>
  );
}
