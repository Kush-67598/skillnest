"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function MyCoursesPage() {
  const [token, setToken] = useState(null);
  const [myCourses, setMyCourses] = useState([]);
  const [track, setTrack] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // ✅ Builds dynamic URL based on non-null params
  const finalUrl = (courseId, chapterId, subchapterId, lessonId) => {
    let url = `/Course/${courseId}`;
    if (chapterId) url += `/chapters/${chapterId}/subchapters`;
    else return url;

    if (subchapterId) url += `/${subchapterId}/lessons`;
    else return url;

    if (lessonId) url += `/${lessonId}`;
    else return url;

    return url;
  };

  useEffect(() => {
    const t = localStorage.getItem("USER_TOKEN");
    setToken(t);
  }, []);

  useEffect(() => {
    if (token) {
      Promise.all([FetchTracked(), fetchMyCourses()]).finally(() => {
        setLoading(false);
      });
    }
  }, [token]);

  const FetchTracked = async () => {
    try {
      const res = await fetch("/api/track-progress", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setTrack(data.getTracked);
        console.log(data);
      } else {
        console.warn("Tracking data not found");
      }
    } catch (err) {
      console.error("Error fetching tracked progress:", err);
    }
  };

  const fetchMyCourses = async () => {
    try {
      const res = await fetch("/api/enrolledCourse", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setMyCourses(data.courses);
      }
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8 bg-black min-h-screen rounded-lg">
      <h1 className="text-4xl font-extrabold mb-10 text-center text-white tracking-wide drop-shadow-sm">
        🎓 My Courses
      </h1>

      {loading ? (
        <p className="text-center text-gray-700 animate-pulse">
          Loading your courses...
        </p>
      ) : (
        <>
          {myCourses.length === 0 && (
            <div className="text-center text-gray-500 italic text-lg mt-12">
              No Enrolled Courses yet...
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {myCourses.map((course) => {
              const trackItem = track.find((t) => t.courseId === course._id);

              const continueUrl = trackItem
                ? finalUrl(
                    course._id,
                    trackItem.chapterId,
                    trackItem.subchapterId,
                    trackItem.lessonId
                  )
                : `/course/${course._id}`;

              return (
                <div
                  key={course._id}
                  className="border border-gray-200 rounded-2xl p-6 bg-white shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
                >
                  <h2 className="text-xl font-bold mb-3 text-gray-900 line-clamp-1">
                    {course.title}
                  </h2>
                  <p className="text-gray-600 text-sm mb-5 line-clamp-3">
                    {course.description}
                  </p>

                  {/* Progress bar */}
                  <div className="h-2 bg-gray-200 rounded-full mb-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-green-400 to-green-600 h-full transition-all duration-500"
                      style={{ width: "70%" }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mb-4">70% completed</p>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => router.push(continueUrl)}
                      className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg shadow-md transition"
                    >
                      ▶ Continue
                    </button>
                    <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg shadow-md transition">
                      ℹ Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
