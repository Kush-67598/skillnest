import React from "react";

const PricingSection = () => {
  return (
    <section id="pricing" className="max-w-5xl mx-auto my-16 px-4">
      <h2 className="text-3xl md:text-4xl text-center mb-4">
        Unlock More with <span className="text-teal-500 font-bold ">SkillNest Pro</span>
      </h2>
      <p className="text-center mb-8 text-gray-300">
        Gain access to premium courses, AI tools, and exclusive community features.
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

        {/* Paid Plan */}
        <div className="border border-indigo-500 rounded-xl bg-gradient-to-b from-indigo-800/40 to-black/30 backdrop-blur-md p-6 flex flex-col">
          <h3 className="text-xl font-semibold mb-4">Pro</h3>
          <ul className="space-y-2 mb-6 text-gray-100">
            <li>🔥 Premium & advanced courses</li>
            <li>🧠 AI Summarizer & Code Helper</li>
            <li>🎓 Certificates & badges</li>
            <li>📦 Access to exclusive projects & templates</li>
          </ul>
          <div className="mt-auto">
            <span className="text-2xl font-bold">₹499 / month</span>
            <button className="mt-4 w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition">
              Upgrade Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
