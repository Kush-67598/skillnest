"use client";

import { useState, useEffect } from "react";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("Profile");
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [profileData, setProfileData] = useState({
    name: "",
    bio: "",
    username: "",
  });

  const saveChanges = async () => {
    const update_user = await fetch(`${process.env.NEXT_PUBLIC_API}/api/Update_User`, {
      method: "POST",
      body: JSON.stringify({
        name: profileData.name,
        bio: profileData.bio,
        username: profileData.username,
      }),
    });
    const res = await update_user.json();
  };
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name,
        bio: user.bio,
        username: user.username,
      });
    }
  }, [user]);

  useEffect(() => {
    const token = localStorage.getItem("USER_TOKEN");
    if (!token) return;
    setToken(token);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (!token) return;
    const getUser = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/User`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) setUser(data);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
    getUser();
  }, [token]);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-900 text-gray-200 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-3xl bg-gray-800 rounded-2xl shadow-lg p-8 space-y-8">
        {/* Header */}
        <h1 className="text-3xl font-bold text-center text-indigo-400">
          Settings
        </h1>

        {/* Tabs */}
        <div className="flex justify-center gap-4 border-b border-gray-700 pb-2">
          {["Profile", "Account"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-t-md text-sm font-medium transition ${
                activeTab === tab
                  ? "bg-indigo-600 text-white"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="pt-6">
          {activeTab === "Profile" && (
            <section className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-300">
                Profile Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Full Name
                  </label>
                  <input
                    onChange={handleChange}
                    name="name"
                    type="text"
                    value={profileData.name}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Email (read-only)
                  </label>
                  <input
                    type="email"
                    defaultValue={user.email}
                    readOnly
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-gray-400 cursor-not-allowed"
                  />
                </div>
                {/* Username */}
                <div className="space-y-2">
                  <label className="block text-gray-400 text-sm">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={profileData.username}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-800 text-gray-300 rounded-md border border-gray-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={profileData.bio}
                  onChange={handleChange}
                  rows={4}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-200"
                ></textarea>
              </div>
            </section>
          )}

          {/* {activeTab === "Privacy" && (
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-300">
                Privacy Settings
              </h2>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="publicProfile"
                  className="h-4 w-4 text-indigo-500 bg-gray-700 border-gray-600"
                />
                <label
                  htmlFor="publicProfile"
                  className="ml-2 text-gray-300 text-sm"
                >
                  Make my profile public
                </label>
              </div>
            </section>
          )} */}

          {activeTab === "Account" && (
            <section className="space-y-6">
              {/* Change Password */}
              <div className="pt-8 border-t border-gray-700 space-y-4">
                <h3 className="text-lg font-semibold text-gray-300">
                  Change Password
                </h3>

                <div className="space-y-2">
                  <label className="block text-gray-400 text-sm">
                    Current Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter current password"
                    className="w-full px-3 py-2 bg-gray-800 text-gray-300 rounded-md border border-gray-700"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-gray-400 text-sm">
                    New Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter new password"
                    className="w-full px-3 py-2 bg-gray-800 text-gray-300 rounded-md border border-gray-700"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-gray-400 text-sm">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    placeholder="Re-enter new password"
                    className="w-full px-3 py-2 bg-gray-800 text-gray-300 rounded-md border border-gray-700"
                  />
                </div>

                <div className="flex justify-end">
                  <button className="px-5 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition">
                    Update Password
                  </button>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-4 pt-6 border-t border-gray-700">
          <button className="px-4 py-2 rounded-md border border-gray-600 text-gray-300 hover:bg-gray-700">
            Cancel
          </button>
          <button
            onClick={() => saveChanges()}
            className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
