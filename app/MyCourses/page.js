"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function MyCoursesPage() {
  const [token, setToken] = useState(null);
  const [myCourses, setMyCourses] = useState([]);
  const [track, setTrack] = useState([]);
  const [loading, setLoading] = useState(false);
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
    if (!t) {
      router.push("/login");
    } else {
      setToken(t);
    }
  }, [router]);

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [trackedRes, coursesRes] = await Promise.all([
          fetch("/api/track-progress", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/enrolledCourse", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const trackedData = await trackedRes.json();
        const coursesData = await coursesRes.json();

        if (trackedData.success) setTrack(trackedData.getTracked);
        if (coursesData.success) setMyCourses(coursesData.courses);
      } catch (err) {
        console.error("Failed to fetch courses or progress:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-800 py-12 px-4">
      <h1 className="text-5xl font-extrabold text-center text-white mb-12 drop-shadow-lg">
        🎓 My Courses
      </h1>

      {loading ? (
        <p className="text-center text-white animate-pulse">
          Loading your course...
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
                    <h2 className="text-xl py-2 font-bold text-white line-clamp-2 mb-2">
                      {course.title}
                    </h2>
                    <p className="text-gray-300 py-2 text-sm line-clamp-3 mb-4">
                      {course.description}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setLoading(true);
                      router.push(continueUrl);
                    }}
                    className="w-full py-3 my-4 bg-gradient-to-r from-purple-900 via-slate-500 to-purple-300 text-white font-semibold rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
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
