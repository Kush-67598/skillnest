import { ConnectDB } from "@/Hooks/useConnectDB";
import Courses from "@/Models/Courses";

export async function PUT(request, { params }) {
  await ConnectDB();
  const { courseId, chapterId, subchapterId, lessonId } = params;
  const body = await request.json();
  const { form, sectionData } = body;

  const getCourse = await Courses.findById(courseId);
  if (!getCourse)
    return Response.json({ error: "Course not found" }, { status: 404 });

  const getChapter = getCourse.chapters.id(chapterId);
  if (!getChapter)
    return Response.json({ error: "Chapter not found" }, { status: 404 });

  const getSubChapter = getChapter.subChapters.id(subchapterId);
  if (!getSubChapter)
    return Response.json({ error: "Subchapter not found" }, { status: 404 });

  const lesson_to_update = getSubChapter.lessons.id(lessonId);
  if (!lesson_to_update)
    return Response.json({ error: "Lesson not found" }, { status: 404 });

  // Update via structured form
  if (form) {
    if (form.title !== undefined) lesson_to_update.title = form.title;

    if (form.order !== undefined) lesson_to_update.order = form.order;
    if (form.mainTitle !== undefined)
      lesson_to_update.mainTitle = form.mainTitle;
    if (form.videoURL !== undefined) lesson_to_update.videoURL = form.videoURL;
  }

  // Update sections
  if (sectionData) {
    lesson_to_update.sections = sectionData;
  }

  await getCourse.save();

  return Response.json({ updatedLesson: lesson_to_update });
}

export async function DELETE(request, { params }) {
  await ConnectDB();
  const { courseId, chapterId, subchapterId, lessonId } = params;

  const getCourse = await Courses.findById(courseId);
  if (!getCourse)
    return Response.json({ error: "Course not found" }, { status: 404 });

  const getChapter = getCourse.chapters.id(chapterId);
  if (!getChapter)
    return Response.json({ error: "Chapter not found" }, { status: 404 });

  const getSubChapter = getChapter.subChapters.id(subchapterId);
  if (!getSubChapter)
    return Response.json({ error: "Subchapter not found" }, { status: 404 });

  const lesson_to_delete = getSubChapter.lessons.id(lessonId);
  if (!lesson_to_delete)
    return Response.json({ error: "Lesson not found" }, { status: 404 });

  lesson_to_delete.deleteOne();
  await getCourse.save();

  return Response.json({ success: true, deletedLessonId: lessonId });
}

export async function GET(request, { params }) {
  await ConnectDB();
  const { courseId, chapterId, subchapterId, lessonId } = params;

  const getCourse = await Courses.findById(courseId).lean();
  if (!getCourse)
    return Response.json({ error: "Course not found" }, { status: 404 });

  const getChapter = getCourse.chapters.find(
    (chap) => chap._id.toString() === chapterId
  );
  if (!getChapter)
    return Response.json({ error: "Chapter not found" }, { status: 404 });

  const getSubChapter = getChapter.subChapters.find(
    (subchap) => subchap._id.toString() === subchapterId
  );
  if (!getSubChapter)
    return Response.json({ error: "Subchapter not found" }, { status: 404 });

  const getLesson = getSubChapter.lessons.find(
    (lesson) => lesson._id.toString() === lessonId
  );
  if (!getLesson)
    return Response.json({ error: "Lesson not found" }, { status: 404 });

  return Response.json({ lesson: getLesson });
}
