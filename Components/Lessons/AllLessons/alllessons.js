"use client";
import { useRouter } from "next/navigation";
import { IoIosCheckmarkCircle } from "react-icons/io";
import React, { useEffect, useState } from "react";

export default function AllLessonsPage({
  lessons,
  courseId,
  chapterId,
  subchapterId,
}) {
  const router = useRouter();
  const [completed, setCompleted] = useState([]);

  const getCompleted = async () => {
    const token = localStorage.getItem("USER_TOKEN");
    const resp = await fetch(`/api/check-completed?courseId=${courseId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await resp.json();
    setCompleted(data.progress || {});
  };

  useEffect(() => {
    getCompleted();
  }, [courseId]);

  const markLessonCompleted = async (lessonId) => {
    const token = localStorage.getItem("USER_TOKEN");

    const resp = await fetch(`${process.env.NEXT_PUBLIC_API}/api/check-completed`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ courseId, subchapterId, lessonId }),
    });
    const data = await resp.json();
    if (data.success) await getCompleted();

    // Check if all lessons done → mark subchapter completed
    const allDone = lessons.every((lesson) =>
      data.progress.completedLessons.includes(lesson._id.toString())
    );
    if (allDone) {
      await fetch(`${process.env.NEXT_PUBLIC_API}/api/check-completed`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ courseId, chapterId, subchapterId }),
      });
      await getCompleted();
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 mt-10">
      <h1 className="text-3xl sm:text-4xl font-bold text-center bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 text-transparent bg-clip-text mb-8 sm:mb-10">
        📘 Explore Lessons
      </h1>

      <button
        onClick={() =>
          router.push(`/Course/${courseId}/chapters/${chapterId}/subchapters`)
        }
        className="text-white cursor-pointer mb-6"
      >
        BACK
      </button>

      <div className="flex flex-col gap-4">
        {lessons.map((lesson) => (
          <div
            key={lesson._id}
            className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
          >
            <div className="flex-1 w-full">
              <h2 className="text-xl sm:text-2xl font-semibold text-white">
                {lesson.title}
              </h2>
              <span className="inline-block mt-2 text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full">
                Order: {lesson.order}
              </span>
            </div>

            <div className="flex sm:flex-col items-center gap-2 sm:gap-4 mt-2 sm:mt-0">
              {/* Open/Start button */}
              <button
                onClick={async () => {
                  await fetch("/api/track-progress", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${localStorage.getItem(
                        "USER_TOKEN"
                      )}`,
                    },

                    body: JSON.stringify({ courseId, lessonId: lesson._id }),
                  });
                  router.push(
                    `/Course/${courseId}/chapters/${chapterId}/subchapters/${subchapterId}/lessons/${lesson._id}`
                  );
                }}
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 text-white px-4 sm:px-5 py-2 rounded-lg text-sm sm:text-base font-medium w-full sm:w-auto transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Open
              </button>

              {/* Tick/Complete button */}
              <button
                className={`text-3xl sm:text-4xl ${
                  completed?.completedLessons?.includes(lesson._id.toString())
                    ? "text-green-500"
                    : "text-white"
                }`}
                onClick={() => markLessonCompleted(lesson._id)}
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
