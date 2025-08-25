import Aurora from "@/Bits/Backgrounds/Aurora/Aurora";
import DotGrid from "@/Bits/Backgrounds/DotGrid/DotGrid";
import Hyperspeed from "@/Bits/Backgrounds/Hyperspeed/Hyperspeed";
import Orb from "@/Bits/Backgrounds/Orb/Orb";
import TiltedCard from "@/Bits/Components/TiltedCard/TiltedCard";
import React from "react";

const Categories = () => {
  const Categories = [
    {
      imageSrc: "/ai.jpeg",
      captionText: "AI AND ML",
      content: "CyberSecurity And Linux",
    },
    {
      imageSrc: "/blender.jpeg",
      captionText: "BLENDER",
      content: "CyberSecurity And Linux",
    },
    {
      imageSrc: "/card_2.jpeg",
      captionText: "AI AND ML",
      content: "CyberSecurity And Linux",
    },
    {
      imageSrc: "/card_3.jpeg",
      captionText: "LINUX",
      content: "CyberSecurity And Linux",
    },
    {
      imageSrc: "/card_3.jpeg",
      captionText: "AI AND ML",
      content: "CyberSecurity And Linux",
    },
    {
      imageSrc: "/card_6.jpeg",
      captionText: "AI AND ML",
      content: "CyberSecurity And Linux",
    },
  ];
  return (
    <>
      <div className="border border-yellow-500 maindiv lg:flex lg:gap-1 lg:items-center ">
        <div className="lg:flex flex-col ">
          <h1 className="text-center text-5xl lg:text-left lg:px-16 lg:text-3xl ">
            Skill Tracks
          </h1>
          <div className=" my-8 lg:grid-cols-3 grid place-items-center gap-2 grid-cols-2  lg:w-[50dvw] lg:mx-12 ">
            {Categories.map((item, index) => (
              <div className="my-4" key={index}>
                <TiltedCard
                  imageSrc={item.imageSrc}
                  altText="Kendrick Lamar - GNX Album Cover"
                  captionText={item.captionText}
                  containerHeight="250px"
                  containerWidth="200px"
                  imageHeight="250px"
                  imageWidth="200px"
                  rotateAmplitude={12}
                  scaleOnHover={1.1}
                  showMobileWarning={false}
                  showTooltip={true}
                  displayOverlayContent={true}
                  overlayContent={
                    <p className="px-2 text-xs m-2 tilted-card-demo-text">
                      {item.content}
                    </p>
                  }
                />
              </div>
            ))}
          </div>
        </div>
        {/* RIGHT CONTENT */}
        <div className=" text-center px-4">
          <h2 className=" font-semibold text-3xl mb-3">
            Discover your next skill
          </h2>
          <p className="text-gray-300">
            Choose your skill journey with confidence. From mastering machine
            learning to designing in Blender or securing Linux systems, our
            skill tracks guide you step by step toward real expertise.
          </p>
        <button className=" cursor-pointer my-8 py-4 bg-gradient-to-r text-black font-bold shadow-2xl not-hover:translate-y-1 not-hover:transition-all not-hover:duration-300 not-hover:ease-out hover:-translate-y-1.5 duration-200 hover:transition-all hover:ease-in from-slate-900 via-purple-400  to-red-300 rounded-lg px-2">Browse Now</button>

        </div>
        <div></div>
      </div>
    </>
  );
};

export default Categories;
