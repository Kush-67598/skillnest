"use client";

import React, { useRef, useState, useEffect } from "react";
import ChromaGrid from "@/Bits/Components/ChromaGrid/ChromaGrid";
import { motion, useScroll, useTransform } from "framer-motion";

const Testimonials = () => {
  const items = [
    {
      image: "https://i.pravatar.cc/300?img=2",
      title: "Kush Kumar Singh",
      subtitle: "Full Stack Developer",
      handle: "@Kush67598",
      borderColor: "#3B82F6",
      gradient: "linear-gradient(145deg, #3B82F6, #000)",
      url: "https://github.com/sarahjohnson",
      content:
        "I landed my first job. Thanks to SkillNest for providing such great courses ❤️✨",
    },
    {
      image: "https://i.pravatar.cc/300?img=5",
      title: "Sarah Johnson",
      subtitle: "UI/UX Designer",
      handle: "@SarahJ",
      borderColor: "#10B981",
      gradient: "linear-gradient(145deg, #10B981, #000)",
      url: "https://github.com/sarahjohnson",
      content:
        "The mentorship and community here are simply amazing. I grew a lot as a designer 🚀",
    },
    {
      image: "https://i.pravatar.cc/300?img=10",
      title: "Aman Verma",
      subtitle: "Data Scientist",
      handle: "@AmanV",
      borderColor: "#F59E0B",
      gradient: "linear-gradient(145deg, #F59E0B, #000)",
      url: "https://github.com/amanverma",
      content:
        "Courses are hands-on and project-based. This is what made me confident in real-world work.",
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  // ✅ Auto-slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [items.length]);
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);
  const translateY = useTransform(scrollYProgress, [0, 1], [50, 0]);

  return (
    <motion.div
      id="Testimonials"
      ref={ref}
      style={{ opacity }}
      className="my-6 border border-b-fuchsia-800"
    >
      <motion.h1
        style={{ y: translateY }}
        className="text-4xl text-center font-bold py-5"
      >
        Testimonials
      </motion.h1>

      <motion.p
        style={{ y: translateY }}
        className="text-center text-xl text-gray-300 m-4 italic"
      >
        Trusted by passionate developers and creators worldwide.
      </motion.p>

      {/* Show only active testimonial */}
      <motion.div style={{ y: translateY }}>
        <ChromaGrid
          items={[items[activeIndex]]}
          radius={400}
          damping={0.45}
          fadeOut={0.6}
          ease="power3.out"
        />
      </motion.div>

      {/* Dots Pagination */}
      <motion.div
        style={{ y: translateY }}
        className="flex items-center justify-center mt-6 space-x-3"
      >
        {items.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`w-4 h-4 rounded-full transition-all duration-300 ${
              activeIndex === idx
                ? "bg-fuchsia-500 scale-125 shadow-lg shadow-fuchsia-600/50"
                : "bg-gray-500 hover:bg-gray-400"
            }`}
          ></button>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default Testimonials;
