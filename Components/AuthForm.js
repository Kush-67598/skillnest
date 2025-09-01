"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Script from "next/script";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

export default function AuthForm({ type }) {
  const [token, setToken] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // ✅ password toggle
  const router = useRouter();

  useEffect(() => {
    window.google_response = async (response) => {
      try {
        const res = await fetch("/api/Auth/Google", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({ credential: response.credential }),
        });

        const data = await res.json();

        if (data.success) {
          localStorage.setItem("USER_TOKEN", data.token);
          toast.success("Logged in with Google!", { autoClose: 1200 });
          router.push("/");
        } else {
          toast.error(data.error || "Google login failed");
        }
      } catch (err) {
        toast.error("Something went wrong");
      }
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("USER_TOKEN");
    if (token) {
      router.replace("/");
    }
  }, []);

  const formSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint =
        type === "login"
          ? `${process.env.NEXT_PUBLIC_API}/api/Auth/Login`
          : `${process.env.NEXT_PUBLIC_API}/api/Auth/Signup`;

      const body =
        type === "login"
          ? JSON.stringify({ email, password })
          : JSON.stringify({ name, email, password });

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      });
      const res = await response.json();

      if (res.success) {
        if (type === "login") {
          localStorage.setItem("USER_TOKEN", res.token);
          toast.success("Successfully Logged In", { autoClose: 1200 });
          router.push("/");
        } else {
          toast.success("Account Created Successfully", { autoClose: 1200 });
          router.push("/auth/login");
        }
      } else {
        toast.error(res.message || "Something went wrong", { autoClose: 1200 });
      }
    } catch (err) {
      toast.error("Internal Server Error", { autoClose: 1200 });
    }
  };

  return (
    <>
      <ToastContainer position="top-right" theme="dark" />

      {!token ? (
        <div className="min-h-screen w-full -my-20 flex items-center justify-center bg-gradient-to-br">
          <div className="w-full max-w-7xl bg-gradient-to-br from-purple-900 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-10 text-white">
            <h2 className="text-4xl font-bold text-center mb-6">
              {type === "login" ? "Welcome Back 👋" : "Create an Account 🚀"}
            </h2>
            <p className="text-gray-300 text-center mb-8">
              {type === "login"
                ? "Log in to continue your journey."
                : "Join us and explore new opportunities."}
            </p>

            <form onSubmit={formSubmit} className="flex flex-col gap-5">
              {type === "signup" && (
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="px-4 py-3 bg-white/10 text-white placeholder-gray-400 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              )}

              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="px-4 py-3 bg-white/10 text-white placeholder-gray-400 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />

              {/* Password Input with Toggle */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="px-4 py-3 bg-white/10 text-white placeholder-gray-400 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}{" "}
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition"
              >
                {type === "login" ? "Login" : "Sign Up"}
              </button>
            </form>

            <div className="flex items-center my-6">
              <div className="flex-1 h-px bg-white/20"></div>
              <p className="px-3 text-sm text-gray-400">or continue with</p>
              <div className="flex-1 h-px bg-white/20"></div>
            </div>

            <div className="flex justify-center">
              <Script
                src="https://accounts.google.com/gsi/client"
                async
                defer
              />
              <div
                id="g_id_onload"
                data-client_id={process.env.NEXT_PUBLIC_CLIENT_ID}
                data-context="signin"
                data-ux_mode="popup"
                data-callback="google_response"
              />
              <div className="g_id_signin" data-type="standard"></div>
            </div>

            <div className="flex justify-center gap-2 text-sm mt-6 text-gray-300">
              <p>
                {type === "login"
                  ? "Don’t have an account?"
                  : "Already have an account?"}
              </p>
              <Link
                href={`${type === "login" ? "/auth/signup" : "/auth/login"}`}
                className="text-purple-400 hover:underline font-medium"
              >
                {type === "login" ? "Sign Up" : "Login"}
              </Link>
            </div>

            {type === "login" && (
              <button
                className="mt-6 w-full bg-white/10 text-white border border-white/20 rounded-lg py-3 hover:bg-white/20 transition"
                onClick={() => router.push("/ResetPassword")}
              >
                Reset Password
              </button>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
