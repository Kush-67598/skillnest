"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import Script from "next/script";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

export default function CreatorLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    window.google_response = async (response) => {
      try {
        const res = await fetch("/api/Auth/Google", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            credential: response.credential,
            type: "creator",
          }),
        });

        const data = await res.json();

        if (data.success) {
          localStorage.setItem("Token", data.token);
          toast.success("Logged in with Google!", {
            autoClose: 1200,
            pauseOnHover: false,
            hideProgressBar: true,
          });
          router.push("/Creator/panel/View");
        } else {
          toast.error(data.error || "Google signup failed", {
            autoClose: 1500,
            pauseOnHover: false,
            hideProgressBar: true,
          });
        }
      } catch (err) {
        toast.error("Something went wrong", {
          autoClose: 1500,
          pauseOnHover: false,
          hideProgressBar: true,
        });
      }
    };
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const loginCreator = await fetch("/api/CreatorAuth/Login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const res = await loginCreator.json();
      setLoading(false);

      if (res.success) {
        localStorage.setItem("Token", res.token);
        toast.success("Successfully Logged In!", {
          autoClose: 1200,
          pauseOnHover: false,
          hideProgressBar: true,
        });
        router.push("/Creator/panel/View");
      } else {
        toast.error(res.message || "Login failed", {
          autoClose: 1200,
          pauseOnHover: false,
          hideProgressBar: true,
        });
      }
    } catch (err) {
      setLoading(false);
      toast.error("Internal Server Error", {
        autoClose: 1200,
        pauseOnHover: false,
        hideProgressBar: true,
      });
    }
  };

  return (
    <>
      <ToastContainer position="top-right" theme="dark" />

      <div className="-mt-30 min-h-screen flex items-center justify-center bg-gradient-to-br  px-4">
        <div className="w-full max-w-5xl bg-gradient-to-br  to-indigo-800/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8 text-white">
          <h2 className="text-3xl font-bold text-center mb-4">Creator Login</h2>
          <p className="text-gray-300 text-center mb-6">
            Log in to your Creator account.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="px-4 py-3 bg-white/10 text-white placeholder-gray-400 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

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
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-semibold transition ${
                loading
                  ? "bg-purple-400 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700"
              }`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-white/20"></div>
            <p className="px-3 text-sm text-gray-400">or continue with</p>
            <div className="flex-1 h-px bg-white/20"></div>
          </div>

          <div className="flex justify-center">
            <Script src="https://accounts.google.com/gsi/client" async defer />
            <div
              id="g_id_onload"
              data-client_id={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
              data-context="signup"
              data-ux_mode="popup"
              data-callback="google_response"
            />
            <div className="g_id_signin" data-type="standard"></div>
          </div>

          <div className="flex flex-col justify-center items-center gap-4 mt-6 text-sm text-gray-300">
            <p>
              New Creator account?{" "}
              <a
                href="/Creator/CreatorSignup"
                className="text-purple-400 hover:underline font-medium"
              >
                Signup
              </a>
            </p>
            <p>
              Are you a learner?{" "}
              <a
                href="/auth/signup"
                className="text-purple-400 hover:underline font-medium"
              >
                User Signup
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
