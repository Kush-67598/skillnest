"use client";
import { useRouter } from "next/navigation";
import React from "react";

const Hero = ({ opacity, translate }) => {
  const router = useRouter();
  return (
    <div
      style={{ opacity: opacity, transform: `translateY(-${translate}px)` }}
      className="relative h-[100vh] flex flex-col justify-center items-center text-center px-6 md:px-20 bg-gradient-to-b from-black/80 to-blue-900/80 backdrop-blur-sm text-white transition-all duration-700"
    >
      {/* Hero Text */}
      <h1 className="text-5xl md:text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
        SkillNest
      </h1>
      <p className="text-md md:text-lg max-w-3xl mb-8 text-white/90">
        Learn, grow, and master new skills with our curated courses. Join
        thousands of learners and level up your career.
      </p>

      {/* Call-to-Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button className="px-6 py-3 rounded-full bg-purple-500 hover:bg-purple-600 transition text-white font-semibold shadow-lg">
          Get Started
        </button>
        <button onClick={()=>router.push('/Course')} className="px-6 py-3 rounded-full border border-white/50 hover:bg-white/10 transition text-white font-semibold shadow-lg">
          Explore Courses
        </button>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 text-sm text-white/70 animate-bounce">
        Scroll Down
      </div>
    </div>
  );
};

export default Hero;
