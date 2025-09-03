"use client";

import TiltedCard from "@/Bits/Components/TiltedCard/TiltedCard";
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRouter } from "next/navigation";

const Categories = () => {
  const router = useRouter();
  const CategoriesData = [
    {
      imageSrc: "/ai.jpeg",
      captionText: "AI AND ML",
      content: "CyberSecurity And Linux",
    },
    {
      imageSrc: "/blender.jpeg",
      captionText: "BLENDER",
      content: "CyberSecurity And Linux",
    },
    {
      imageSrc: "/card_2.jpeg",
      captionText: "AI AND ML",
      content: "CyberSecurity And Linux",
    },
    {
      imageSrc: "/card_3.jpeg",
      captionText: "LINUX",
      content: "CyberSecurity And Linux",
    },
    {
      imageSrc: "/card_3.jpeg",
      captionText: "AI AND ML",
      content: "CyberSecurity And Linux",
    },
    {
      imageSrc: "/card_6.jpeg",
      captionText: "AI AND ML",
      content: "CyberSecurity And Linux",
    },
  ];

  const ref = useRef(null);

  // Track scroll progress relative to the section
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"], // animation from entering viewport to leaving
  });

  // Map scroll progress [0,1] to opacity [0,1,0]
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);
  const translateY = useTransform(scrollYProgress, [0, 1], [50, 0]); // optional Y movement

  return (
    <motion.div
      ref={ref}
      style={{ opacity }}
      className="border py-20 border-yellow-500 maindiv lg:flex lg:gap-1 lg:items-center"
    >
      {/* LEFT CONTENT */}
      <motion.div style={{ y: translateY }} className="lg:flex flex-col">
        <h1 className="text-center text-5xl lg:text-left lg:px-16 lg:text-3xl">
          Skill Tracks
        </h1>
        <div className="my-8 lg:grid-cols-3 grid place-items-center gap-2 grid-cols-2 lg:w-[50dvw] lg:mx-12">
          {CategoriesData.map((item, index) => (
            <motion.div
              key={index}
              className="my-4"
              style={{ opacity }}
              transition={{ duration: 0.3 }}
            >
              <TiltedCard
                imageSrc={item.imageSrc}
                altText="Skill Card"
                captionText={item.captionText}
                containerHeight="250px"
                containerWidth="200px"
                imageHeight="250px"
                imageWidth="200px"
                rotateAmplitude={12}
                scaleOnHover={1.1}
                showMobileWarning={false}
                showTooltip={true}
                displayOverlayContent={true}
                overlayContent={
                  <p className="px-2 text-xs m-2 tilted-card-demo-text">
                    {item.content}
                  </p>
                }
              />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* RIGHT CONTENT */}
      <motion.div
        style={{ opacity, y: translateY }}
        className="text-center px-4"
      >
        <h2 className="font-semibold text-3xl mb-3">
          Discover your next skill
        </h2>
        <p className="text-gray-300">
          Choose your skill journey with confidence. From mastering machine
          learning to designing in Blender or securing Linux systems, our skill
          tracks guide you step by step toward real expertise.
        </p>
        <button
          onClick={() => router.push("/Course")}
          className="cursor-pointer my-8 py-4 bg-gradient-to-r text-black font-bold shadow-2xl hover:-translate-y-1.5 duration-200 hover:transition-all from-slate-100 via-purple-600 to-red-300 rounded-lg px-2"
        >
          Browse Now
        </button>
      </motion.div>
    </motion.div>
  );
};

export default Categories;
