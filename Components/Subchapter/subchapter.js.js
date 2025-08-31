"use client";
import { useRouter } from "next/navigation";
import { IoIosCheckmarkCircle } from "react-icons/io";
import React, { useEffect, useState } from "react";
import Loader from "@/Components/Loader/loader";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SubchapterPage({ subChapters, courseId, chapterId }) {
  const router = useRouter();
  const [completed, setCompleted] = useState([]);
  const [lessonsCount, setLessonsCount] = useState({}); // subchapterId => completed lessons
  const [loading, setLoading] = useState(false);

  const getCompleted = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("USER_TOKEN");
      const resp = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/check-completed?courseId=${courseId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await resp.json();
      setCompleted(data.progress || {});

      const counts = {};
      subChapters.forEach((sub) => {
        let count = 0;
        sub.lessons.forEach((lesson) => {
          if (data.progress?.completedLessons?.includes(lesson._id.toString()))
            count++;
        });
        counts[sub._id] = count;
      });
      setLessonsCount(counts);
      // toast.success({pauseOnHover:false,autoClose:1000},"Progress loaded successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to load progress");
    } finally {
      setLoading(false);
    }
  };

  const markSubchapterCompleted = async (subchapterId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("USER_TOKEN");
      await fetch(`${process.env.NEXT_PUBLIC_API}/api/check-completed`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ courseId, chapterId, subchapterId }),
      });
      await getCompleted();
      toast.success("Subchapter marked completed!", {
        pauseOnHover: false,
        autoClose: 1000,
      });
    } catch (err) {
      toast.error(err.message || "Failed to mark subchapter completed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCompleted();
  }, []);

  if (loading) return <Loader />; // Show loader while API requests are in progress

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 mt-10">
      <h1 className="text-3xl sm:text-4xl font-bold text-center bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 text-transparent bg-clip-text mb-8 sm:mb-10">
        🧩 Explore Subchapters
      </h1>

      <button
        onClick={() => router.push(`/Course/${courseId}/chapters`)}
        className="text-white cursor-pointer mb-4"
      >
        BACK
      </button>

      <div className="flex flex-col gap-4">
        {subChapters.map((sub) => (
          <div
            key={sub._id}
            className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
          >
            <div className="flex-1 w-full">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4 mb-2">
                <h2 className="text-xl sm:text-2xl font-semibold text-white flex items-center gap-2">
                  🧾 {sub.title}
                </h2>
                <p className="text-white text-sm">
                  {lessonsCount[sub._id] || 0}/{sub.lessons.length} lessons
                  completed
                </p>
              </div>

              <div className="w-full">
                <div
                  className="h-4 rounded-2xl my-2 sm:my-3 bg-green-500 transition-all duration-500"
                  style={{
                    width: `${
                      sub.lessons.length > 0
                        ? (lessonsCount[sub._id] / sub.lessons.length) * 100
                        : 100
                    }%`,
                  }}
                ></div>

                <p className="text-xs sm:text-sm mt-1 text-white">
                  {sub.lessons.length > 0 && lessonsCount[sub._id] != undefined
                    ? Math.floor(
                        (lessonsCount[sub._id] / sub.lessons.length) * 100
                      )
                    : lessonsCount[sub._id] === 0
                    ? 100
                    : 0}
                  % Completed
                </p>
              </div>
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
                      body: JSON.stringify({ courseId, subchapterId: sub._id }),
                    });
                    // toast.success({pauseOnHover:false,autoClose:1000},"Tracking updated!");
                    router.push(
                      `/Course/${courseId}/chapters/${chapterId}/subchapters/${sub._id}/lessons`
                    );
                  } catch (err) {
                    toast.error(err.message || "Failed to track progress");
                    setLoading(false)
                  } 
                }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium w-full sm:w-auto transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Open
              </button>

              <button
                className={`text-3xl sm:text-4xl ${
                  completed?.completedSubChapters?.includes(sub._id.toString())
                    ? "text-green-500"
                    : "text-white"
                }`}
                onClick={() => markSubchapterCompleted(sub._id)}
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
