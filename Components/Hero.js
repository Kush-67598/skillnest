import React from "react";

const Hero = ({opacity,translate}) => {
  return (
    <>
      <div style={{opacity:opacity,transform:`translateY(-${translate}px)`}} className={`border my-10 border-green-400 h-[90dvh] `}>
        <h1 className="font-bold text-4xl text-center">SkillNest</h1>
        <p className="text-sm p-5 text-left">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem,
          voluptatem deserunt! Consequuntur ratione recusandae quo nam ab quas
          modi quis asperiores animi tenetur. Ut.
        </p>
        <div className="text-center h-[50vh]">
          ROBOT Lorereiciendis accusamus. Culpa omnis maiores voluptate, sed animi beatae nam.
          ROBOT Lorem ipsum dolor, sit amet consectetur adipisicing elit. Molestias, aspernatur nulla asperiores alias aliquam ea sequi dicta errormodi qui, sint temporibus veniam hic! Nesciunt iure quia assumenda, illum asperiores doloribus modi veritatis possimus officia reiciendis accusamus. Culpa omnis maiores voluptate, sed animi beatae nam.
          ROBOT Lorem ipsum dolor, sit amet consectetur adipisicing elit. Molestias, aspernatur nulla asperiores alias aliquam ea sequi dicta errormodi qui, sint temporibus veniam hic! Nesciunt iure quia assumenda, illum asperiores doloribus modi veritatis possimus officia reiciendis accusamus. Culpa omnis maiores voluptate, sed animi beatae nam.
          ROBOT Lorem ipsum dolor, sit amet consectetur adipisicing elit. Molestias, aspernatur nulla asperiores alias aliquam ea sequi dicta errormodi qui, sint temporibus veniam hic! Nesciunt iure quia assumenda, illum asperiores doloribus modi veritatis possimus officia reiciendis accusamus. Culpa omnis maiores voluptate, sed animi beatae nam.
          </div>
      </div>
      
    </>
  );
};

export default Hero;
