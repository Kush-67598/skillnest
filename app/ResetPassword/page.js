"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Loader from "@/Components/Loader/loader";

const Passwordreset = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [starttimer, setStarttimer] = useState(false);
  const [email, setEmail] = useState("");
  const [seconds, setSeconds] = useState(180);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [last, setLast] = useState(false);
  const [active, setActive] = useState(true);
  const [initialPass, setIntialPass] = useState("");
  const [finalPass, setFinalPass] = useState("");
  const router = useRouter();

  useEffect(() => {
    let timer;
    if (starttimer) {
      timer = setInterval(() => {
        setSeconds((time) => {
          if (time <= 1) {
            clearInterval(timer);
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [starttimer]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Email field is required");
    } else {
      setLoading(true);
      const handleReset = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "Application/json" },
          body: JSON.stringify({ email }),
        }
      );
      let response = await handleReset.json();
      setLoading(false);
      if (response.success) {
        setStarttimer(true);
        setActive(false);
      } else if (response.found == false) {
        toast.error("Email Address Not found");
      }
    }
  };

  const handle_verify_otp = async (e) => {
    e.preventDefault();
    if (otp.length == 0) {
      toast.error("Otp Cant be Empty");
    } else {
      setLoading(true);
      const verify = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/verifyotp`,
        {
          method: "POST",
          headers: { "Content-Type": "Application/json" },
          body: JSON.stringify({ otp, email }),
        }
      );
      const response = await verify.json();
      setLoading(false);
      if (response.success) {
        toast.success("OTP verified Successfully");
        setLast(true);
        setOtp("");
      } else {
        toast.error("Entered Wrong OTP");
      }
    }
  };

  const password_Change = async (e) => {
    e.preventDefault();
    if (!initialPass || !finalPass) {
      toast.info("Password Field is Required");
      return;
    } else if (initialPass != finalPass) {
      toast.error("Passwords Dont match");
      return;
    } else {
      setLoading(true);
      const pass_change = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/changePassotp`,
        {
          method: "POST",
          headers: { "Content-Type": "Application/json" },
          body: JSON.stringify({ email, finalPass }),
        }
      );
      const response = await pass_change.json();
      setLoading(false);
      if (response.success) {
        toast.success("Password Changed Successfully... Redirecting...");
        setIntialPass("");
        setFinalPass("");
        setTimeout(() => {
          router.push("/auth/login");
        }, 2000);
      } else {
        toast.error("Internal Server Error");
      }
    }
  };

  return (
    <>
      <ToastContainer />
      {loading && <Loader />}
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 relative">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

        <div className="relative z-10 w-full max-w-md bg-gray-900/90 backdrop-blur-xl p-8 rounded-2xl shadow-[0_0_20px_rgba(0,255,128,0.3)] border border-gray-700">
          {/* Step 1: Email */}
          {active && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <h1 className="text-3xl font-bold text-green-400 text-center drop-shadow-lg">
                Reset Password
              </h1>
              <input
                type="email"
                className="w-full px-4 py-3 rounded-lg bg-gray-800 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your Email Address"
              />
              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-black font-semibold hover:opacity-90 transition shadow-[0_0_10px_rgba(0,255,128,0.5)]"
              >
                Submit
              </button>
            </form>
          )}

          {/* Step 2: OTP */}
          {!active && !last && (
            <form onSubmit={handle_verify_otp} className="space-y-6">
              <h1 className="text-3xl font-bold text-cyan-400 text-center drop-shadow-lg">
                Enter OTP
              </h1>
              <input
                type="text"
                disabled={seconds === 0}
                className={`w-full px-4 py-3 rounded-lg bg-gray-800 text-gray-100 placeholder-gray-500 focus:outline-none ${
                  seconds === 0 ? "opacity-50 cursor-not-allowed" : "focus:ring-2 focus:ring-cyan-500"
                }`}
                placeholder="Enter the OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <p className="text-sm text-gray-300 text-center">
                OTP sent to <span className="text-green-400">{email}</span>
                <br />
                Valid for{" "}
                <b className="text-red-400">{seconds} seconds</b>
              </p>
              {seconds == 0 && (
                <p className="text-sm text-red-400 text-center">OTP expired</p>
              )}
              <button
                disabled={seconds == 0}
                className={`w-full py-3 rounded-lg font-semibold text-black transition ${
                  seconds == 0
                    ? "cursor-not-allowed bg-gray-600"
                    : "bg-gradient-to-r from-cyan-500 to-blue-600 shadow-[0_0_10px_rgba(0,255,255,0.5)] hover:opacity-90"
                }`}
              >
                Verify OTP
              </button>
            </form>
          )}

          {/* Step 3: Change Password */}
          {last && (
            <form onSubmit={password_Change} className="space-y-6">
              <h1 className="text-3xl font-bold text-purple-400 text-center drop-shadow-lg">
                Change Password
              </h1>
              <input
                type={showPassword ? "text" : "password"}
                className="w-full px-4 py-3 rounded-lg bg-gray-800 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter New Password"
                value={initialPass}
                onChange={(e) => setIntialPass(e.target.value)}
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Confirm New Password"
                  value={finalPass}
                  onChange={(e) => setFinalPass(e.target.value)}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3 cursor-pointer text-gray-400"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              <button className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-600 text-black font-semibold hover:opacity-90 transition shadow-[0_0_10px_rgba(255,0,255,0.5)]">
                Change Password
              </button>
            </form>
          )}
        </div>
      </main>
    </>
  );
};

export default Passwordreset;
