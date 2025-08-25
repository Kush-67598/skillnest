import SingleLesson from "../../../../../../../../../Components/Lessons/SingleLesson/singlelesson";

export default async function LessonPage({ params }) {
  const { courseId, chapterId, subchapterId, lessonId } = params;
  const Singlelesson = await fetch(
    `${process.env.NEXT_PUBLIC_API}/api/Course/${courseId}/chapters/${chapterId}/subchapters/${subchapterId}/lessons/${lessonId}`,
    { method: "GET" }
  );
  const res=await Singlelesson.json()

  const lessons=res.lesson
  return (
    <>
    <SingleLesson lesson={lessons} courseId={courseId} chapterId={chapterId} subchapterId={subchapterId}/>
    </>
  )
  }
