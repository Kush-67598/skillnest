import React, { useState } from "react";

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

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="FAQ" className="max-w-4xl mx-auto my-16 px-4">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
        Frequently Asked Questions
      </h2>

      <div className="space-y-4">
        {questions.map((item, idx) => (
          <div
            key={idx}
            className="border border-gray-600 rounded-xl bg-black/30 backdrop-blur-md overflow-hidden transition-all duration-500"
          >
            <button
              onClick={() => toggle(idx)}
              className="w-full text-left px-4 py-3 flex justify-between items-center"
            >
              <span className="font-semibold">{item.q}</span>
              <span>{openIndex === idx ? "−" : "+"}</span>
            </button>

            <div
              className={`px-4 overflow-hidden transition-all duration-500 ease-in-out ${
                openIndex === idx ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <p className="pb-4 text-gray-300">{item.a}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;
