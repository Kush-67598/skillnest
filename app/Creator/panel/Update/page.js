"use client";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

export default function CreatorDashboard({ searchParams }) {
  const [token, setToken] = useState("");
  const [singleCourse, setSingleCourse] = useState([]);
  const [activeChapterId, setActiveChapterId] = useState(null);
  const [activeSubchapterId, setActiveSubchapterId] = useState(null);
  const [activeLessonId, setActiveLessonId] = useState(null);

  const courseId = React.use(searchParams).courseId;

  const fetchOne = async (courseId) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/Course/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setSingleCourse([data.reqCourse]);
    } catch (error) {
      toast.error("Error fetching course");
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedToken = localStorage.getItem("Token");
      if (savedToken) setToken(savedToken);
    }
  }, []);

  useEffect(() => {
    if (token) fetchOne(courseId);
  }, [token]);

  return (
    <div className="text-white">
      <ToastContainer />
      {singleCourse.map((course) => (
        <div
          key={course._id}
          className="bg-gray-800 p-6 min-h-dvh shadow space-y-5 border border-gray-700"
        >
          <h2 className="text-2xl py-4 text-center font-semibold mb-2">
            Update Course: {course.title}
          </h2>

          <UpdateCourseForm course={course} token={token} fetchOne={fetchOne} />

          {/* Chapters */}
          <div className="space-y-4">
            <h3 className="text-lg py-4 font-semibold">Chapters</h3>
            {course.chapters.length == 0 && <div>No Chapters Yet</div>}
            {course.chapters.map((ch,index) => (
              <div key={ch._id} className="bg-gray-700 py-2 rounded-lg">
                <button
                  onClick={() =>
                    setActiveChapterId((prev) =>
                      prev === ch._id ? null : ch._id
                    )
                  }
                  className="w-full text-left px-4 py-2 font-medium flex justify-between items-center"
                >
                  {index+1}. {ch.title}
                  <span>{activeChapterId === ch._id ? "−" : "+"}</span>
                </button>

                {activeChapterId === ch._id && (
                  <div className="p-4 space-y-3">
                    <UpdateChapterForm
                      courseId={course._id}
                      chapter={ch}
                      fetchOne={fetchOne}
                    />

                    {/* Subchapters */}
                    <h4 className=" py-3 font-semibold">Subchapters</h4>
                    {ch.subChapters.length == 0 && <div>No Subchapters Yet</div>}
                    {ch.subChapters.map((sub,index) => (
                      <div key={sub._id} className="bg-gray-600 py-2 rounded-md">
                        <button
                          onClick={() =>
                            setActiveSubchapterId((prev) =>
                              prev === sub._id ? null : sub._id
                            )
                          }
                          className="w-full text-left px-3 py-2 flex justify-between items-center"
                        >
                          {index+1}. {sub.title}
                          <span>
                            {activeSubchapterId === sub._id ? "−" : "+"}
                          </span>
                        </button>

                        {activeSubchapterId === sub._id && (
                          <div className="p-3 space-y-2">
                            <UpdateSubchapterForm
                              courseId={course._id}
                              chapterId={ch._id}
                              subchapter={sub}
                              fetchOne={fetchOne}
                            />

                            {/* Lessons */}
                            <h5 className="text-sm font-semibold">
                              Update Lessons
                            </h5>
                            {sub.lessons.map((lesson,index) => (
                              <div
                                key={lesson._id}
                                className="bg-gray-500 py-2 rounded-md"
                              >
                                <button
                                  onClick={() =>
                                    setActiveLessonId((prev) =>
                                      prev === lesson._id ? null : lesson._id
                                    )
                                  }
                                  className="w-full text-left px-2 py-1 flex justify-between items-center"
                                >
                                  {index+1}. {lesson.title}
                                  <span>
                                    {activeLessonId === lesson._id ? "−" : "+"}
                                  </span>
                                </button>

                                {activeLessonId === lesson._id && (
                                  <div className="p-2">
                                    <UpdateLessonForm
                                      courseId={course._id}
                                      chapterId={ch._id}
                                      subchapterId={sub._id}
                                      lesson={lesson}
                                      fetchOne={fetchOne}
                                    />
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ----------------------
// UpdateCourseForm
// ----------------------
function UpdateCourseForm({ course, token, fetchOne }) {
  const [form, setForm] = useState({
    title: course.title || "",
    slug: course.slug || "",
    price: course.price || "",
    category: course.category || "",
    description: course.description || "",
    thumbnailURL: course.thumbnailURL || "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <div className="space-y-3">
      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Title"
        className="w-full p-3 rounded-md bg-gray-700 placeholder-gray-400"
      />
      <input
        name="slug"
        value={form.slug}
        onChange={handleChange}
        placeholder="Slug"
        className="w-full p-3 rounded-md bg-gray-700 placeholder-gray-400"
      />
      <input
        name="price"
        type="number"
        value={form.price}
        onChange={handleChange}
        placeholder="Price"
        className="w-full p-3 rounded-md bg-gray-700 placeholder-gray-400"
      />
      <input
        name="category"
        value={form.category}
        onChange={handleChange}
        placeholder="Category"
        className="w-full p-3 rounded-md bg-gray-700 placeholder-gray-400"
      />
      <input
        name="thumbnailURL"
        value={form.thumbnailURL}
        onChange={handleChange}
        placeholder="Thumbnail URL"
        className="w-full p-3 rounded-md bg-gray-700 placeholder-gray-400"
      />
      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Description"
        className="w-full p-3 rounded-md bg-gray-700 placeholder-gray-400"
      ></textarea>
      <button
        onClick={async () => {
          try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/Course/${course._id}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(form),
            });
            const data = await res.json();
            if (data.updatedCourse) {
              toast.success("Course updated");
              fetchOne(course._id);
            } else toast.error("Failed to update course");
          } catch {
            toast.error("Error updating course");
          }
        }}
        className="bg-green-600 px-5 py-3 rounded-md hover:bg-green-700 text-sm transition"
      >
        Update Course
      </button>
    </div>
  );
}

// ----------------------
// UpdateChapterForm
// ----------------------
function UpdateChapterForm({ courseId, chapter, fetchOne }) {
  const [form, setForm] = useState({
    title: chapter.title || "",
    order: chapter.order || "",
  });
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  return (
    <>
      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Chapter Title"
        className="w-full py-3 rounded-md bg-gray-600 placeholder-gray-400"
      />
      <input
        name="order"
        type="number"
        value={form.order}
        onChange={handleChange}
        placeholder="Order"
        className="w-full py-3 rounded-md bg-gray-600 placeholder-gray-400"
      />
      <button
        onClick={async () => {
          try {
            const res = await fetch(
              `${process.env.NEXT_PUBLIC_API}/api/Course/${courseId}/chapters/${chapter._id}`,
              {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
              }
            );
            const data = await res.json();
            if (data.updatedChapter) {
              toast.success("Chapter updated");
              fetchOne(courseId);
            } else toast.error("Failed to update chapter");
          } catch {
            toast.error("Error updating chapter");
          }
        }}
        className="bg-green-600 px-5 py-3 rounded-md hover:bg-green-700 text-xs transition"
      >
        Update Chapter
      </button>
    </>
  );
}

// ----------------------
// UpdateSubchapterForm
// ----------------------
function UpdateSubchapterForm({ courseId, chapterId, subchapter, fetchOne }) {
  const [form, setForm] = useState({
    title: subchapter.title || "",
    order: subchapter.order || "",
  });
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  return (
    <>
      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Subchapter Title"
        className="w-full py-3 rounded-md bg-gray-500 placeholder-gray-400"
      />
      <input
        name="order"
        type="number"
        value={form.order}
        onChange={handleChange}
        placeholder="Order"
        className="w-full py-3 rounded-md bg-gray-500 placeholder-gray-400"
      />
      <button
        onClick={async () => {
          try {
            const res = await fetch(
              `${process.env.NEXT_PUBLIC_API}/api/Course/${courseId}/chapters/${chapterId}/subchapters/${subchapter._id}`,
              {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
              }
            );
            const data = await res.json();
            if (data.updatedSubchapter) {
              toast.success("Subchapter updated");
              fetchOne(courseId);
            } else toast.error("Failed to update subchapter");
          } catch {
            toast.error("Error updating subchapter");
          }
        }}
        className="bg-green-600 px-5 py-3 rounded-md hover:bg-green-700 text-xs transition"
      >
        Update Subchapter
      </button>
    </>
  );
}

// ----------------------
// UpdateLessonForm
// ----------------------
function UpdateLessonForm({
  courseId,
  chapterId,
  subchapterId,
  lesson,
  fetchOne,
}) {
  const [form, setForm] = useState({
    title: lesson.title || "",
    order: lesson.order || "",
    content: lesson.content || "",
    videoURL: lesson.videoURL || "",
  });
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  return (
    <>
      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Lesson Title"
        className="w-full p-2 rounded-md bg-gray-400 py-2 my-1 placeholder-gray-300"
      />
      <input
        name="order"
        type="number"
        value={form.order}
        onChange={handleChange}
        placeholder="Order"
        className="w-full p-2 rounded-md bg-gray-400 py-2 my-1 placeholder-gray-300"
      />
      <textarea
        name="content"
        value={form.content}
        onChange={handleChange}
        placeholder="Content"
        className="w-full p-2 rounded-md bg-gray-400 py-2 my-1 placeholder-gray-300"
      ></textarea>
      <input
        name="videoURL"
        value={form.videoURL}
        onChange={handleChange}
        placeholder="Video URL"
        className="w-full p-2 rounded-md bg-gray-400 py-2 my-1 placeholder-gray-300"
      />
      <button
        onClick={async () => {
          try {
            const res = await fetch(
              `${process.env.NEXT_PUBLIC_API}/api/Course/${courseId}/chapters/${chapterId}/subchapters/${subchapterId}/lessons/${lesson._id}`,
              {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
              }
            );
            const data = await res.json();
            if (data.updatedLesson) {
              toast.success("Lesson updated");
              fetchOne(courseId);
            } else toast.error("Failed to update lesson");
          } catch {
            toast.error("Error updating lesson");
          }
        }}
        className="bg-green-600 px-5 py-3 my-1 rounded-md hover:bg-green-700 text-xs transition"
      >
        Update Lesson
      </button>
    </>
  );
}
