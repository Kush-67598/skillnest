import { Michroma } from "next/font/google";
import { ToastContainer } from "react-toastify";
import AuthWrapper from "./utils/Auth_Wrapper";

import "./globals.css";
import Footer from "@/Components/Footer";
import Navbar from "@/Components/Navbar";

const michroma = Michroma({
  variable: "--font-Michroma",
  subsets: ["latin"], // always good to specify
  weight: "400",
});

export const metadata = {
  title: "SkillNest – Empowering Creators, Educating Users",
  description: "SkillNest is a full-featured e-learning platform where creators can sell courses and users can browse, purchase, and access content. Secure payments with Razorpay, AI-powered summaries, and seamless media uploads.",
  keywords: [
    "SkillNest",
    "e-learning",
    "online courses",
    "course marketplace",
    "Razorpay",
    "Next.js",
    "React",
    "Cloudinary",
    "AI summaries",
    "education platform",
  ],
  authors: [{ name: "Kush Singh", url: "https://github.com/yourusername" }],
  openGraph: {
      title: "SkillNest – Empowering Creators, Educating Users",
    description: "Creators can post courses and sell them, users can purchase and access content securely. Powered by Razorpay, AI summaries, and Cloudinary uploads.",
    url: "https://skillnest-delta.vercel.app",
    siteName: "SkillNest",
    images: [
      {
        url: "https://via.placeholder.com/1200x630.png?text=SkillNest",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SkillNest – Empowering Creators, Educating Users",
    description: "Creators can post courses and sell them, users can purchase and access content securely.",
    images: ["https://via.placeholder.com/1200x630.png?text=SkillNest"],
    creator: "@Kush",
  },
};

export default function RootLayout({ children }) {
  return (
    <>
      <html lang="en">
        <body
          className={`${michroma.className} bg-black min-h-screen flex flex-col`}
        >
          <AuthWrapper>
          <Navbar />
          <main className="flex-1">{children}</main>
          <ToastContainer />
          <Footer />
        </AuthWrapper>
        </body>
      </html>
    </>
  );
}
