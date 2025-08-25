"use client";
import DarkVeil from "@/Bits/Backgrounds/DarkVeil/DarkVeil";
import Categories from "@/Components/Categories";
import CTA from "@/Components/CTA";
import FAQ from "@/Components/FAQ";
import Featured from "@/Components/Featured";
import Footer from "@/Components/Footer";
import Hero from "@/Components/Hero";
import Navbar from "@/Components/Navbar";
import NewsLetter from "@/Components/NewsLetter";
import PricingSection from "@/Components/PricingSection";
import Testimonials from "@/Components/Testimonials";
import WhyChooseUs from "@/Components/WhyChooseUs";
import useCheckView from "@/Hooks/useCheckView";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();

  const [token, setToken] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("USER_TOKEN");
    if (!token) {
      router.push("/auth/login");
    }
    setToken(token);
  }, []);
  const [scroll, setScroll] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScroll(window.scrollY);
      console.log("Curreent Scroll Postion is :", scroll);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  let opacity = 1 - scroll / 700;
  let translateY = scroll / 140;

  const isMobile = useCheckView();

  return (
    <>
      {token ? (
        <div className="text-white">
          <div className="fixed inset-0 -z-10">
            <DarkVeil hueShift={1} noiseIntensity={0.019} warpAmount={2} />
          </div>
          <Navbar />
          <Hero opacity={opacity} translate={translateY} />
          <Categories />
          <Featured />
          <WhyChooseUs />
          <Testimonials />
          <CTA />
          <FAQ />
          <NewsLetter />
          <PricingSection />
          <Footer />
        </div>
      ) : (
        ""
      )}
    </>
  );
}
