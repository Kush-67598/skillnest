"use client";

import Loader from "@/Components/Loader/loader";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("Profile");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);

  // profile state
  const [profileData, setProfileData] = useState({
    name: "",
    bio: "",
    username: "",
  });

  // password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // password visibility
  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  // fetch token from localStorage
  useEffect(() => {
    const t = localStorage.getItem("USER_TOKEN");
    if (!t) return;
    setToken(t);
  }, []);

  // fetch user if token exists
  useEffect(() => {
    if (!token) return;
    const getUser = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/User`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) {
          setUser(data);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
    getUser();
  }, [token]);

  // set profileData when user loaded
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name,
        bio: user.bio,
        username: user.username,
      });
    }
  }, [user]);

  // profile input change
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  // password input change
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  // toggle eye
  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // save profile
  const saveChanges = async () => {
    setLoading(true);
    try {
      const update_user = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/Update_User`,
        {
          method: "POST",
          body: JSON.stringify(profileData),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const res = await update_user.json();
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message || "Profile update failed");
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
    setLoading(false);
  };

  // update password
  const updatePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/ChangePassword`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword,
          }),
        }
      );
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        toast.error(data.message || "Password update failed");
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
    setLoading(false);
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <>
      {loading && <Loader />}
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
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Full Name
                    </label>
                    <input
                      onChange={handleProfileChange}
                      name="name"
                      type="text"
                      value={profileData.name}
                      className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-200"
                    />
                  </div>
                  {/* Email */}
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
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={profileData.username}
                      onChange={handleProfileChange}
                      className="w-full px-3 py-2 bg-gray-800 text-gray-300 rounded-md border border-gray-700"
                    />
                  </div>
                </div>
                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={profileData.bio}
                    onChange={handleProfileChange}
                    rows={4}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-200"
                  ></textarea>
                </div>
              </section>
            )}
            {activeTab === "Account" ? (
              !user.googleId ? (
                <section className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-300">
                    Account Settings
                  </h2>
                  {/* Change Password */}
                  <div className="pt-6 border-t border-gray-700 space-y-4">
                    <h3 className="text-lg font-semibold text-gray-300">
                      Change Password
                    </h3>

                    {/* Current Password */}
                    <div className="relative">
                      <label className="block text-gray-400 text-sm">
                        Current Password
                      </label>
                      <input
                        type={
                          showPassword.currentPassword ? "text" : "password"
                        }
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        placeholder="Enter current password"
                        className="w-full px-3 py-2 bg-gray-800 text-gray-300 rounded-md border border-gray-700 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          togglePasswordVisibility("currentPassword")
                        }
                        className="absolute right-3 top-8 text-gray-400 hover:text-gray-200"
                      >
                        {showPassword.currentPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>

                    {/* New Password */}
                    <div className="relative">
                      <label className="block text-gray-400 text-sm">
                        New Password
                      </label>
                      <input
                        type={showPassword.newPassword ? "text" : "password"}
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        placeholder="Enter new password"
                        className="w-full px-3 py-2 bg-gray-800 text-gray-300 rounded-md border border-gray-700 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("newPassword")}
                        className="absolute right-3 top-8 text-gray-400 hover:text-gray-200"
                      >
                        {showPassword.newPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>

                    {/* Confirm Password */}
                    <div className="relative">
                      <label className="block text-gray-400 text-sm">
                        Confirm New Password
                      </label>
                      <input
                        type={
                          showPassword.confirmPassword ? "text" : "password"
                        }
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        placeholder="Re-enter new password"
                        className="w-full px-3 py-2 bg-gray-800 text-gray-300 rounded-md border border-gray-700 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          togglePasswordVisibility("confirmPassword")
                        }
                        className="absolute right-3 top-8 text-gray-400 hover:text-gray-200"
                      >
                        {showPassword.confirmPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={updatePassword}
                        disabled={loading}
                        className="px-5 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition disabled:opacity-50"
                      >
                        {loading ? "Updating..." : "Update Password"}
                      </button>
                    </div>
                  </div>
                </section>
              ) : (
                <section className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-300">
                    Account Settings
                  </h2>
                  <div className="p-4 bg-gray-800 border border-gray-700 rounded-md">
                    <p className="text-gray-300 font-medium">
                      This account is linked with Google.
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      Your password and security settings are managed through
                      your Google account. To update them, please visit your
                      Google Account settings.
                    </p>
                  </div>
                </section>
              )
            ) : (
              ""
            )}
          </div>

          {/* Footer Buttons */}
          {activeTab === "Profile" && (
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-700">
              <button className="px-4 py-2 rounded-md border border-gray-600 text-gray-300 hover:bg-gray-700">
                Cancel
              </button>
              <button
                onClick={saveChanges}
                className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
