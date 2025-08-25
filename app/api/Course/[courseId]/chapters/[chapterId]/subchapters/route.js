import { ConnectDB } from "@/Hooks/useConnectDB";
import Courses from "@/Models/Courses";

export async function GET(request, { params }) {
  await ConnectDB();
  const { courseId, chapterId } = params;

  const getCourse = await Courses.findById(courseId).lean();
  if (!getCourse) {
    return Response.json({ error: "Course not found" }, { status: 404 });
  }

  // Manually find chapter (no `.id()` on plain objects)
  const chapter = getCourse.chapters.find(
    (chap) => chap._id.toString() === chapterId
  );

  if (!chapter) {
    return Response.json({ error: "Chapter not found" }, { status: 404 });
  }

  const getSubChapters = chapter.subChapters || [];

  return Response.json({ ALLSUBCHAPTER: getSubChapters });
}

export async function POST(request, { params }) {
  await ConnectDB();
  const body = await request.json();
  const { courseId, chapterId } = params;

  const fetchcourse = await Courses.findById(courseId);
  if (!fetchcourse) {
    return Response.json({ error: "Course not found" });
  }

  const fetch_ch = fetchcourse.chapters.id(chapterId);
  if (!fetch_ch) {
    return Response.json({ error: "Chapter not found" });
  }

  const sub_chapter_data = {
    title: body.title,
    order: body.order,
  };

  fetch_ch.subChapters.push(sub_chapter_data);
  await fetchcourse.save();

  return Response.json({ success: true, updatedCourse: fetchcourse });
}
