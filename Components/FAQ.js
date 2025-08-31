"use client";

import React, { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const FAQ = () => {
  const questions = [
    {
      q: "What is SkillNest?",
      a: "SkillNest is a platform where developers and creators can learn, share, and grow together through curated courses and community support.",
    },
    {
      q: "Are the courses self-paced?",
      a: "Yes! All courses are designed so you can learn anytime, anywhere, at your own speed.",
    },
    {
      q: "Will I get a certificate?",
      a: "Absolutely. After completing a course, you’ll receive a digital certificate you can share on LinkedIn and elsewhere.",
    },
    {
      q: "Can I become a creator?",
      a: "Definitely! We're always looking for passionate creators to share knowledge. Contact us to get started.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);
  const toggle = (index) => setOpenIndex(openIndex === index ? null : index);

  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const sectionOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);
  const sectionY = useTransform(scrollYProgress, [0, 1], [50, 0]);

  return (
    <motion.section
      ref={ref}
      style={{ opacity: sectionOpacity, y: sectionY }}
      id="FAQ"
      className="max-w-4xl mx-auto mt-20 mb-40 lg:mt-20 lg:mb-40 px-4"
    >
      <motion.h2
        className="text-3xl md:text-4xl font-bold text-center mb-8"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.8 }}
      >
        Frequently Asked Questions
      </motion.h2>

      <div className="space-y-4">
        {questions.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="border border-gray-600 rounded-xl bg-black/30 backdrop-blur-md overflow-hidden"
          >
            <button
              onClick={() => toggle(idx)}
              className="w-full text-left px-4 py-3 flex justify-between items-center"
            >
              <span className="font-semibold">{item.q}</span>
              <span className="text-2xl">{openIndex === idx ? "−" : "+"}</span>
            </button>

            <motion.div
              animate={{
                maxHeight: openIndex === idx ? "200px" : "0px",
                opacity: openIndex === idx ? 1 : 0,
              }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="px-4 overflow-hidden"
            >
              <p className="pb-4 text-gray-300">{item.a}</p>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default FAQ;
