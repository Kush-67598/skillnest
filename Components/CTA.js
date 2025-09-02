"use client";
import { useRouter } from "next/navigation";
import React from "react";

const CTA = () => {
  const router = useRouter();
  return (
    <>
      <section className=" bg-black/20 mt-32  backdrop-blur from-purple-700 via-pink-700 to-red-200 text-white rounded-2xl shadow-lg mx-auto max-w-5xl lg:max-w-full p-10 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Ready to level up your skills?
        </h2>
        <p className="text-lg md:text-xl mb-6 max-w-2xl mx-auto">
          Join thousands of developers, creators, and tech enthusiasts learning
          and growing together on SkillNest.
        </p>
        <button
          onClick={() => router.push("/Course")}
          className="bg-white text-purple-700 hover:bg-purple-100 transition-colors px-8 py-3 rounded-full text-lg font-semibold shadow-md"
        >
          Get Started
        </button>
      </section>
    </>
  );
};

export default CTA;
