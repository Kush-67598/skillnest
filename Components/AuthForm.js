"use client";

import { useRouter } from "next/navigation";
import Script from "next/script";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

export default function AuthForm({ type }) {
  const [token, setToken] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("USER_TOKEN");

    if (token) {
      router.replace("/");
    } else {
      return;
    }
  }, []);
  useEffect(() => {
    window.google_response = async (response) => {
      const repsonse_GOOGLE = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/Auth/Google`,
        {
          method: "POST",
          body: new URLSearchParams({ credential: response.credential }), //this comes from click of signin with google button and google send the object to this callback function which res recieves
        }
      );
      const res = await repsonse_GOOGLE.json();
      if (res.success) {
        toast.success("Redirecting to Homepage", { autoClose: 1000 });
        if (res.token) {
          setToken(token);
          localStorage.setItem("USER_TOKEN", res.token);
          setTimeout(() => {
            router.push("/");
          }, 2000);
        }
      }
    };
  }, []);

  const formSubmit = async (e) => {
    e.preventDefault();
    try {
      if (type == "login") {
        const data = await fetch(
          `${process.env.NEXT_PUBLIC_API}/api/Auth/Login`,
          {
            method: "POST",
            body: JSON.stringify({ email, password }),
          }
        );
        const res = await data.json();
        if (res.success) {
          localStorage.setItem("USER_TOKEN", res.token);

          toast.success("Successfully Logged In", {
            autoClose: 1000,
            hideProgressBar: true,
          });
          router.push("/");
        } else if (res.user == false) {
          toast.error("User Not Found", {
            autoClose: 1000,
            hideProgressBar: true,
          });
        } else {
          toast.error("Invalid Credentials", {
            icon: "",
            autoClose: 1000,
            hideProgressBar: true,
          });
        }
      } else {
        const data = await fetch(
          `${process.env.NEXT_PUBLIC_API}/api/Auth/Signup`,
          {
            method: "POST",
            body: JSON.stringify({ name, email, password }),
          }
        );
        const res = await data.json();
        if (res.success) {
          toast.success("Account Created Successfully", {
            autoClose: 1000,
            hideProgressBar: true,
          });
          router.push("/auth/login");
        } else if (res.exists) {
          toast.warning("User Already Exists", {
            autoClose: 1000,
            hideProgressBar: true,
            hideProgressBar: true,
          });
        }
      }
    } catch (err) {
      toast.error("Internal Server Error", {
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
      {!token ? (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-purple-200 p-4">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 space-y-6">
            <h1 className="text-3xl font-bold text-center text-gray-800">
              {type === "login" ? "Welcome Back" : "Create Account"}
            </h1>

            <form onSubmit={formSubmit} className="flex flex-col gap-5">
              {type == "signup" && (
                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                />
              )}

              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              />

              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 transition font-medium"
              >
                {type === "login" ? "Login" : "Sign Up"}
              </button>
            </form>

            <div className="flex flex-col items-center gap-4">
              <p className="text-gray-500 font-medium">or continue with</p>
              {/* Google Login */}
              <div className="w-full flex justify-center">
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
                  // data-login_uri="http://localhost:3000/api/Auth/Google"
                  data-auto_prompt="false"
                />
                <div className="g_id_signin" data-type="standard"></div>
              </div>
            </div>

            <div className="flex justify-center items-center gap-2 text-sm mt-2">
              <p className="text-gray-600">
                {type === "login"
                  ? "Don't have an account?"
                  : "Already have an account?"}
              </p>
              <a
                href={`${type === "login" ? "/auth/signup" : "/auth/login"}`}
                className="text-purple-600 hover:underline font-medium"
              >
                {type === "login" ? "Sign Up" : "Login"}
              </a>
            </div>
            <button
              className="text-white bg-black rounded-xl p-3"
              onClick={() => router.push("/ResetPassword")}
            >
              Reset Password
            </button>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
}
