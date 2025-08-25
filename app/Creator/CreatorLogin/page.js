"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";

export default function CreatorLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loginCreator = await fetch(
      `${process.env.NEXT_PUBLIC_API}/api/CreatorAuth/Login`,
      { method: "POST", body: JSON.stringify({ email, password }) }
    );
    const res = await loginCreator.json();
    localStorage.setItem("Token", res.token);
    if (res.success) {
      toast.success("Successfully Logged In", {
        autoClose: 1000,
        hideProgressBar: true,
      });
      router.push("/Creator/panel/View");
    } else if (res.user == false) {
      toast.error("User Not Found", {
        autoClose: 1000,
        hideProgressBar: true,
      });
    } else {
      toast.error("Invalid Credentials", {
        autoClose: 1000,
        hideProgressBar: true,
      });
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow p-8 space-y-6">
          <h1 className="text-2xl font-bold text-center text-gray-900">
            Creator Login
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                value={email}
                type="email"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                name="email"
                placeholder="you@example.com"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                value={password}
                type="password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                name="password"
                placeholder="********"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-md hover:bg-indigo-700 transition"
            >
              Log In
            </button>
          </form>

          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <a
              href="/Creator/CreatorSignup"
              className="text-indigo-600 hover:underline"
            >
              Signup
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
