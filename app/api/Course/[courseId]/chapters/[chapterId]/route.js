import { ConnectDB } from "@/Hooks/useConnectDB";
import Courses from "@/Models/Courses";

export async function DELETE(request, { params }) {
  await ConnectDB();
  const { courseId, chapterId } = params;

  const course = await Courses.findById(courseId);
  if (!course) {
    return Response.json({ error: "Course not found" });
  }

  const chapterToDelete = course.chapters.id(chapterId);
  if (!chapterToDelete) {
    return Response.json({ error: "Chapter not found" });
  }

  chapterToDelete.deleteOne();
  await course.save();

  return Response.json({ success: true, deletedChapter: chapterToDelete });
}

import { ConnectDB } from "@/Hooks/useConnectDB";
import Courses from "@/Models/Courses";

export async function GET(request, { params }) {
  await ConnectDB();
  const { courseId, chapterId } = params;

  const course = await Courses.findById(courseId).lean();
  if (!course) {
    return Response.json({ error: "Course not found" }, { status: 404 });
  }

  const chapterToSearch = course.chapters.find(
    (chap) => chap._id.toString() === chapterId
  );

  if (!chapterToSearch) {
    return Response.json({ error: "Chapter not found" }, { status: 404 });
  }

  return Response.json({ course, chapterToSearch });
}

export async function PUT(request, { params }) {
  await ConnectDB();
  const body = await request.json();
  const { courseId, chapterId } = params;

  const course = await Courses.findById(courseId);
  if (!course) {
    return Response.json({ error: "Course not found" });
  }

  const chapterToUpdate = course.chapters.id(chapterId);
  if (!chapterToUpdate) {
    return Response.json({ error: "Chapter not found" });
  }

  chapterToUpdate.title = body.title;
  chapterToUpdate.order = body.order;

  await course.save();

  return Response.json({ updatedChapter: chapterToUpdate });
}
