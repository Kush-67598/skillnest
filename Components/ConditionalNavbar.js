"use client";
import { usePathname } from "next/navigation";
import Navbar from "../Components/Navbar";

export default function ConditionalNavbar() {
  const pathname = usePathname();

  // Routes where Navbar should be hidden
  const hideNavbarRoutes = [
    "/signup",
    "/login",
    "/creator/signup",
    "/creator/login",
  ];

  if (hideNavbarRoutes.some((route) => pathname.includes(route))) {
    return null; // don't render navbar
  }

  return <Navbar />;
}
