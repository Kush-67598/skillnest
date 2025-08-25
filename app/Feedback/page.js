"use client";
import React, { useState } from "react";

const FeedbackPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Send feedback to API
    console.log("Feedback Submitted:", formData);
    setSubmitted(true);
  };

  return (
    <div className="max-w-full mx-auto px-6 py-12 bg-gray-900 min-h-screen text-gray-200">
      <h1 className="text-4xl font-bold text-center text-white mb-8">
        Feedback
      </h1>

      {!submitted ? (
        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-gray-800 p-6 rounded-2xl shadow-md"
        >
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Your Name
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Your Email
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Message
            </label>
            <textarea
              name="message"
              rows="4"
              required
              value={formData.message}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-white shadow-lg transition"
          >
            Submit Feedback
          </button>
        </form>
      ) : (
        <div className="text-center bg-gray-800 p-6 rounded-2xl shadow-md">
          <h2 className="text-2xl font-semibold mb-3">Thank You! 🎉</h2>
          <p className="text-gray-300">
            We appreciate your feedback and will get back to you if needed.
          </p>
        </div>
      )}
    </div>
  );
};

export default FeedbackPage;
