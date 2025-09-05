"use client";
import React, { useState, useEffect } from "react";
import CourseCard from "../../Components/Courses/AllCourses/allcourses";
import Loader from "@/Components/Loader/loader";

export default function CoursePage() {
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  const fetchCourses = async (page = 0) => {
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/Course?page=${page}`,
        {
          method: "GET",
          next: { revalidate: 60 },
        }
      );
      const data = await res.json();
      setCourses(data.allCourses || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses(currentPage);
  }, [currentPage]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-800 text-white">
      {/* Loader */}
      {loading && <Loader />}

      {/* Main Content */}
      <main className="flex-grow max-w-full  px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-white">All Courses</h1>

        {/* Courses List (full width) */}
        <div className="flex flex-col gap-6 w-full">
          {courses.length > 0 ? (
            courses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))
          ) : (
            <div className="text-center text-gray-300 py-8">
              No Courses Found
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center gap-4 mt-6">
          <button
            disabled={currentPage === 0}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50"
          >
            Prev
          </button>

          <button
            disabled={courses.length === 0}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </main>
    </div>
  );
}
