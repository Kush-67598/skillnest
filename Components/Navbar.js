"use client";

import Link from "next/link";
import { FaUser, FaBars, FaTimes } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Navbar = () => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-black/50 border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Brand Logo */}
        <Link href="/" className="text-2xl font-bold tracking-wide">
          <span className="bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
            SkillNest
          </span>
        </Link>

        {/* Desktop Links */}
        <ul className="hidden md:flex gap-8 text-sm font-medium text-white/90">
          {["Home", "About", "Contact", "Courses", "MyCourses"].map((link) => (
            <li key={link}>
              <Link
                href={`/${link === "Home" ? "" : link}`}
                className="relative px-3 py-1 rounded-lg hover:text-purple-400 transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-purple-400 after:transition-all after:duration-300 hover:after:w-full"
              >
                {link}
              </Link>
            </li>
          ))}
        </ul>

        {/* User Profile */}
        <div className="flex items-center gap-4">
          <div
            onClick={() => router.push("/Profile")}
            className="p-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 hover:scale-110 transition-transform cursor-pointer shadow-lg"
          >
            <FaUser className="text-white text-lg" />
          </div>

          {/* Mobile Menu Button */}
          <div
            className="md:hidden text-white cursor-pointer"
            onClick={toggleMenu}
          >
            {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <ul className="md:hidden flex flex-col gap-4 px-6 pb-4 bg-black/70 backdrop-blur-md border-t border-white/10">
          {["Home", "About", "Contact", "Course", "MyCourses"].map((link) => (
            <li key={link}>
              <Link
                href={`/${link === "Home" ? "" : link}`}
                className="block px-3 py-2 rounded-lg text-white hover:bg-purple-500/20 transition"
                onClick={() => setMenuOpen(false)}
              >
                {link}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
