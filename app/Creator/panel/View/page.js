"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CreatorMyCourses() {
  const [token, setToken] = useState("");
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedToken = localStorage.getItem("Token");
    if (!savedToken) {
      toast.error("Please log in first!");
      router.push("/Creator/CreatorLogin");
      return;
    }

    setToken(savedToken);

    const fetchCourses = async () => {
      try {
        const res = await fetch("/api/CreatorCourse", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${savedToken}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch courses");

        const data = await res.json();

        // Ensure we store an array
        if (Array.isArray(data.Creator_courses)) {
          setAllCourses(data.Creator_courses);
        } else if (data.Creator_courses && Array.isArray(data.Creator_courses.courses)) {
          setAllCourses(data.Creator_courses.courses);
        } else {
          setAllCourses([]);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load courses. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [router]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white text-xl">
        Loading your courses...
      </div>
    );

  if (!allCourses || allCourses.length === 0)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
        <p className="text-2xl mb-4">No courses found!</p>
        <button
          className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded text-white"
          onClick={() => router.push("/Creator/panel/Create")}
        >
          Create Your First Course
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-900 p-6 space-y-6">
      <ToastContainer position="top-right" theme="dark" />
      <h1 className="text-3xl font-semibold mb-4 text-white">My Courses</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {allCourses.map((course, index) => (
          <div
            key={index}
            className="bg-gray-800 rounded-xl shadow hover:shadow-lg transition p-4 space-y-3 hover:scale-105 transform duration-300"
          >
            <div className="w-full h-40 text-white overflow-hidden rounded-md">
              <img
                src={course.thumbnailURL || " "}
                alt={course.title}
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-xl font-bold text-white truncate">
              {course.title}
            </h2>
            <p className="text-gray-400 text-sm truncate">
              Category: {course.category}
            </p>
            <p className="text-gray-200 font-semibold">${course.price}</p>

            <div className="flex gap-2 mt-2">
              <button
                onClick={() =>
                  router.push(`/Creator/panel/Edit?courseId=${course._id}`)
                }
                className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition cursor-pointer"
              >
                Manage
              </button>
              <button
                onClick={() =>
                  router.push(`/Creator/panel/Update?courseId=${course._id}`)
                }
                className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition cursor-pointer"
              >
                Update
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
