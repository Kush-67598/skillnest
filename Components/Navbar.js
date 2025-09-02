"use client";
import Link from "next/link";
import { FaUser, FaBars, FaTimes } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { TbLogout } from "react-icons/tb";
import useCheckView from "@/Hooks/useCheckView";

const Navbar = () => {
  const router = useRouter();
  const isMobile = useCheckView();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userPlan, setUserPlan] = useState("Free");
  const [token, setToken] = useState(null);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  useEffect(() => {
    const st_token = localStorage.getItem("USER_TOKEN");
    if (st_token) setToken(st_token);
  }, []);

  useEffect(() => {
    if (!token) return;

    const fetchUser = async () => {
      try {
        const res = await fetch("/api/User", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("USER_TOKEN")}`,
          },
        });
        const data = await res.json();
        if (data?.pro === true) setUserPlan("Pro");
      } catch (err) {
        console.log("User fetch error", err);
      }
    };

    fetchUser();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("USER_TOKEN");
    localStorage.removeItem("Token");
    setToken(null);
    router.replace("/auth/login");
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-black/50 border-b border-white/10 shadow-lg">
      <div
        className={`max-w-7xl mx-auto flex items-center ${
          token ? "justify-between" : "justify-center"
        } px-6 py-4`}
      >
        {/* Brand Logo */}
        <Link href="/" className="text-2xl font-bold tracking-wide">
          <span className="bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
            SkillNest
          </span>
        </Link>

        {/* Desktop Links (only if logged in) */}
        {token && (
          <ul className="hidden md:flex gap-8 text-sm font-medium text-white/90">
            <Link href={"/"}>Home</Link>
            <Link href={"/Course"}>Course</Link>
            {["About", "Contact", "MyCourses"].map((link) => (
              <li key={link}>
                <Link
                  href={`/${link}`}
                  className="relative px-3 py-1 rounded-lg hover:text-purple-400 transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-purple-400 after:transition-all after:duration-300 hover:after:w-full"
                >
                  {link}
                </Link>
              </li>
            ))}
          </ul>
        )}

        {/* Profile + Badge + Hamburger (only if logged in) */}
        {token && (
          <div className="flex items-center gap-3">
            <div
              onClick={() => router.push("/Profile")}
              className="p-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 hover:scale-110 transition-transform cursor-pointer shadow-lg flex items-center gap-2"
            >
              <FaUser className="text-white text-sm" />
            </div>
            {/* <span
              className={`text-xs font-semibold px-2 py-1 rounded ${
                userPlan === "Pro"
                  ? "bg-red-500 text-black"
                  : "bg-green-400 text-black"
              }`}
            >
              {userPlan}
            </span> */}
            <button
              onClick={handleLogout}
              className="px-3 py-1 rounded-lg hover:bg-gray-700 text-white font-medium transition"
            >
              <TbLogout className="text-2xl" />
            </button>
            <div
              className="md:hidden text-white cursor-pointer"
              onClick={toggleMenu}
            >
              {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {token && menuOpen && (
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
          <li>
            <button
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition"
            >
              Logout
            </button>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
