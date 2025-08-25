import TiltedCard from "@/Bits/Components/TiltedCard/TiltedCard";
import CountUp from "@/Bits/TextAnimations/CountUp/CountUp";
import React from "react";
import useCheckView from "@/Hooks/useCheckView";

const WhyChooseUs = () => {
  const features = [
    {
      captionText: "Expert Instructors",
      description:
        "Learn from industry-leading professionals with years of experience.",
      imageSrc: "/expert.jpg",
    },
    {
      captionText: "Practical Projects",
      description:
        "Build real-world projects to apply your knowledge effectively.",
      imageSrc: "/projects.jpg",
    },
    {
      captionText: "Flexible Learning",
      description: "Study at your own pace, anytime and anywhere.",
      imageSrc: "/flexible.jpg",
    },
    {
      captionText: "Community Support",
      description: "Join a supportive community to help you succeed.",
      imageSrc: "/community.jpg",
    },
  ];

  const isMobile = useCheckView();

  return (
    <div className="mx-4">
      <h1 className="text-5xl text-current py-16 lg:ml-3">WHY CHOOSE US?</h1>
      <p className="text-md italic lg:ml-4 -mt-3 ">
        We Provide More Than{" "}
        <CountUp
          from={0}
          to={100}
          separator=","
          direction="up"
          duration={1}
          className="count-up-text"
        />{" "}
        Professional Courses And Still Counting.
      </p>
      <div className="my-8 grid place-items-center lg:grid-cols-4  grid-cols-2 border border-yellow-500  ">
        {features.map((item, index) => (
          <div className="mb-28 text-white" key={index}>
            <TiltedCard
              imageSrc={null}
              altText={null}
              captionText={`${item.captionText}`}
              containerHeight="250px"
              containerWidth={`${isMobile ? "200px" : "290px"}`}
              imageHeight="250px"
              imageWidth={`${isMobile ? "200px" : "290px"}`}
              rotateAmplitude={12}
              scaleOnHover={1.1}
              showMobileWarning={false}
              showTooltip={true}
              displayOverlayContent={true}
              overlayContent={
                <div className="tilted-card-demo-text p-2 lg:h-[40vh] h-[30vh]  rounded bg-gradient-to-t from-slate-600 via-slate-950 to-black text-white">
                  <p className="lg:text-3xl text-2xl mt-2 lg:pb-10  ">
                    {item.captionText}
                    <br />
                  </p>
                  <p className="text-sm py-8 lg:py-0">{item.description}</p>
                </div>
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhyChooseUs;
