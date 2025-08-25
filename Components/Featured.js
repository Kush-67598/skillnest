import GradientText from "@/Bits/TextAnimations/GradientText/GradientText";

import React from "react";

const Featured = () => {
  return (
    <div  className="border border-pink-500 my-8">
        
      <h1 className="my-12 text-center text-5xl">Featured</h1>
      {[0.2, 0.4, 0.6, 0.8].map((delay, index) => (
        <div key={index} id="Featured" className="border py-6 my-4 mx-4 lg:mx-12 lg:my-4 rounded-2xl">
          <GradientText
            colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
            animationSpeed={3}
            showBorder={false}
            className="custom-class"
          >
            <p>{`Course ${index+1}`}</p>
          </GradientText>
        </div>
      ))}
    </div>
  );
};

export default Featured;
