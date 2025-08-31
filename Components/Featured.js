"use client";

import React from "react";
import { motion } from "framer-motion";

const Featured = () => {
  const featuredCourses = [0.2, 0.4, 0.6, 0.8];

  return (
    <section className="relative py-16 text-white">
      <div className="absolute inset-0 -z-10 bg-gradient-radial from-purple-700 via-purple-900/80 to-black/80 opacity-90"></div>

      <motion.h1
        className="text-5xl text-center font-bold mb-12 text-white"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.8 }}
      >
        Featured Courses
      </motion.h1>

      <div className="max-w-[100rem] mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {featuredCourses.map((_, index) => (
          <motion.div
            key={index}
            className="bg-black/40 backdrop-blur-md rounded-2xl shadow-lg p-6 flex flex-col items-center text-center cursor-pointer"
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{
              duration: 0.6,
              delay: index * 0.15,
              type: "spring",
              stiffness: 120,
              damping: 15,
            }}
          >
            <div className="bg-gradient-to-r bg-clip-text text-transparent from-purple-900 via-orange-400 to-purple-500 text-2xl py-3">
              {`Course ${index + 1}`}
            </div>
            <p className="text-white/80 text-md py-3">
              This course will guide you step by step to master essential skills
              and take your career to the next level.
            </p>
            <button className="mt-4 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 via-blue-500 to-red-400 text-black font-semibold shadow-md hover:-translate-y-1 transition-transform duration-200">
              View Course
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Featured;
