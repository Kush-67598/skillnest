import SubchapterPage from "../../../../../../Components/Subchapter/subchapter.js";
export default async function SubchaptersPage({ params }) {
  const { courseId, chapterId } = params;
  const fetch_subchapters = await fetch(
    `${process.env.NEXT_PUBLIC_API}/api/Course/${courseId}/chapters/${chapterId}/subchapters`,
    { method: "GET" }
  );
  const res = await fetch_subchapters.json();
  const subChapters = res.ALLSUBCHAPTER;

  return (
    <>
      <SubchapterPage
        courseId={courseId}
        chapterId={chapterId}
        subChapters={subChapters}
      />
    </>
    //
  );
}
