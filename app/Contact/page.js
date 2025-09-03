"use client";
import { useState } from "react";
import { toast } from "react-toastify";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/Contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Message Sent Successfully!", {
          autoClose: 1000,
          pauseOnHover: false,
          hideProgressBar: true,
        });
        setFormData({ name: "", email: "", message: "" });
      } else {
        toast.error("Failed to send message.", {
          autoClose: 1000,
          pauseOnHover: false,
          hideProgressBar: true,
        });
      }
    } catch (err) {
      toast.error("Something went wrong!", {
        autoClose: 1000,
        pauseOnHover: false,
        hideProgressBar: true,
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 py-12">
      <div className="max-w-3xl w-full bg-gray-800/80 backdrop-blur-md rounded-3xl p-10 shadow-2xl border border-gray-700">
        <h1 className="text-4xl font-extrabold text-white mb-6 text-center">
          Get in Touch
        </h1>
        <p className="text-gray-300 text-center mb-8">
          Have a question or want to collaborate? Send us a message!
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name"
            required
            className="w-full bg-gray-700 text-white placeholder-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your Email"
            required
            className="w-full bg-gray-700 text-white placeholder-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition"
          />
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Your Message"
            required
            rows={5}
            className="w-full bg-gray-700 text-white placeholder-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition resize-none"
          />
          <button
            type="submit"
            disabled={loading}
            className={`bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-500 text-white font-bold py-3 rounded-xl shadow-lg hover:scale-105 transition-transform duration-300 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>

        <div className="mt-10 text-center text-gray-400">
          <p>
            Email: <span className="text-white">contact@skillnest.com</span>
          </p>
          <p>
            Phone: <span className="text-white">+91 12345 67890</span>
          </p>
          <p>
            Address:{" "}
            <span className="text-white">123 SkillNest Street, India</span>
          </p>
        </div>
      </div>
    </div>
  );
}
