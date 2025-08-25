import React from "react";
import ChaptersPage from "../../../../Components/Chapters/chapters";


export default async function ChapterPage({params}){
  const {courseId}=params

  const fetchAllchapters=await fetch(`${process.env.NEXT_PUBLIC_API}/api/Course/${courseId}/chapters`,{method:"GET"})
  const res=await fetchAllchapters.json()
  const chapters=res.ALLCHAPTERS
  return <div className="bg-black h-full"><ChaptersPage courseId={courseId} chapters={chapters}/></div>;
  
  
}
