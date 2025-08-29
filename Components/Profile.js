"use client";

import Image from "next/image";
import { useState, useRef } from "react";

import { ToastContainer, toast } from "react-toastify";

import {
  FaBook,
  FaBookmark,
  FaCog,
  FaComment,
  FaInfoCircle,
  FaShieldAlt,
  FaSignOutAlt,
  FaUserEdit,
} from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function ProfilePage({ user }) {
  const [POTDData, setPOTDData] = useState({
    Question: "",
    Answer: "",
    Difficulty: "",
  });
  console.log("POTDData", POTDData);
  const POTDGROQ = async () => {
    const response = await fetch("/api/Groq/POTDQuestion", {
      method: "POST",
    });
    const res = await response.json();
    console.log(res.data.Question);

    const newData = {
      Question: res.data.Question,
      Answer: res.data.Answer,
      Difficulty: res.data.Difficulty,
    };
    setPOTDData(newData);
    await savePOTDToDb(newData);
  };
  const savePOTDToDb = async (newData) => {
    const res = await fetch("/api/POTD", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("USER_TOKEN")}`,
      },
      method: "POST",
      body: JSON.stringify(newData),
    });
    const finalRes = await res.json();
    console.log(finalRes);
  };

  const [file, setFile] = useState(null);
  const [image, setImage] = useState(user?.profileImg || null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const router = useRouter();

  // Upload image to Cloudinary
  const handleUpload = async () => {
    if (!file) return alert("Please select a file");

    setLoading(true);
    try {
      const sigRes = await fetch("/api/handle_uploads", { method: "POST" });
      const { signature, timestamp, apiKey, folder } = await sigRes.json();

      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", apiKey);
      formData.append("timestamp", timestamp);
      formData.append("signature", signature);
      formData.append("folder", folder);

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/dt95b41ai/image/upload`,
        { method: "POST", body: formData }
      );
      const res = await uploadRes.json();

      if (res.secure_url) {
        setImage(res.secure_url);
        await saveToDB(res.secure_url);
      } else {
        throw new Error("Cloudinary upload failed");
      }
    } catch (err) {
      console.error(err);
      alert("Upload failed. Try again.");
    } finally {
      setLoading(false);
      setFile(null);
    }
  };

  // Save uploaded image to DB
  const saveToDB = async (url) => {
    try {
      const upload = await fetch("/api/Profile", {
        body: JSON.stringify({ image: url, email: user.email }),
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const res = await upload.json();
      console.log("DB save response:", res);
    } catch (err) {
      console.error("DB save error:", err);
    }
  };

  return (
    <>
      <ToastContainer />

      <div className="min-h-screen bg-gray-50 flex justify-center py-6 px-4">
        <div className="w-full max-w-md md:max-w-3xl space-y-6">
          {/* Profile Card */}
          <div className="bg-white max-w-full rounded-xl shadow p-6 text-center relative">
            <div
              className="relative w-32 h-32 mx-auto rounded-full overflow-hidden group cursor-pointer"
              onClick={() => fileInputRef.current.click()}
            >
              <Image
                src={image || "/default-avatar.png"}
                alt="Profile Picture"
                fill
                className="object-cover object-right"
              />

              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <FaUserEdit className="text-white text-2xl" />
              </div>
              <input
                type="file"
                className="hidden"
                ref={fileInputRef}
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </div>

            {file && (
              <button
                onClick={handleUpload}
                disabled={loading}
                className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
              >
                {loading ? "Uploading..." : "Update Profile Picture"}
              </button>
            )}

            <h2 className="text-xl font-semibold mt-4">{user.name}</h2>
            <p className="text-gray-500 text-sm">@{user.email}</p>

            <div className="flex justify-around mt-6">
              <div>
                <p className="text-sm font-semibold">100,000</p>
                <p className="text-xs text-gray-500">Followers</p>
              </div>
              <div>
                <p className="text-sm font-semibold">4</p>
                <p className="text-xs text-gray-500">Following</p>
              </div>
              <div>
                <p className="text-sm font-semibold">2</p>
                <p className="text-xs text-gray-500">Articles</p>
              </div>
            </div>
          </div>

          {/* Activities */}
          <div className="bg-white rounded-xl shadow p-4 space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 border-b pb-2">
              Activities
            </h3>
            <div className="grid grid-cols-1 gap-3 text-center">
              <p
                onClick={async () => {
                  POTDGROQ();
                }}
                className="bg-green-600 text-white hover:cursor-pointer mx-54 rounded-xl p-3"
              >
                Get Your POTD for Today
              </p>
              <div className="bg-gray-50 rounded-lg p-2">
                <p className="text-xs text-gray-500">POTD Streak</p>
                <p className="text-sm font-semibold">--</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-2">
                <p className="text-xs text-gray-500">Overall Coding Score</p>
                <p className="text-sm font-semibold">--</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-2">
                <p className="text-xs text-gray-500">Total Solved</p>
                <p className="text-sm font-semibold">--</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-2">
                <p className="text-xs text-gray-500">Monthly Coding Score</p>
                <p className="text-sm font-semibold">--</p>
              </div>
            </div>
            <button className="w-full bg-green-600 text-white rounded-md py-2 text-sm font-medium hover:bg-green-700 transition">
              POTD ➤
            </button>
          </div>

          {/* Content */}
          <div className="bg-white rounded-xl shadow p-4 space-y-2">
            <h3 className="text-sm font-semibold text-gray-700 border-b pb-2">
              Content
            </h3>
            <div className="space-y-2">
              <div
                onClick={() => router.push("/Bookmarks")}
                className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 rounded-md px-3 py-2 cursor-pointer"
              >
                <div className="flex items-center gap-2 text-gray-700 text-sm">
                  <span className="text-green-600">
                    <FaBookmark />
                  </span>
                  Bookmarks
                </div>
                <span className="text-gray-400">›</span>
              </div>
              <div
                onClick={() => router.push("/MyCourses")}
                className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 rounded-md px-3 py-2 cursor-pointer"
              >
                <div className="flex items-center gap-2 text-gray-700 text-sm">
                  <span className="text-green-600">
                    <FaBook />{" "}
                  </span>
                  My Courses
                </div>
                <span className="text-gray-400">›</span>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-white rounded-xl shadow p-4 space-y-2">
            <h3 className="text-sm font-semibold text-gray-700 border-b pb-2">
              Preferences
            </h3>
            <div className="space-y-2">
              <a>
                <div
                  onClick={() => router.push("/Settings")}
                  className="flex my-2 items-center justify-between bg-gray-50 hover:bg-gray-100 rounded-md px-3 py-2 cursor-pointer"
                >
                  <div className="flex items-center gap-2 text-gray-700 text-sm">
                    <span className="text-green-600">
                      <FaCog />
                    </span>
                    Settings
                  </div>
                  <span className="text-gray-400">›</span>
                </div>
              </a>

              <div
                onClick={() => router.push("/About")}
                className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 rounded-md px-3 py-2 cursor-pointer"
              >
                <div className="flex items-center gap-2 text-gray-700 text-sm">
                  <span className="text-green-600">
                    <FaInfoCircle />
                  </span>
                  About Us
                </div>
                <span className="text-gray-400">›</span>
              </div>

              <div
                onClick={() => router.push("/Legal")}
                className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 rounded-md px-3 py-2 cursor-pointer"
              >
                <div className="flex items-center gap-2 text-gray-700 text-sm">
                  <span className="text-green-600">
                    <FaShieldAlt />
                  </span>
                  Legal Policy
                </div>
                <span className="text-gray-400">›</span>
              </div>

              <div
                onClick={() => router.push("/Feedback")}
                className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 rounded-md px-3 py-2 cursor-pointer"
              >
                <div className="flex items-center gap-2 text-gray-700 text-sm">
                  <span className="text-green-600">
                    <FaComment />
                  </span>
                  Feedback
                </div>
                <span className="text-gray-400">›</span>
              </div>

              <div
                onClick={() => {
                  toast.info("Logged Out Successfully", { autoClose: 1000 });
                  setTimeout(() => {
                    localStorage.removeItem("USER_TOKEN");
                    router.push("/auth/login");
                  }, 2000);
                }}
                className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 rounded-md px-3 py-2 cursor-pointer"
              >
                <div className="flex items-center gap-2 text-gray-700 text-sm">
                  <span className="text-red-500">
                    <FaSignOutAlt />
                  </span>
                  Logout
                </div>
                <span className="text-gray-400">›</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
