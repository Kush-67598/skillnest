"use client";

import { usePathname, useRouter } from "next/navigation";
import { IoIosCheckmarkCircle } from "react-icons/io";
import React, { useEffect, useState } from "react";
import Loader from "@/Components/Loader/loader";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ChaptersPage({ chapters, courseId }) {
  const router = useRouter();
  const pathname = usePathname();

  // state
  const [course, setCourse] = useState(null);
  const [authorized, setAuthorized] = useState(false);
  const [completed, setCompleted] = useState([]);
  const [subchapterCounts, setSubchapterCounts] = useState({});
  const [loading, setLoading] = useState(true);

  // ✅ Fetch course details
  const fetchCourse = async () => {
    try {
      const token = localStorage.getItem("USER_TOKEN");
      if (!token) {
        toast.error("Please login to access this course");
        router.replace("/auth/login");
        return;
      }

      const resp = await fetch(`/api/Course/${courseId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || "Failed to fetch course");

      setCourse(data.reqCourse); // ✅ correct field
    } catch (err) {
      toast.error(err.message || "Failed to load course");
      router.replace("/Course");
    }
  };

  // ✅ Check access once course is loaded
  const checkAccess = async () => {
    if (!course) return;

    try {
      const token = localStorage.getItem("USER_TOKEN");
      if (!token) {
        toast.error("Please login to access this course");
        router.replace("/auth/login");
        return;
      }

      // free course → allow directly
      if (course.price === 0) {
        setAuthorized(true);
        return;
      }

      // paid course → check user
      const resp = await fetch("/api/User", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const res = await resp.json();

      if (res.premiumCourseID?.includes(courseId)) {
        setAuthorized(true);
      } else {
        toast.error("Unauthorized 🚫 You are not enrolled in this course", {
          autoClose: 1000,
          pauseOnHover: false,
          hideProgressBar: true,
        });
        router.replace("/Course");
      }
    } catch (err) {
      toast.error(err.message || "Failed to verify access");
      router.replace("/Course");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch course first
  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  // ✅ Run access check when course or path changes
  useEffect(() => {
    if (course) checkAccess();
  }, [pathname, course]);

  // ✅ Progress fetching
  const getCompleted = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("USER_TOKEN");
      const resp = await fetch(`/api/check-completed?courseId=${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await resp.json();
      setCompleted(data.progress || {});

      const counts = {};
      chapters.forEach((ch) => {
        let count = 0;
        ch.subChapters.forEach((sub) => {
          if (data.progress?.completedSubChapters?.includes(sub._id.toString()))
            count++;
        });
        counts[ch._id] = count;
      });
      setSubchapterCounts(counts);
    } catch (err) {
      toast.error(err.message || "Failed to load progress");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Mark completed
  const markChapterCompleted = async (chapterId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("USER_TOKEN");
      await fetch("/api/check-completed", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ courseId, chapterId }),
      });
      await getCompleted();
      toast.success("Chapter marked completed!", {
        pauseOnHover: false,
        autoClose: 1000,
        hideProgressBar: true,
      });
    } catch (err) {
      toast.error(err.message || "Failed to mark chapter completed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authorized) getCompleted();
  }, [authorized]);

  // ✅ loading or unauthorized
  if (loading || !course) return <Loader />;
  if (!authorized) return null;

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 mt-10">
      <h1 className="text-3xl sm:text-4xl font-bold text-center bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 text-transparent bg-clip-text mb-8 sm:mb-10">
        📚 Explore Chapters
      </h1>
      {chapters.length == 0 && <div>No Chapters to Show</div>}

      <div className="flex flex-col gap-4">
        {chapters.map((chapter) => (
          <div
            key={chapter._id}
            className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
          >
            <div className="flex-1 w-full">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4 mb-2">
                <h2 className="text-xl sm:text-2xl font-semibold text-white flex items-center gap-2">
                  📖 {chapter.title}
                </h2>
                <p className="text-white text-sm">
                  {subchapterCounts[chapter._id] || 0}/
                  {chapter.subChapters.length} subchapters completed
                </p>
              </div>

              <div className="w-full">
                <div className="text-white">
                  <div
                    className="h-4 w-0 rounded-2xl my-2 sm:my-3 bg-green-500 transition-all duration-500"
                    style={{
                      width: `${
                        chapter.subChapters.length > 0
                          ? (subchapterCounts[chapter._id] /
                              chapter.subChapters.length) *
                            100
                          : 100
                      }%`,
                    }}
                  ></div>

                  <p className="text-xs sm:text-sm mt-1">
                    {chapter.subChapters.length > 0 &&
                    subchapterCounts[chapter._id] !== undefined
                      ? Math.floor(
                          (subchapterCounts[chapter._id] /
                            chapter.subChapters.length) *
                            100
                        )
                      : subchapterCounts[chapter._id] === 0
                      ? 100
                      : 0}
                    % Completed
                  </p>
                </div>
              </div>

              <span className="inline-block mt-2 text-xs sm:text-sm bg-gray-700 text-gray-300 px-2 py-1 rounded-full">
                Order: {chapter.order}
              </span>
            </div>

            <div className="flex sm:flex-col items-center gap-2 sm:gap-4 mt-2 sm:mt-0">
              <button
                onClick={async () => {
                  setLoading(true);
                  try {
                    await fetch("/api/track-progress", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem(
                          "USER_TOKEN"
                        )}`,
                      },
                      body: JSON.stringify({
                        courseId,
                        chapterId: chapter._id,
                      }),
                    });
                    router.push(
                      `/Course/${courseId}/chapters/${chapter._id}/subchapters`
                    );
                  } catch (err) {
                    toast.error(err.message || "Failed to track progress");
                    setLoading(false);
                  }
                }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium w-full sm:w-auto transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Open
              </button>

              <button
                className={`text-3xl sm:text-4xl ${
                  completed?.completedChapters?.includes(chapter._id.toString())
                    ? "text-green-500"
                    : "text-white"
                }`}
                onClick={() => markChapterCompleted(chapter._id)}
              >
                <IoIosCheckmarkCircle />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
