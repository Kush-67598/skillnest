import React, { useState } from "react";

const NewsLetter = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    // You could integrate here with Mailchimp, ConvertKit, etc.
    alert(`Thanks for subscribing, ${email}!`);
    setEmail("");
  };

  return (
    <section className="max-w-2xl mx-auto my-16 px-4 text-center">
      <div className="bg-gradient-to-br from-purple-800 to-indigo-600 p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold mb-4 text-white">Stay Updated!</h2>
        <p className="mb-6 text-gray-200">
          Subscribe to get the latest courses, updates, and exclusive offers.
        </p>
        <form
          onSubmit={handleSubscribe}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <input
            type="email"
            required
            placeholder="Enter your email"
            className="px-4 py-2 rounded-md focus:outline-none w-full sm:w-auto"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            type="submit"
            className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-900 transition"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
};

export default NewsLetter;
