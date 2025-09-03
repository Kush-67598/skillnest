"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaUser, FaBars, FaTimes } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { TbLogout } from "react-icons/tb";
import useCheckView from "@/Hooks/useCheckView";
import { toast } from "react-toastify";

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

    toast.success("Successfully Logged Out", {
      autoClose: 1000,
      hideProgressBar: true,
      pauseOnHover: false,
    });
    setTimeout(() => {
      router.replace("/auth/login");
    }, 100);
  };
  const pathname = usePathname();
  const Homepage = pathname === "/";
  const CreatorLogin_signup =
    pathname === "/Creator/CreatorLogin" ||
    pathname === "/Creator/CreatorSignup";
  const userLogin_signup =
    pathname === "/auth/login" || pathname === "/auth/signup";
  const Panel = pathname.startsWith("/Creator/panel");
  const MyCourse_profile =
    pathname.startsWith("/Course") ||
    [
      "/About",
      "/Feedback",
      "/POTD",
      "/Profile",
      "/MyCourses",
      "/Legal",
      "/Settings",
      "/Contact",
      "/Checkout",
      "/Bookmarks",
    ].includes(pathname);

  return (
    <nav
      className={`sticky top-0 z-50 ${
        isMobile && !Homepage && (!userLogin_signup || !CreatorLogin_signup)
          ? "mb-20"
          : ""
      }   backdrop-blur-md bg-black/50 border-b border-white/10 shadow-lg`}
    >
      {" "}
      <div
        className={`max-w-7xl mx-auto flex items-center ${
          Homepage ? "justify-between" : "justify-between"
        } px-6 py-4`}
      >
        {/* Brand Logo */}
        <Link href="/" className="text-2xl font-bold tracking-wide">
          <span className="bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
            SkillNest
          </span>
        </Link>
        {Panel && (
          <button
            onClick={handleLogout}
            className="fixed right-12 px-3 py-1 rounded-lg hover:bg-gray-700 text-white font-medium transition"
          >
            <TbLogout className="text-2xl" />
          </button>
        )}

        {/* Desktop Links (only if logged in) */}
        {(Homepage || MyCourse_profile) &&
          !userLogin_signup &&
          !CreatorLogin_signup && (
            <ul className="hidden md:flex gap-8 text-sm font-medium text-white/90">
              {["Home", "Course", "MyCourses", "Contact", "About"].map(
                (link) => (
                  <li key={link}>
                    <Link
                      href={`/${link == "Home" ? "/" : link}`}
                      className="relative px-3 py-1 rounded-lg hover:text-purple-400 transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-purple-400 after:transition-all after:duration-300 hover:after:w-full"
                    >
                      {link}
                    </Link>
                  </li>
                )
              )}
            </ul>
          )}

        {(Homepage || MyCourse_profile) &&
          !userLogin_signup &&
          !CreatorLogin_signup && (
            <div className="flex items-center gap-3">
              <div
                onClick={() => router.push("/Profile")}
                className="p-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 hover:scale-110 transition-transform cursor-pointer shadow-lg flex items-center gap-2"
              >
                <FaUser className="text-white text-sm" />
              </div>

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
      {(Homepage || MyCourse_profile) &&
        !userLogin_signup &&
        !CreatorLogin_signup &&
        menuOpen && (
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
