"use client";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Confetti from "react-confetti";

const PricingSection = () => {
  const [isPro, setIsPro] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleClaimPro = async () => {
    try {
      const res = await fetch("/api/User", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("USER_TOKEN")}`,
        },
      });

      const data = await res.json();
      if (data.success) {
        setIsPro(true);
        setShowConfetti(true);
        toast.success("🎉 You’ve unlocked SkillNest Pro!");
        setTimeout(() => setShowConfetti(false), 4000);
      } else {
        toast.error(data.message || "Failed to upgrade");
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    const getClaimStatus = async () => {
      try {
        const res = await fetch("/api/User", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("USER_TOKEN")}`,
          },
        });

        const data = await res.json();
        if (data.success) {
          if (data.pro == true) {
            setIsPro(true);
          }
        } else {
          toast.error(data.message || "Failed to upgrade");
        }
      } catch (err) {
        toast.error("Something went wrong");
      }
    };
    getClaimStatus();
  }, []);

  return (
    <section id="pricing" className="max-w-5xl mx-auto my-16 px-4">
      {showConfetti && <Confetti recycle={false} numberOfPieces={300} />}
      <h2 className="text-3xl md:text-4xl text-center mb-4">
        Unlock More with{" "}
        <span className="text-teal-500 font-bold">SkillNest Pro</span>
      </h2>
      <p className="text-center mb-8 text-gray-300">
        Gain access to premium courses, AI tools, and exclusive community
        features.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Free Plan */}
        <div className="border border-gray-600 rounded-xl bg-black/30 backdrop-blur-md p-6 flex flex-col">
          <h3 className="text-xl font-semibold mb-4">Free</h3>
          <ul className="space-y-2 mb-6 text-gray-300">
            <li>✅ Access to free community courses</li>
            <li>✅ Join community discussions</li>
            <li>✅ View course reviews</li>
          </ul>
          <div className="mt-auto">
            <span className="text-2xl font-bold">₹0</span>
          </div>
        </div>

        {/* Pro Plan */}
        <div className="border border-indigo-500 rounded-xl bg-gradient-to-b from-indigo-800/40 to-black/30 backdrop-blur-md p-6 flex flex-col relative overflow-hidden">
          <h3 className="text-xl font-semibold mb-2">Pro</h3>
          <span className="text-sm text-yellow-400 font-semibold mb-4 animate-pulse">
            🎉 Limited-Time Free Offer!
          </span>
          <ul className="space-y-2 mb-6 text-gray-100">
            <li>🔥 Premium & advanced courses</li>
            <li>🧠 AI Summarizer & Code Helper</li>
            <li>🎓 Certificates & badges</li>
            <li>📦 Exclusive projects & templates</li>
          </ul>
          <div className="mt-auto">
            <p className="mb-2 text-gray-300 text-sm">
              <span className="line-through text-red-400">₹499 / month</span>{" "}
              <span className="font-bold text-green-400">Now Free 🎁</span>
            </p>
            <button
              onClick={async () => {
                await handleClaimPro();
              }}
              disabled={isPro}
              className={`mt-2 w-full py-2 rounded-lg transition ${
                isPro
                  ? "bg-green-600 text-white cursor-not-allowed"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
            >
              {isPro ? "✅ Pro Activated" : "Claim Free Access"}
            </button>
            <p className="mt-2 text-xs text-gray-400 italic">
              Hurry! Offer valid only for early members.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
