import AllLessonsPage from "../../../../../../../../Components/Lessons/AllLessons/alllessons";

export default async function page({params}) {
  const {courseId,chapterId,subchapterId}=params
  const fetchLessons = await fetch(
    `${process.env.NEXT_PUBLIC_API}/api/Course/${courseId}/chapters/${chapterId}/subchapters/${subchapterId}/lessons`,
    { method: "GET" }
  );
  const res=await fetchLessons.json() 
  const lessons=res.getLessons  
  
  return (
    <>
    <AllLessonsPage lessons={lessons} courseId={courseId} chapterId={chapterId} subchapterId={subchapterId} />
    </>
  )
}
