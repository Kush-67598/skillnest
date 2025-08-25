import React from "react";

const AboutPage = () => {
  return (
    <div className="max-w-full mx-auto px-4 py-12 space-y-10 bg-gray-900 min-h-screen text-gray-200">
      <h1 className="text-4xl font-bold text-center text-white mb-8">
        About Skill Nest
      </h1>

      {/* Who We Are */}
      <section className="bg-gray-800 p-6 rounded-2xl shadow-md">
        <h2 className="text-2xl font-semibold text-white mb-3">Who We Are</h2>
        <p className="text-gray-300">
          Skill Nest is a modern learning platform built for students, creators,
          and professionals. Our goal is to make knowledge accessible, engaging,
          and practical through curated courses and real-world guidance.
        </p>
      </section>

      {/* Our Mission */}
      <section className="bg-gray-800 p-6 rounded-2xl shadow-md">
        <h2 className="text-2xl font-semibold text-white mb-3">Our Mission</h2>
        <p className="text-gray-300">
          We aim to empower learners worldwide by providing affordable and
          high-quality education. With interactive features, progress tracking,
          and expert mentorship, we ensure learning goes beyond just watching
          videos.
        </p>
      </section>

      {/* Why Choose Us */}
      <section className="bg-gray-800 p-6 rounded-2xl shadow-md">
        <h2 className="text-2xl font-semibold text-white mb-3">Why Choose Us</h2>
        <ul className="list-disc pl-6 text-gray-300 space-y-2">
          <li>Expert-led courses designed for real-world skills</li>
          <li>Interactive learning with projects and quizzes</li>
          <li>Personalized progress tracking</li>
          <li>Dedicated support and community engagement</li>
        </ul>
      </section>

      {/* Contact */}
      <section className="bg-gray-800 p-6 rounded-2xl shadow-md">
        <h2 className="text-2xl font-semibold text-white mb-3">Get In Touch</h2>
        <p className="text-gray-300">
          Have questions, suggestions, or feedback? Reach out to us at{" "}
          <a
            href="mailto:support@skillnest.com"
            className="text-blue-400 hover:underline"
          >
            support@skillnest.com
          </a>
          .
        </p>
      </section>
    </div>
  );
};

export default AboutPage;
