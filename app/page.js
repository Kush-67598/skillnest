"use client";

import dynamic from "next/dynamic";
import DarkVeil from "@/Bits/Backgrounds/DarkVeil/DarkVeil";
import Hero from "@/Components/Hero";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Dynamically load heavy/below-the-fold components

const Categories = dynamic(() => import("@/Components/Categories"), {
  ssr: false,
});
const Featured = dynamic(() => import("@/Components/Featured"), { ssr: false });
const WhyChooseUs = dynamic(() => import("@/Components/WhyChooseUs"), {
  ssr: false,
});
const Testimonials = dynamic(() => import("@/Components/Testimonials"), {
  ssr: false,
});
const CTA = dynamic(() => import("@/Components/CTA"), { ssr: false });
const FAQ = dynamic(() => import("@/Components/FAQ"), { ssr: false });
const PricingSection = dynamic(() => import("@/Components/PricingSection"), {
  ssr: false,
});
// const Footer = dynamic(() => import("@/Components/Footer"), { ssr: false });

export default function Home() {
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [scroll, setScroll] = useState(0);

  // Check auth token
  useEffect(() => {
    const token = localStorage.getItem("USER_TOKEN");
    if (!token) {
      // router.push("/auth/login");
    } else {
      // setToken(token);
    }
  }, []);

  // Track scroll for Hero animation
  useEffect(() => {
    const handleScroll = () => {
      setScroll(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const opacity = 1 - scroll / 700;
  const translateY = scroll / 140;

  // if (!token) return null;

  return (
    <div className="text-white">
      <div className="fixed inset-0 -z-10">
        <DarkVeil hueShift={1} noiseIntensity={0.019} warpAmount={2} />
      </div>
      <Hero opacity={opacity} translate={translateY} />
      <Categories />
      <Featured />
      <WhyChooseUs />
      <Testimonials />
      <CTA />
      <FAQ />
      <PricingSection />
      {/* <Footer /> */}
    </div>
  );
}
