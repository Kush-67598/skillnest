"use client";
import { useRouter } from "next/navigation";
import { IoIosCheckmarkCircle } from "react-icons/io";
import React, { useEffect, useState } from "react";

export default function ChaptersPage({ chapters, courseId }) {
  const router = useRouter();
  const [completed, setCompleted] = useState([]);
  const [subchapterCounts, setSubchapterCounts] = useState({}); // chapterId => completed subchapters

  const getCompleted = async () => {
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
  };

  const markChapterCompleted = async (chapterId) => {
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
  };

  useEffect(() => {
    getCompleted();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 mt-10">
      <h1 className="text-3xl sm:text-4xl font-bold text-center bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 text-transparent bg-clip-text mb-8 sm:mb-10">
        📚 Explore Chapters
      </h1>

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
                    subchapterCounts[chapter._id] != undefined
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
                  await fetch("/api/track-progress", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${localStorage.getItem(
                        "USER_TOKEN"
                      )}`,
                    },

                    body: JSON.stringify({ courseId, chapterId: chapter._id }),
                  });
                  router.push(
                    `/Course/${courseId}/chapters/${chapter._id}/subchapters`
                  );

                  router.push(
                    `/Course/${courseId}/chapters/${chapter._id}/subchapters`
                  );
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
