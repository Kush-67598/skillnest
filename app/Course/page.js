"use client";
import React, { useState, useEffect } from "react";
import CourseCard from "../../Components/Courses/AllCourses/allcourses";

export default function Course() {
  const [courses, setCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  const fetchCourses = async (page = 0) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API}/api/Course?page=${page}`,
      {
        method: "GET",
        next: { revalidate: 60 },
      }
    );
    const data = await res.json();
    setCourses(data.allCourses || []);
  };

  useEffect(() => {
    fetchCourses(currentPage);
  }, [currentPage]);

  return (
    <div className="p-6  h-[110vh] bg-slate-800 text-white">
      <h1 className="text-2xl font-bold mb-4">All Courses</h1>
      <div className="gap-4">
        {courses.map((course) => (
          <CourseCard key={course._id} course={course} />
        ))}
      </div>

      {/* Pagination Controls */}
      {courses.length==0 && <div>No Course on this page</div>}
      <div className="flex justify-center gap-4 mt-6">
        <button
          disabled={currentPage === 0}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50"
        >
          Prev
        </button>

        <button
          disabled={courses.length == 0}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="disabled:opacity-50 px-3 py-1 bg-gray-700 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}
