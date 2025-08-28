"use client";

import { useRouter } from "next/navigation";
import Loader from "@/Components/Loader/loader";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

export default function CreatorDashboard({ searchParams }) {
  const unwrapped = React.use(searchParams);
  const courseId = unwrapped.courseId;
  const router = useRouter();
  const [token, setToken] = useState("");

  const [loading, setLoading] = useState(false);
  const [singleCourse, setSingleCourse] = useState([]);
  const [activesubchapterId, setActiveSubchapterId] = useState(null);
  const [activeChapterId, setActiveChapterId] = useState(null);

  const [file, setFile] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [lessonsdata, setLessonsData] = useState({
    title: "",
    order: "",
    videoURL: "",
  });
  const addNewSection = () => {
    setSectionData((prev) => [
      ...prev,
      {
        mainTitle: "",
        subHeading: "",
        paragraph: "",
        codeSnippet: "",
        images: [],
      },
    ]);
  };

  const [sectionData, setSectionData] = useState([
    {
      subHeading: "",
      paragraph: "",
      codeSnippet: "",
      images: [],
    },
  ]);
  const handleLessonChange = (e) => {
    const { name, value } = e.target;
    setLessonsData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSectionChange = (index, e) => {
    const { name, value } = e.target;
    setSectionData((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [name]: value };
      return updated;
    });
  };

  const fetchOne = async (courseId) => {
    if (!courseId) return;
    const fetch_one_course = await fetch(
      `${process.env.NEXT_PUBLIC_API}/api/Course/${courseId}`,
      {
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // },
      }
    );
    const response = await fetch_one_course.json();

    setSingleCourse([response.reqCourse]);
  };

  const UploadThumbnail = async () => {
    const sigRes = await fetch(
      `${process.env.NEXT_PUBLIC_API}/api/handle_uploads`,
      { method: "POST" }
    );
    const { signature, timestamp, apiKey, folder } = await sigRes.json();
    if (!file) {
      alert("PLEASE UPLOAD THE FILE");
    }
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", apiKey);
      formData.append("timestamp", timestamp);
      formData.append("signature", signature);
      formData.append("folder", folder);
      formData.append("keep_original", "false"); // very important
      setLoading(true);

      const fetchData = await fetch(
        `https://api.cloudinary.com/v1_1/dt95b41ai/image/upload`,
        { method: "POST", body: formData }
      );
      const res = await fetchData.json();
      setFormData((prev) => ({ ...prev, thumbnailurl: res.secure_url }));

      setLoading(false);
      toast.success("Video Uploaded Successfully", { autoClose: 1000 });
    }
  };
  const handleUpload = async () => {
    const sigRes = await fetch(
      `${process.env.NEXT_PUBLIC_API}/api/handle_uploads`,
      { method: "POST" }
    );
    const { signature, timestamp, apiKey, folder } = await sigRes.json();
    if (!file) {
      alert("PLEASE UPLOAD THE FILE");
    }
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", apiKey);
      formData.append("timestamp", timestamp);
      formData.append("signature", signature);
      formData.append("folder", folder);
      formData.append("keep_original", "false"); // very important
      setLoading(true);

      const fetchData = await fetch(
        `https://api.cloudinary.com/v1_1/dt95b41ai/video/upload`,
        { method: "POST", body: formData }
      );
      const res = await fetchData.json();
      setLessonsData((prev) => ({ ...prev, videoURL: res.secure_url }));
      setLoading(false);
      toast.success("Video Uploaded Successfully", { autoClose: 1000 });
    }
  };
  const handleImageUpload = async () => {
    const sigRes = await fetch(
      `${process.env.NEXT_PUBLIC_API}/api/handle_uploads`,
      { method: "POST" }
    );
    const { signature, timestamp, apiKey, folder } = await sigRes.json();
    if (imageFiles.length === 0) {
      alert("PLEASE UPLOAD THE FILE");
    }
    const uploadedImages = [];
    for (const file of imageFiles) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", apiKey);
      formData.append("timestamp", timestamp);
      formData.append("signature", signature);
      formData.append("folder", folder);
      formData.append("keep_original", "false"); // very important
      setLoading(true);

      const fetchData = await fetch(
        `https://api.cloudinary.com/v1_1/dt95b41ai/image/upload`,
        { method: "POST", body: formData }
      );
      const res = await fetchData.json();
      uploadedImages.push(res.secure_url);
    }
    setSectionData((prev) => [...prev, { images: uploadedImages }]);
    setLoading(false);
    toast.success("Images Uploaded Successfully", { autoClose: 1000 });
  };

  useEffect(() => {
    if (token && courseId) {
      fetchOne(courseId);
    }
  }, [token, courseId]);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedToken = localStorage.getItem("Token");
      if (savedToken) {
        setToken(savedToken);
      }
    }
  }, []);

  const [chapterdata, setChapterData] = useState({
    title: "",
    order: "",
  });

  const [formdata, setFormData] = useState({
    slug: "",
    title: "",
    price: "",
    category: "",
    description: "",
    thumbnailurl: "",
  });

  const [subChapterdata, setSubChapterData] = useState({
    title: "",
    order: "",
  });

  const toggleChapter = (id) => {
    setActiveChapterId((prev) => (prev === id ? null : id));
  };
  const toggleSubchapter = (id) => {
    setActiveSubchapterId((prev) => (prev === id ? null : id));
  };

  const handleChange_subch = (e) => {
    const { value, name } = e.target;
    setSubChapterData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChange_ch = (e) => {
    const { value, name } = e.target;
    setChapterData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const ADD_SUB_CH = async (courseId, chapter_id) => {
    try {
      const addChapter = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/Course/${courseId}/chapters/${chapter_id}/subchapters`,
        {
          headers: { "Content-Type": "application/json" },
          method: "POST",
          body: JSON.stringify(subChapterdata),
        }
      );
      const res = await addChapter.json();
      if (res.success) {
        toast.success("SubChapter Added Successfully", { autoClose: 1000 });
        fetchOne(courseId);
        setSubChapterData({
          title: "",
          order: "",
        });
      }
    } catch (error) {
      toast.error("Internal Server Error!! SubChapter Can't be Added");
    }
  };

  const ADD_CH = async (courseId) => {
    try {
      const addChapter = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/Course/${courseId}/chapters`,
        {
          headers: { "Content-Type": "application/json" },
          method: "POST",
          body: JSON.stringify(chapterdata),
        }
      );
      const res = await addChapter.json();
      if (res.success) {
        toast.success("Chapter Added Successfully", { autoClose: 1000 });
        setChapterData({ title: "", order: "" });
        fetchOne(courseId);
      }
    } catch (error) {
      toast.error("Internal Server Error!! Chapter Can't be Added");
    }
  };

  const ADD_LESSON = async (courseId, chapter_id, subchapterId) => {
    try {
      const addLesson = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/Course/${courseId}/chapters/${chapter_id}/subchapters/${subchapterId}/lessons`,
        {
          headers: { "Content-Type": "application/json" },
          method: "POST",
          body: JSON.stringify({ lessonsdata, sectionData }),
        }
      );
      const res = await addLesson.json();
      if (res.success) {
        toast.success("Lesson Added Successfully", { autoClose: 1000 });
        fetchOne(courseId);
      }
    } catch (error) {
      toast.error("Internal Server Error!! Lesson Can't be Added");
    }
  };

  const handleChange_course = (e) => {
    const { value, name } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const AddCourseArr = Object.entries(formdata).map(([key, value]) => ({
    name: key,
    value,
  }));

  const handle_Course_Submit = async () => {
    try {
      const addCourse = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/Course`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ formdata, token }),
          method: "POST",
        }
      );
      const response = await addCourse.json();
      if (response.success) {
        toast.success("Course Added Successfully", { autoClose: 1000 });
        setFormData({
          slug: "",
          title: "",
          price: "",
          category: "",
          description: "",
          thumbnailurl: "",
        });
        fetchOne(courseId);
      }
    } catch (error) {
      toast.error("Internal Server Error!! Course Can't be Added");
    }
  };
  const delete_Course = async (courseId) => {
    try {
      const deleteCourse = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/Course/${courseId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          method: "DELETE",
        }
      );
      const response = await deleteCourse.json();
      if (response.success) {
        toast.success("Course Deleted Successfully", { autoClose: 1000 });
        fetchOne(courseId);
      }
    } catch (error) {
      toast.error("Internal Server Error!! Course Can't be Deleted");
    }
  };
  const delete_chapter = async (courseId, chapterId) => {
    try {
      const deleteChapter = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/Course/${courseId}/chapters/${chapterId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          method: "DELETE",
        }
      );
      const response = await deleteChapter.json();
      if (response.success) {
        toast.success("Chapter Deleted Successfully", { autoClose: 1000 });
        fetchOne(courseId);
      }
    } catch (error) {
      toast.error("Internal Server Error!! Chapter Can't be Deleted");
    }
  };
  const delete_subChapter = async (courseId, chapterId, subchapterId) => {
    try {
      const deleteSubchapter = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/Course/${courseId}/chapters/${chapterId}/subchapters/${subchapterId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          method: "DELETE",
        }
      );
      const response = await deleteSubchapter.json();
      if (response.success) {
        toast.success("Subchapter Deleted Successfully", { autoClose: 1000 });
        fetchOne(courseId);
      }
    } catch (error) {
      toast.error("Internal Server Error!! Subchapter Can't be Deleted");
    }
  };
  const delete_lesson = async (courseId, chapterId, subchapterId, lessonId) => {
    try {
      const deletelesson = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/Course/${courseId}/chapters/${chapterId}/subchapters/${subchapterId}/lessons/${lessonId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          method: "DELETE",
        }
      );
      const response = await deletelesson.json();
      if (response.success) {
        toast.success("Lesson Deleted Successfully", { autoClose: 1000 });
        fetchOne(courseId);
      }
    } catch (error) {
      toast.error("Internal Server Error!! Lesson Can't be Deleted");
    }
  };

  return (
    <div className="text-white ">
      {loading && <Loader />}
      <ToastContainer />

      <div className=" bg-gray-800 p-6 shadow space-y-4">
        <div className=" flex items-center justify-between">
          <h2 className="text-3xl font-semibold text-center  py-2">
            Add New Course
          </h2>
          <h2
            className="text-xl font-semibold text-center  hover:text-blue-400 hover:underline  cursor-pointer 0 py-2"
            onClick={() => router.push("/Creator/panel/View")}
          >
            View All Courses
          </h2>
        </div>

        <div className="space-y-3">
          {AddCourseArr.map((item, index) => (
            <input
              key={index}
              onChange={handleChange_course}
              name={item.name}
              value={item.value}
              type={item.name === "price" ? "number" : "text"}
              placeholder={item.name}
              className={`w-full p-3 rounded-md ${
                item.name == "thumbnailurl" ? "hidden" : "block"
              } bg-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500`}
            />
          ))}
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          <button
            className="bg-purple-500 p-2 mx-2 rounded-md"
            onClick={() => UploadThumbnail()}
          >
            UPLOAD THUMBNAIL
          </button>
        </div>
        <button
          onClick={handle_Course_Submit}
          className="bg-green-600 px-5 py-3 rounded-md hover:bg-green-700 text-sm transition"
        >
          Add Course
        </button>
      </div>

      {/* Existing courses */}
      <div className="space-y-8">
        {singleCourse &&
          singleCourse.map((course, idx) => (
            <div
              key={idx}
              className="bg-gray-800 p-6 shadow space-y-5 border border-gray-700"
            >
              <div className="space-y-1 flex items-center justify-between">
                <div className="flex flex-col">
                  <h2 className="text-2xl font-semibold">{course.title}</h2>
                  <p className="text-sm text-gray-300">
                    Price: ${course.price}
                  </p>
                </div>
                <button
                  onClick={() => delete_Course(course._id)}
                  className="bg-red-600 px-4 py-2 rounded-md text-sm hover:bg-red-700 transition"
                >
                  Delete Course
                </button>
              </div>

              {/* Add Chapter */}
              <div className="bg-gray-700 p-4 space-y-3">
                <h3 className="text-lg font-semibold">Add Chapter</h3>
                <input
                  type="text"
                  name="title"
                  onChange={handleChange_ch}
                  value={chapterdata.title}
                  placeholder="Chapter Title"
                  className="w-full p-2 rounded-md bg-gray-600 placeholder-gray-400 focus:outline-none"
                />
                <input
                  type="number"
                  name="order"
                  onChange={handleChange_ch}
                  value={chapterdata.order}
                  placeholder="Order"
                  className="w-full p-2 rounded-md bg-gray-600 placeholder-gray-400 focus:outline-none"
                />
                <button
                  onClick={() => ADD_CH(course._id)}
                  className=" text-sm bg-green-600 px-4 py-2 rounded-md hover:bg-green-700 transition"
                >
                  Add Chapter
                </button>
              </div>

              {/* Chapters */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Chapters</h3>
                <div className="space-y-4">
                  {course.chapters.length == 0 && (
                    <div className="text-xs text-gray-300 italic">
                      No Chapters
                    </div>
                  )}

                  {course.chapters.map((ch, index) => (
                    <div
                      key={index}
                      className="bg-gray-700 p-4 rounded-xl space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2 items-center">
                          <span className="font-bold">{ch.order}.</span>
                          <span>{ch.title}</span>
                        </div>
                        <div className="flex items-center justify-center">
                          <button
                            onClick={() => delete_chapter(course._id, ch._id)}
                            className="bg-red-600 px-4 py-2 mx-3 rounded-md hover:bg-red-700 transition text-sm"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => toggleChapter(ch._id)}
                            className="bg-gray-600 px-2 py-1 rounded hover:bg-gray-500"
                          >
                            {activeChapterId === ch._id ? "-" : "+"}
                          </button>
                        </div>
                      </div>
                      {activeChapterId === ch._id && (
                        <div className="space-y-4">
                          <div className="border-t border-gray-500 pt-4">
                            <h4 className="font-semibold">Add Subchapter</h4>
                            <input
                              type="text"
                              placeholder="Subchapter Title"
                              onChange={handleChange_subch}
                              name="title"
                              value={subChapterdata.title}
                              className="w-full p-2 my-1 rounded-md bg-gray-600 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-lime-300"
                            />
                            <input
                              type="number"
                              placeholder="Order"
                              onChange={handleChange_subch}
                              name="order"
                              value={subChapterdata.order}
                              className="w-full p-2 my-1 rounded-md bg-gray-600 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-lime-300"
                            />
                            <button
                              onClick={() => ADD_SUB_CH(course._id, ch._id)}
                              className="bg-green-600 px-4 py-2 rounded-md hover:bg-green-700 transition text-sm"
                            >
                              Add Subchapter
                            </button>
                          </div>

                          <div className="space-y-2">
                            <h5 className="pt-2 font-semibold">Subchapters</h5>
                            {ch.subChapters.length == 0 && (
                              <div className="text-xs text-gray-300 italic">
                                No Subchapters yet
                              </div>
                            )}
                            {ch.subChapters.map((item, index) => (
                              <div
                                key={index}
                                className="bg-gray-600 p-3 rounded-xl "
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <span className="px-1">{index + 1}</span>
                                    <span className="px-1">{item.title}</span>
                                  </div>
                                  <div className="flex items-center justify-center">
                                    <button
                                      onClick={() =>
                                        delete_subChapter(
                                          course._id,
                                          ch._id,
                                          item._id
                                        )
                                      }
                                      className="bg-red-600 px-4 py-2 mx-3 rounded-md hover:bg-red-700 transition text-sm"
                                    >
                                      Delete sub
                                    </button>
                                    <button
                                      onClick={() => toggleSubchapter(item._id)}
                                      className="bg-gray-500 px-2 py-1 rounded hover:bg-gray-400"
                                    >
                                      {activesubchapterId === item._id
                                        ? "-"
                                        : "+"}
                                    </button>
                                  </div>
                                </div>

                                {activesubchapterId === item._id && (
                                  <div className="mt-2 space-y-4">
                                    <h5 className="text-sm font-semibold">
                                      Add Lesson
                                    </h5>
                                    <input
                                      type="text"
                                      placeholder="Lesson Title"
                                      value={lessonsdata.title}
                                      onChange={handleLessonChange}
                                      name="title"
                                      className="w-full p-2 rounded-md bg-gray-500 placeholder-gray-400"
                                    />
                                    <input
                                      type="number"
                                      placeholder="Order"
                                      name="order"
                                      value={lessonsdata.order}
                                      onChange={handleLessonChange}
                                      className="w-full p-2 rounded-md bg-gray-500 placeholder-gray-400"
                                    />

                                    <input
                                      type="text"
                                      placeholder="VideoURL"
                                      value={lessonsdata.videoURL}
                                      onChange={handleLessonChange}
                                      name="videoURL"
                                      className="w-full hidden p-2 rounded-md bg-gray-500 placeholder-gray-400"
                                    />

                                    <div className="flex justify-start items-center ">
                                      <input
                                        type="file"
                                        onChange={(e) =>
                                          setFile(e.target.files[0])
                                        }
                                        className="mx-2 rounded-2xl py-4"
                                      />
                                      <button
                                        onClick={handleUpload}
                                        className="bg-blue-500 p-2 rounded-xl"
                                      >
                                        Upload Lesson Video
                                      </button>
                                    </div>
                                    <div className="flex justify-start items-center ">
                                      <input
                                        type="file"
                                        onChange={(e) =>
                                          setImageFiles([...e.target.files])
                                        }
                                        multiple
                                        className="mx-2 rounded-2xl py-4"
                                      />
                                      <button
                                        onClick={handleImageUpload}
                                        className="bg-blue-500 p-2 rounded-xl"
                                      >
                                        Upload Lesson Images
                                      </button>
                                    </div>

                                    <div>
                                      ADD SECTION
                                      {sectionData.map((section, index) => (
                                        <div
                                          key={index}
                                          className="border p-4 my-2 rounded-lg bg-gray-700"
                                        >
                                          <input
                                            placeholder="Main Title"
                                            name="mainTitle"
                                            value={section.mainTitle || ""}
                                            onChange={(e) =>
                                              handleSectionChange(index, e)
                                            }
                                            className="w-full p-2 rounded-md bg-gray-500 placeholder-gray-400"
                                          />

                                          <input
                                            type="text"
                                            value={section.subHeading || ""}
                                            placeholder="SubHeading"
                                            name="subHeading"
                                            onChange={(e) =>
                                              handleSectionChange(index, e)
                                            }
                                            className="w-full my-2 p-2 rounded-md bg-gray-500 placeholder-gray-400"
                                          />
                                          <input
                                            type="text"
                                            value={section.paragraph || ""}
                                            placeholder="Paragraph"
                                            name="paragraph"
                                            onChange={(e) =>
                                              handleSectionChange(index, e)
                                            }
                                            className="w-full my-2 p-2 rounded-md bg-gray-500 placeholder-gray-400"
                                          />
                                          <input
                                            type="text"
                                            value={section.codeSnippet || ""}
                                            placeholder="Snippet"
                                            name="codeSnippet"
                                            onChange={(e) =>
                                              handleSectionChange(index, e)
                                            }
                                            className="w-full my-2 p-2 rounded-md bg-gray-500 placeholder-gray-400"
                                          />
                                        </div>
                                      ))}
                                      <button
                                        type="button"
                                        onClick={addNewSection}
                                        className="bg-green-500 p-2 mt-2 rounded-lg"
                                      >
                                        ➕ Add Another Section
                                      </button>
                                    </div>

                                    <button
                                      onClick={() =>
                                        ADD_LESSON(course._id, ch._id, item._id)
                                      }
                                      className="bg-green-600 px-4 py-2 rounded-md hover:bg-green-700 transition text-sm"
                                    >
                                      Add Lesson
                                    </button>

                                    <div className="space-y-2 pt-2 border-t border-gray-400">
                                      <h5 className="text-sm font-semibold">
                                        Lessons
                                      </h5>
                                      {item.lessons.length === 0 ? (
                                        <p className="text-xs text-gray-300 italic">
                                          No lessons yet
                                        </p>
                                      ) : (
                                        item.lessons.map((less, index) => (
                                          <div
                                            key={index}
                                            className="flex items-center justify-between bg-gray-500 rounded-xl py-4"
                                          >
                                            <div className="flex items-center gap-2">
                                              <div className=" text-sm">
                                                <span className="px-1">
                                                  {index + 1}.
                                                </span>
                                                <span className="px-1">
                                                  {less.title}
                                                </span>
                                              </div>
                                            </div>
                                            <button
                                              onClick={() =>
                                                delete_lesson(
                                                  course._id,
                                                  ch._id,
                                                  item._id,
                                                  less._id
                                                )
                                              }
                                              className="bg-red-600 px-12 mx-4 py-3 rounded-md hover:bg-red-700 transition text-xs"
                                            >
                                              Delete
                                            </button>
                                          </div>
                                        ))
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
