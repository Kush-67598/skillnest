import { ConnectDB } from "@/Hooks/useConnectDB";
import Courses from "@/Models/Courses";

export async function POST(request, { params }) {
  await ConnectDB();

  const { courseId, chapterId, subchapterId } = params;
  const { lessonsdata, sectionData } = await request.json();

  const getCourse = await Courses.findById(courseId);
  const getChapter = getCourse.chapters.id(chapterId);
  const getSubChapter = getChapter.subChapters.id(subchapterId);
  const getLesson = getSubChapter.lessons;

  const lesson = {
    ...lessonsdata,
    sections: sectionData,
  };

  getLesson.push(lesson);

  await getCourse.save();

  return Response.json({ getLesson, success: true });
}

export async function GET(request, { params }) {
  await ConnectDB();

  const { courseId, chapterId, subchapterId } = params;
  console.log(courseId, chapterId, subchapterId);

  const getCourse = await Courses.findById(courseId).lean();
  if (!getCourse) {
    return Response.json({ error: "Course not found" }, { status: 404 });
  }

  const getChapter = getCourse.chapters.find(
    (chap) => chap._id.toString() === chapterId
  );
  if (!getChapter) {
    return Response.json({ error: "Chapter not found" }, { status: 404 });
  }

  const getSubChapter = getChapter.subChapters.find(
    (subchap) => subchap._id.toString() === subchapterId
  );
  if (!getSubChapter) {
    return Response.json({ error: "Subchapter not found" }, { status: 404 });
  }

  const getLessons = getSubChapter.lessons || [];

  return Response.json({ getLessons });
}
