"use client";

import React, { useRef } from "react";
import ChromaGrid from "@/Bits/Components/ChromaGrid/ChromaGrid";
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from "react-icons/fa";
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
        "I land my first Job. Thanks to SkillNest for Providing Such Great Courses ❤️✨",
    },
  ];

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

      <motion.div style={{ y: translateY }}>
        <ChromaGrid items={items} radius={400} damping={0.45} fadeOut={0.6} ease="power3.out" />
      </motion.div>

      <motion.div
        style={{ y: translateY }}
        className="flex items-center justify-center"
      >
        <button className="px-12 my-4">
          <FaArrowAltCircleLeft className="text-6xl" />
        </button>
        <button className="px-12 my-4">
          <FaArrowAltCircleRight className="text-6xl" />
        </button>
      </motion.div>
    </motion.div>
  );
};

export default Testimonials;
