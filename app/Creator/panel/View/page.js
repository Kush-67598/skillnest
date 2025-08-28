"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CreatorMyCourses() {
  const [token, setToken] = useState("");
  const router = useRouter();
  const [AllCourses, setAllCourses] = useState([]);

  // Load token from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedToken = localStorage.getItem("Token");
      if (savedToken) setToken(savedToken);
    }
  }, []);

  // Fetch courses when token is available
  useEffect(() => {
    if (token) FetchCreatorCourses();
  }, [token]);

  const FetchCreatorCourses = async () => {
    const fetchCourse = await fetch(
      `${process.env.NEXT_PUBLIC_API}/api/CreatorCourse`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const response = await fetchCourse.json();
    setAllCourses(response.Creator_courses);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6 space-y-6">
      <h1 className="text-3xl font-semibold mb-4 text-white">My Courses</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {AllCourses &&
          AllCourses.courses &&
          AllCourses.courses.map((course, index) => (
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
