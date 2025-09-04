"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
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
import { usePathname, useRouter } from "next/navigation";
import Loader from "./Loader/loader";
import useCheckView from "@/Hooks/useCheckView";

export default function ProfilePage({ user }) {
  const [POTDData, setPOTDData] = useState({
    Question: "",
    Answer: "",
    Difficulty: "",
  });
  const isMobile = useCheckView();
  const pathname = usePathname();
  const Profile = pathname.includes("/Profile");
  const [UserData, setUserData] = useState({});
  const [pro, setIsPro] = useState({});
  useEffect(() => {
    const userFetch = async () => {
      if (!localStorage.getItem("USER_TOKEN")) return; // avoid bad fetch
      const response = await fetch("/api/User", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("USER_TOKEN")}`,
        },
      });
      const res = await response.json();

      setUserData(res.POTD);
      setIsPro(res.pro);
    };
    userFetch();
  }, []);

  const [file, setFile] = useState(null);
  const [image, setImage] = useState(user?.profileImg || null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const router = useRouter();

  const POTDGROQ = async () => {
    setLoading(true);
    const response = await fetch("/api/Groq/POTDQuestion", { method: "POST" });
    const res = await response.json();
    setLoading(false);
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
  const messages = [
    "Excited for Question 🥳. Coming just in time!",
    "Sharpen your brain! 🧠 Loading...",
    "Your daily challenge awaits… ⏳",
    "Get ready! A new question is on its way… 🚀",
  ];

  return (
    <>
      {loading && (
        <Loader
          message={
            file
              ? "Uploading Profile Picture"
              : messages[Math.floor(Math.random() * messages.length)]
          }
        />
      )}
      <ToastContainer />

      <div className={`min-h-screen ${isMobile && Profile ?'-mt-20':''} bg-gradient-to-tr from-gray-950 via-gray-900 to-black text-white px-6 py-10 flex justify-center`}>
        <div className="w-full max-w-5xl grid md:grid-cols-3 gap-8">
          {/* Left Profile Section */}
          <div className="bg-gray-800/60 border border-gray-700 rounded-2xl shadow-lg p-6 flex flex-col items-center text-center space-y-4">
            <div
              className="relative w-32 h-32 rounded-full overflow-hidden ring-4 ring-purple-500/50 cursor-pointer group"
              onClick={() => fileInputRef.current.click()}
            >
              <Image
                src={image || "/default-avatar.png"}
                alt="Profile Picture"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                <FaUserEdit className="text-white text-2xl" />
              </div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </div>
            <div
              className={`px-3 py-1 text-xs font-semibold rounded-full ${
                pro ? "bg-yellow-500 text-black" : "bg-green-600 text-white"
              }`}
            >
              {pro ? "PRO" : "FREE"}
            </div>

            {file && (
              <button
                onClick={handleUpload}
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 transition text-sm font-medium"
              >
                {loading ? "Uploading..." : "Update Picture"}
              </button>
            )}

            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-gray-400 text-sm">@{user.email}</p>

            <div className="w-full mt-6 space-y-2">
              <button
                onClick={async () => {
                  await POTDGROQ();
                  router.push("/POTD");
                }}
                className="w-full py-2 rounded-lg bg-gradient-to-r from-purple-950 to-purple-700 hover:from-purple-900 hover:to-purple-700 transition font-semibold"
              >
                Daily Challenge ➤
              </button>
            </div>
          </div>

          {/* Middle - Stats */}
          <div className="md:col-span-2 space-y-8">
            <div className="bg-gray-800/60 border border-gray-700 rounded-2xl shadow-lg p-6">
              <h3 className="text-sm font-semibold text-gray-300 mb-4">
                Your Progress
              </h3>

              {UserData.length > 0 ? (
                UserData.map((POTD, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-6"
                  >
                    <div className="bg-gray-900 rounded-2xl p-4 border border-gray-700 shadow-md hover:border-purple-500 transition">
                      <p className="text-xs text-gray-400">🔥 Streak</p>
                      <p className="text-xl font-bold mt-2">
                        {POTD.POTDStreak}
                      </p>
                    </div>

                    <div className="bg-gray-900 rounded-2xl p-4 border border-gray-700 shadow-md hover:border-indigo-500 transition">
                      <p className="text-xs text-gray-400">💻 Coding Score</p>
                      <p className="text-xl font-bold mt-2">
                        {POTD.OverallCodingScore}
                      </p>
                    </div>

                    <div className="bg-gray-900 rounded-2xl p-4 border border-gray-700 shadow-md hover:border-yellow-500 transition">
                      <p className="text-xs text-gray-400">✅ Total Solved</p>
                      <p className="text-xl font-bold mt-2">
                        {POTD.TotalSolved}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-white text-sm">No progress yet...</p>
              )}
            </div>

            {/* Content Section */}
            <div className="bg-gray-800/60 border border-gray-700 rounded-2xl shadow-lg p-6 space-y-4">
              <h3 className="text-sm font-semibold text-gray-300">Content</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  onClick={() => router.push("/Bookmarks")}
                  className="flex items-center justify-between bg-gray-900 border border-gray-700 hover:bg-gray-700 rounded-xl px-4 py-3 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <FaBookmark className="text-purple-500" /> Bookmarks
                  </div>
                  <span className="text-gray-500">›</span>
                </div>

                <div
                  onClick={() => router.push("/MyCourses")}
                  className="flex items-center justify-between bg-gray-900 border border-gray-700 hover:bg-gray-700 rounded-xl px-4 py-3 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <FaBook className="text-purple-500" /> My Courses
                  </div>
                  <span className="text-gray-500">›</span>
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div className="bg-gray-800/60 border border-gray-700 rounded-2xl shadow-lg p-6 space-y-4">
              <h3 className="text-sm font-semibold text-gray-300">
                Preferences
              </h3>
              <div className="space-y-3">
                <div
                  onClick={() => router.push("/Settings")}
                  className="flex items-center justify-between bg-gray-900 hover:bg-gray-700 border border-gray-700 rounded-xl px-4 py-3 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <FaCog className="text-purple-500" /> Settings
                  </div>
                  <span className="text-gray-500">›</span>
                </div>

                <div
                  onClick={() => router.push("/About")}
                  className="flex items-center justify-between bg-gray-900 hover:bg-gray-700 border border-gray-700 rounded-xl px-4 py-3 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <FaInfoCircle className="text-purple-500" /> About Us
                  </div>
                  <span className="text-gray-500">›</span>
                </div>

                <div
                  onClick={() => router.push("/Legal")}
                  className="flex items-center justify-between bg-gray-900 hover:bg-gray-700 border border-gray-700 rounded-xl px-4 py-3 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <FaShieldAlt className="text-purple-500" /> Legal Policy
                  </div>
                  <span className="text-gray-500">›</span>
                </div>

                <div
                  onClick={() => router.push("/Feedback")}
                  className="flex items-center justify-between bg-gray-900 hover:bg-gray-700 border border-gray-700 rounded-xl px-4 py-3 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <FaComment className="text-purple-500" /> Feedback
                  </div>
                  <span className="text-gray-500">›</span>
                </div>

                <div
                  onClick={() => {
                    toast.info("Logged Out Successfully", { autoClose: 1000 });
                    setTimeout(() => {
                      localStorage.removeItem("USER_TOKEN");

                      router.push("/auth/login");
                    }, 1000);
                  }}
                  className="flex items-center justify-between bg-gray-900 hover:bg-gray-700 border border-gray-700 rounded-xl px-4 py-3 cursor-pointer text-red-400"
                >
                  <div className="flex items-center gap-2">
                    <FaSignOutAlt /> Logout
                  </div>
                  <span className="text-gray-500">›</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
