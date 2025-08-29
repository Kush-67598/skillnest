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

  const [file, setFile] = useState(null);
  const [image, setImage] = useState(user?.profileImg || null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const router = useRouter();

  const POTDGROQ = async () => {
    const response = await fetch("/api/Groq/POTDQuestion", { method: "POST" });
    const res = await response.json();
    const newData = {
      Question: res.data.Question,
      Answer: res.data.Answer,
      Difficulty: res.data.Difficulty,
    };
    setPOTDData(newData);
    await savePOTDToDb(newData);
  };

  const savePOTDToDb = async (newData) => {
    await fetch("/api/POTD", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("USER_TOKEN")}`,
      },
      method: "POST",
      body: JSON.stringify(newData),
    });
  };

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
      } else throw new Error("Cloudinary upload failed");
    } catch (err) {
      console.error(err);
      alert("Upload failed. Try again.");
    } finally {
      setLoading(false);
      setFile(null);
    }
  };

  const saveToDB = async (url) => {
    await fetch("/api/Profile", {
      body: JSON.stringify({ image: url, email: user.email }),
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
  };

  return (
    <>
      <ToastContainer />

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black flex justify-center py-8 px-4">
        <div className="w-full max-w-md md:max-w-3xl space-y-6">
          {/* Profile Card */}
          <div className="bg-gray-800/70 backdrop-blur-xl border border-gray-700 rounded-2xl shadow-xl p-6 text-center">
            <div
              className="relative w-32 h-32 mx-auto rounded-full overflow-hidden group cursor-pointer ring-4 ring-emerald-500/40"
              onClick={() => fileInputRef.current.click()}
            >
              <Image
                src={image || "/default-avatar.png"}
                alt="Profile Picture"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
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
                className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold shadow-md hover:bg-emerald-500 transition"
              >
                {loading ? "Uploading..." : "Update Profile Picture"}
              </button>
            )}

            <h2 className="text-xl font-bold text-white mt-4">{user.name}</h2>
            <p className="text-gray-400 text-sm">@{user.email}</p>

            <div className="flex justify-around mt-6 text-gray-300">
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
          <div className="bg-gray-800/70 backdrop-blur-xl border border-gray-700 rounded-2xl shadow-lg p-4 space-y-4">
            <h3 className="text-sm font-semibold text-gray-300 border-b border-gray-600 pb-2">
              Activities
            </h3>
            <div className="grid grid-cols-1 gap-3 text-center">
              <p
                onClick={async () => {
                  await POTDGROQ();
                  router.push("/POTD");
                }}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold cursor-pointer rounded-xl p-3 transition shadow-md"
              >
                Get Your POTD for Today
              </p>
              <div className="bg-gray-900 rounded-lg p-2 border border-gray-700">
                <p className="text-xs text-gray-400">POTD Streak</p>
                <p className="text-sm font-semibold text-white">--</p>
              </div>
              <div className="bg-gray-900 rounded-lg p-2 border border-gray-700">
                <p className="text-xs text-gray-400">Overall Coding Score</p>
                <p className="text-sm font-semibold text-white">--</p>
              </div>
              <div className="bg-gray-900 rounded-lg p-2 border border-gray-700">
                <p className="text-xs text-gray-400">Total Solved</p>
                <p className="text-sm font-semibold text-white">--</p>
              </div>
              <div className="bg-gray-900 rounded-lg p-2 border border-gray-700">
                <p className="text-xs text-gray-400">Monthly Coding Score</p>
                <p className="text-sm font-semibold text-white">--</p>
              </div>
            </div>
            <button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl py-2 text-sm font-medium shadow-md transition">
              POTD ➤
            </button>
          </div>

          {/* Content */}
          <div className="bg-gray-800/70 backdrop-blur-xl border border-gray-700 rounded-2xl shadow-lg p-4 space-y-2">
            <h3 className="text-sm font-semibold text-gray-300 border-b border-gray-600 pb-2">
              Content
            </h3>
            <div className="space-y-2">
              <div
                onClick={() => router.push("/Bookmarks")}
                className="flex items-center justify-between bg-gray-900 border border-gray-700 hover:bg-gray-700 rounded-md px-3 py-2 cursor-pointer text-gray-300"
              >
                <div className="flex items-center gap-2">
                  <span className="text-emerald-500">
                    <FaBookmark />
                  </span>
                  Bookmarks
                </div>
                <span className="text-gray-500">›</span>
              </div>
              <div
                onClick={() => router.push("/MyCourses")}
                className="flex items-center justify-between bg-gray-900 border border-gray-700 hover:bg-gray-700 rounded-md px-3 py-2 cursor-pointer text-gray-300"
              >
                <div className="flex items-center gap-2">
                  <span className="text-emerald-500">
                    <FaBook />
                  </span>
                  My Courses
                </div>
                <span className="text-gray-500">›</span>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-gray-800/70 backdrop-blur-xl border border-gray-700 rounded-2xl shadow-lg p-4 space-y-2">
            <h3 className="text-sm font-semibold text-gray-300 border-b border-gray-600 pb-2">
              Preferences
            </h3>
            <div className="space-y-2">
              <div
                onClick={() => router.push("/Settings")}
                className="flex items-center justify-between bg-gray-900 border border-gray-700 hover:bg-gray-700 rounded-md px-3 py-2 cursor-pointer text-gray-300"
              >
                <div className="flex items-center gap-2">
                  <span className="text-emerald-500">
                    <FaCog />
                  </span>
                  Settings
                </div>
                <span className="text-gray-500">›</span>
              </div>

              <div
                onClick={() => router.push("/About")}
                className="flex items-center justify-between bg-gray-900 border border-gray-700 hover:bg-gray-700 rounded-md px-3 py-2 cursor-pointer text-gray-300"
              >
                <div className="flex items-center gap-2">
                  <span className="text-emerald-500">
                    <FaInfoCircle />
                  </span>
                  About Us
                </div>
                <span className="text-gray-500">›</span>
              </div>

              <div
                onClick={() => router.push("/Legal")}
                className="flex items-center justify-between bg-gray-900 border border-gray-700 hover:bg-gray-700 rounded-md px-3 py-2 cursor-pointer text-gray-300"
              >
                <div className="flex items-center gap-2">
                  <span className="text-emerald-500">
                    <FaShieldAlt />
                  </span>
                  Legal Policy
                </div>
                <span className="text-gray-500">›</span>
              </div>

              <div
                onClick={() => router.push("/Feedback")}
                className="flex items-center justify-between bg-gray-900 border border-gray-700 hover:bg-gray-700 rounded-md px-3 py-2 cursor-pointer text-gray-300"
              >
                <div className="flex items-center gap-2">
                  <span className="text-emerald-500">
                    <FaComment />
                  </span>
                  Feedback
                </div>
                <span className="text-gray-500">›</span>
              </div>

              <div
                onClick={() => {
                  toast.info("Logged Out Successfully", { autoClose: 1000 });
                  setTimeout(() => {
                    localStorage.removeItem("USER_TOKEN");
                    router.push("/auth/login");
                  }, 2000);
                }}
                className="flex items-center justify-between bg-gray-900 border border-gray-700 hover:bg-gray-700 rounded-md px-3 py-2 cursor-pointer text-red-400"
              >
                <div className="flex items-center gap-2">
                  <FaSignOutAlt />
                  Logout
                </div>
                <span className="text-gray-500">›</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
