import React from "react";
import ChromaGrid from "@/Bits/Components/ChromaGrid/ChromaGrid";
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from "react-icons/fa";

const Testimonials = () => {
  const items = [
    {
      image: "https://i.pravatar.cc/300?img=2",
      title: "Kush Kumar Singh",
      subtitle: "Full Stack Developer",
      handle: "@Kush67598",
      borderColor: "#3B82F6",
      gradient: "linear-gradient(145deg, #3B82F6, #000)",
      url: "https://github.com/sarahjohnson",
      content:'I land my first Job .Thanks to SKilNest for Providing Such Great Courses❤️✨'
    },

    // {
    //   image:"https://i.pravatar.cc/300?img=3",
    //   title: "Mike Chen",
    //   subtitle: "Backend Engineer",
    //   handle: "@mikechen",
    //   borderColor: "#10B981",
    //   gradient: "linear-gradient(180deg, #10B981, #000)",
    //   url: "https://linkedin.com/in/mikechen",
    // },
    // {
    //   image: "https://i.pravatar.cc/300?img=11",
    //   title: "Mike Chen",
    //   subtitle: "Backend Engineer",
    //   handle: "@mikechen",
    //   borderColor: "#10B981",
    //   gradient: "linear-gradient(180deg, #10B981, #000)",
    //   url: "https://linkedin.com/in/mikechen",
    // },
    // {
    //   image: "https://i.pravatar.cc/300?img=1",
    //   title: "Mike Chen",
    //   subtitle: "Backend Engineer",
    //   handle: "@mikechen",
    //   borderColor: "#10B981",
    //   gradient: "linear-gradient(180deg, #10B981, #000)",
    //   url: "https://linkedin.com/in/mikechen",
      
    // },
  ];
  return (
    <div id="Testimonials" className=" my-6 border border-b-fuchsia-800">
        
      <h1 className="text-4xl text-center font-bold  py-5">Testimonials</h1>
      <p className="text-center text-xl text-gray-300 m-4 italic">
        Trusted by passionate developers and creators worldwide.
      </p>

      <ChromaGrid
      items={items}
        radius={400}
        damping={0.45}
        fadeOut={0.6}
        ease="power3.out"
      />
      <div className="flex items-center justify-center">

      <button className="px-12 my-4"><FaArrowAltCircleLeft  className="text-6xl" /></button>
      <button className="px-12 my-4"><FaArrowAltCircleRight className="text-6xl"/></button>
      </div>
  </div>
  );
};

export default Testimonials;
