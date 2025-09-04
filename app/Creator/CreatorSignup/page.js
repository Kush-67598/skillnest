"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import Script from "next/script";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

export default function CreatorSignup() {
  const router = useRouter();
  const [name, setName] = useState("");
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
      const signupCreator = await fetch("/api/CreatorAuth/Signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const res = await signupCreator.json();
      setLoading(false);

      if (res.success) {
        toast.success("Account Created Successfully", {
          autoClose: 1200,
          pauseOnHover: false,
          hideProgressBar: true,
        });
        router.push("/Creator/CreatorLogin");
      } else if (res.exists) {
        toast.warning("User Already Exists", {
          autoClose: 1200,
          pauseOnHover: false,
          hideProgressBar: true,
        });
      } else {
        toast.error(res.message || "Something went wrong", {
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
      <div className="-mt-20 min-h-screen flex items-center justify-center bg-gradient-to-br  px-4">
        {" "}
        <div className="w-full max-w-5xl bg-gradient-to-br  via-indigo-900/90 to-purple-800/90 backdrop-blur-2xl border border-white/20 rounded-3xl  p-10 md:p-12 text-white relative">
          {/* Title */}
          <h2 className="text-4xl font-extrabold text-center mb-4 tracking-wide drop-shadow-lg">
            Creator Sign Up 🚀
          </h2>
          <p className="text-gray-300 text-center mb-10 text-lg">
            Join as a Creator and start sharing your content with the world.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="px-5 py-3.5 bg-white/10 text-white placeholder-gray-400 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="px-5 py-3.5 bg-white/10 text-white placeholder-gray-400 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            />

            {/* Password Input */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="px-5 py-3.5 bg-white/10 text-white placeholder-gray-400 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 w-full transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 rounded-xl font-semibold text-lg transition-all shadow-md ${
                loading
                  ? "bg-purple-400 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700 active:scale-95"
              }`}
            >
              {loading ? "Creating..." : "Sign Up"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-8">
            <div className="flex-1 h-px bg-white/20"></div>
            <p className="px-4 text-sm text-gray-400">or continue with</p>
            <div className="flex-1 h-px bg-white/20"></div>
          </div>

          {/* Google Login */}
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

          {/* Footer Links */}
          <div className="flex flex-col justify-center items-center gap-4 mt-8 text-sm text-gray-300">
            <p>
              Already have a Creator account?{" "}
              <a
                href="/Creator/CreatorLogin"
                className="text-purple-400 hover:text-purple-300 font-medium transition"
              >
                Log In
              </a>
            </p>
            <p>
              Are you a learner?{" "}
              <a
                href="/auth/login"
                className="text-purple-400 hover:text-purple-300 font-medium transition"
              >
                User Login
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
