"use client";

import TiltedCard from "@/Bits/Components/TiltedCard/TiltedCard";
import CountUp from "@/Bits/TextAnimations/CountUp/CountUp";
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import useCheckView from "@/Hooks/useCheckView";

const WhyChooseUs = () => {
  const features = [
    {
      captionText: "Expert Instructors",
      description:
        "Learn from industry-leading professionals with years of experience.",
      imageSrc: "/expert.jpg",
    },
    {
      captionText: "Practical Projects",
      description:
        "Build real-world projects to apply your knowledge effectively.",
      imageSrc: "/projects.jpg",
    },
    {
      captionText: "Flexible Learning",
      description: "Study at your own pace, anytime and anywhere.",
      imageSrc: "/flexible.jpg",
    },
    {
      captionText: "Community Support",
      description: "Join a supportive community to help you succeed.",
      imageSrc: "/community.jpg",
    },
  ];

  // Unique neon gradients for each card
  const gradients = [
    "bg-gradient-to-br from-[#3B82F6] via-[#0A0A0A] to-[#0F172A] shadow-lg shadow-blue-800/40",
    "bg-gradient-to-br from-[#06B6D4] via-[#0A0A0A] to-[#0F172A] shadow-lg shadow-cyan-800/40",
    "bg-gradient-to-br from-[#9333EA] via-[#0A0A0A] to-[#0F172A] shadow-lg shadow-purple-800/40",
    "bg-gradient-to-br from-[#EC4899] via-[#0A0A0A] to-[#0F172A] shadow-lg shadow-pink-800/40",
  ];

  const isMobile = useCheckView();
  const ref = useRef(null);

  // Scroll progress for the section
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Map scroll progress to opacity and Y movement
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);
  const translateY = useTransform(scrollYProgress, [0, 1], [50, 0]);

  return (
    <motion.div ref={ref} style={{ opacity }} className="mx-4">
      <motion.h1
        style={{ y: translateY }}
        className="text-5xl text-current py-16 lg:ml-3"
      >
        WHY CHOOSE US?
      </motion.h1>

      <motion.p
        style={{ y: translateY }}
        className="text-md italic lg:ml-4 -mt-3"
      >
        We Provide More Than{" "}
        <CountUp
          from={0}
          to={100}
          separator=","
          direction="up"
          duration={1}
          className="count-up-text"
        />{" "}
        Professional Courses And Still Counting.
      </motion.p>

      <div className="my-8 grid place-items-center lg:grid-cols-4 grid-cols-2 gap-6">
        {features.map((item, index) => (
          <motion.div
            key={index}
            style={{ opacity, y: translateY }}
            transition={{ delay: index * 0.15, duration: 0.6 }}
            className="mb-28 text-white"
          >
            <TiltedCard
              imageSrc={null}
              altText={null}
              captionText={item.captionText}
              containerHeight="250px"
              containerWidth={`${isMobile ? "175px" : "220px"}`}
              imageHeight="250px"
              imageWidth={`${isMobile ? "175px" : "220px"}`}
              rotateAmplitude={12}
              scaleOnHover={1.1}
              showMobileWarning={false}
              showTooltip={true}
              displayOverlayContent={true}
              overlayContent={
                <div
                  className={`tilted-card-demo-text p-2 lg:h-[40vh] h-[30vh] rounded-xl backdrop-blur-2xl 
                  transition-all duration-300 hover:scale-105 hover:border hover:border-white/20
                  ${gradients[index]}
                  `}
                >
                  <p className="lg:text-3xl text-2xl mt-2 lg:pb-10">
                    {item.captionText}
                  </p>
                  <p className="text-sm py-8 lg:py-0">{item.description}</p>
                </div>
              }
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default WhyChooseUs;
