"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CommentsPage from "@/Components/Comments";
import Loader from "@/Components/Loader/loader";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SingleCourseCard({ course }) {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0); // track actual progress
  const [token, setToken] = useState(null);
  const [paidCourseUser, setPaidCourseUser] = useState(null);
  console.log(paidCourseUser);
  useEffect(() => {
    const t = localStorage.getItem("USER_TOKEN");
    if (!t) return;
    const fetchUser = async () => {
      const response = await fetch("/api/User", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("USER_TOKEN")}`,
        },
      });
      const res = await response.json();
      setPaidCourseUser(res.premiumCourseID);
    };
    fetchUser();
  }, []);
  const router = useRouter();

  if (paidCourseUser && paidCourseUser.includes(course._id)) {
  }

  // count total lessons
  const Count_chapter = course.chapters.length;
  let countSubchapters = 0;
  let countLessons = 0;
  for (let i = 0; i < course.chapters.length; i++) {
    const chapter = course.chapters[i];
    countSubchapters += chapter.subChapters.length;
    for (let j = 0; j < chapter.subChapters.length; j++) {
      const sub = chapter.subChapters[j];
      countLessons += sub.lessons.length;
    }
  }

  useEffect(() => {
    const t = localStorage.getItem("USER_TOKEN");
    if (t) setToken(t);
  }, []);

  // fetch progress for this course
  useEffect(() => {
    if (!token) return;
    const fetchProgress = async () => {
      try {
        const resp = await fetch(
          `/api/check-completed?courseId=${course._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await resp.json();

        if (!resp.ok)
          throw new Error(data.message || "Failed to load progress");

        // if API returns completed lessons
        const completedLessons = data.progress?.completedLessons?.length || 0;

        const percent =
          countLessons > 0
            ? Math.round((completedLessons / countLessons) * 100)
            : 0;

        setProgress(percent);
      } catch (err) {
        console.error("Progress error:", err);
        toast.error(err.message || "Failed to fetch progress");
      }
    };
    fetchProgress();
  }, [token, course._id, countLessons]);

  const handleEnroll = async () => {
    if (!token) {
      toast.warn("Please login to enroll in the course.");
      return;
    }

    setLoading(true);

    if (
      course.price &&
      course.price !== 0 &&
      paidCourseUser &&
      paidCourseUser.includes(course._id)
    ) {
      router.push(`/Course/${course._id}/chapters`);
      toast.success("Course Continues", {
        autoClose: 1000,
        pauseOnHover: false,
        hideProgressBar: true,
      });
      setLoading(false);
      return;
    } else if (
      course.price &&
      course.price !== 0 &&
      paidCourseUser &&
      !paidCourseUser.includes(course._id)
    ) {
      router.push(`/Course/${course._id}/Orders`);
    }
    // const enrolledcourse = await fetch(
    //         `${process.env.NEXT_PUBLIC_API}/api/enrolledCourse`,
    //         {
    //           method: "POST",
    //           headers: {
    //             Authorization: `Bearer ${token}`,
    //             "Content-Type": "application/json",
    //           },
    //           body: JSON.stringify({ courseId: course._id }),
    //         }
    //       );
    //   const res = await enrolledcourse.json();
    //   if (!enrolledcourse.ok)
    //     throw new Error(res.message || "Failed to enroll");

    //   // toast.success("Enrolled successfully!", {
    //   //   pauseOnHover: false,
    //   //   autoClose: 1000,
    //   //   hideProgressBar: true,
    //   // });
    //   // router.push(`/Course/${course._id}/chapters`);
    // } catch (err) {
    //   toast.error(err.message);
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <div className="w-full mx-auto p-10 border border-gray-700 rounded-3xl shadow-xl hover:shadow-2xl transition-shadow duration-300 mt-10 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800">
      {loading && <Loader />}

      <h1 className="text-5xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-500 to-blue-500 drop-shadow-lg">
        {course.title}
      </h1>

      <p className="text-sm text-gray-400 mb-6 uppercase tracking-[0.15em]">
        Category:{" "}
        <span className="text-indigo-400 font-semibold">{course.category}</span>
      </p>

      <p className="text-gray-300 mb-8 leading-relaxed text-lg">
        {course.description}
      </p>

      <div className="mb-8 flex items-center gap-2">
        <span className="text-gray-400 text-base">Price:</span>
        <span className="text-green-400 font-bold text-2xl">
          ₹{course.price}
        </span>
      </div>

      <div className="mb-8 bg-gray-800 p-5 rounded-2xl border border-gray-700 shadow-md hover:shadow-lg transition-shadow">
        <h3 className="text-xl font-bold text-white mb-4">📚 Course Details</h3>
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex items-center gap-2 bg-gray-700 p-3 rounded-xl flex-1 hover:bg-gray-600 transition">
            <span className="text-purple-400 text-2xl">📘</span>
            <div>
              <p className="text-gray-300 text-sm">Chapters</p>
              <p className="text-white font-semibold text-lg">
                {Count_chapter}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-gray-700 p-3 rounded-xl flex-1 hover:bg-gray-600 transition">
            <span className="text-indigo-400 text-2xl">📄</span>
            <div>
              <p className="text-gray-300 text-sm">Subchapters</p>
              <p className="text-white font-semibold text-lg">
                {countSubchapters}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-gray-700 p-3 rounded-xl flex-1 hover:bg-gray-600 transition">
            <span className="text-green-400 text-2xl">🎬</span>
            <div>
              <p className="text-gray-300 text-sm">Lessons</p>
              <p className="text-white font-semibold text-lg">{countLessons}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-6 mt-6">
        <button
          onClick={() => router.push("/Course")}
          className="flex-1 bg-gray-800 text-gray-300 px-6 py-3 rounded-xl hover:bg-gray-700 transition font-semibold shadow-md hover:shadow-lg"
        >
          ⬅ Back
        </button>

        <button
          onClick={handleEnroll}
          disabled={loading}
          className={`flex-1 ${
            loading
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-gradient-to-r from-green-500 via-green-600 to-green-700 hover:brightness-110"
          } text-white px-6 py-3 rounded-xl transition font-semibold shadow-md hover:shadow-lg`}
        >
          {loading || paidCourseUser?.includes(course._id)
            ? "Continue"
            : "🚀 Enroll Now"}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mt-10">
        <div className="h-4 w-full bg-gray-700 rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="mt-2 text-sm text-gray-400">
          Course Progress: {progress}%
        </p>
      </div>

      <CommentsPage course={course} />
    </div>
  );
}
