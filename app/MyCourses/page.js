"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function MyCoursesPage() {
  const [token, setToken] = useState(null);
  const [myCourses, setMyCourses] = useState([]);
  const [track, setTrack] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
      Promise.all([FetchTracked(), fetchMyCourses()]).finally(() =>
        setLoading(false)
      );
    }
  }, [token]);

  const FetchTracked = async () => {
    try {
      const res = await fetch("/api/track-progress", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setTrack(data.getTracked);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMyCourses = async () => {
    try {
      const res = await fetch("/api/enrolledCourse", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setMyCourses(data.courses);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-800 py-12 px-4">
      <h1 className="text-5xl font-extrabold text-center text-white mb-12 drop-shadow-lg">
        🎓 My Courses
      </h1>

      {loading ? (
        <p className="text-center text-white animate-pulse">
          Loading your courses...
        </p>
      ) : (
        <>
          {myCourses.length === 0 && (
            <div className="text-center text-gray-400 italic text-lg mt-12">
              No Enrolled Courses yet...
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {myCourses.map((course) => {
              const trackItem = track.find((t) => t.courseId === course._id);
              const progress = trackItem?.progress || 0;
              const continueUrl = trackItem
                ? finalUrl(
                    course._id,
                    trackItem.chapterId,
                    trackItem.subchapterId,
                    trackItem.lessonId
                  )
                : `/course/${course._id}`;

              return (
                <motion.div
                  key={course._id}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 120 }}
                  className="bg-gradient-to-br from-gray-800 via-gray-900 to-black border border-gray-700 rounded-3xl shadow-xl p-6 flex flex-col justify-between"
                >
                  <div>
                    <h2 className="text-xl font-bold text-white line-clamp-2 mb-2">
                      {course.title}
                    </h2>
                    <p className="text-gray-300 text-sm line-clamp-3 mb-4">
                      {course.description}
                    </p>

                    {/* Progress */}
                    <div className="h-3 bg-gray-700 rounded-full overflow-hidden mb-2">
                      <div
                        className="h-full bg-gradient-to-r from-green-400 via-green-500 to-green-600 transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-400 mb-4">
                      {progress}% completed
                    </p>
                  </div>

                  <button
                    onClick={() => router.push(continueUrl)}
                    className="mt-auto w-full py-2 bg-gradient-to-r from-purple-900 via-slate-500 to-purple-300 text-white font-semibold rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
                  >
                    ▶ Continue
                  </button>
                </motion.div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
