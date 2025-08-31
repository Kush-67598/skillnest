import React from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { SiX } from "react-icons/si"; // X icon

const Footer = () => {
  return (
    <footer className="bg-black/50 backdrop-blur-md mt-16 text-gray-300 py-8">
      <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand */}
        <div>
          <h3 className="text-xl font-bold mb-2">SkillNest</h3>
          <p className="text-sm">
            Learn directly from developers, creators, and industry experts.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold mb-2">Quick Links</h4>
          <ul className="space-y-1 text-sm">
            <li>
              <a href="#">Home</a>
            </li>
            <li>
              <a href="/Course">Courses</a>
            </li>
            <li>
              <a href="#pricing">Pricing</a>
            </li>
            <li>
              <a href="#FAQ">FAQ</a>
            </li>
            <li>
              <a href="#Testimonials">Testimonials</a>
            </li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h4 className="font-semibold mb-2">Follow Us</h4>
          <div className="flex space-x-4">
            <a href="https://github.com/Kush-67598">
              <FaGithub size={20} />
            </a>
            <a href="https://linkedin.com/in/kush-kumar-singh-623804340">
              <FaLinkedin size={20} />
            </a>
            <a href="https://x.com/Kush67598">
              <SiX size={20} />
            </a>
          </div>
        </div>
      </div>
      <div className="text-center text-xs text-gray-500 mt-6">
        © {new Date().getFullYear()} SkillNest. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
