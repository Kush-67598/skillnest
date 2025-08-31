import { ConnectDB } from "@/Hooks/useConnectDB";
import Courses from "@/Models/Courses";
import { NextResponse } from "next/server";

export async function DELETE(request, { params }) {
  await ConnectDB();
  const { courseId, chapterId } = params;

  const course = await Courses.findById(courseId);
  if (!course) {
    return NextResponse.json({ error: "Course not found" });
  }

  const chapterToDelete = course.chapters.id(chapterId);
  if (!chapterToDelete) {
    return NextResponse.json({ error: "Chapter not found" });
  }

  chapterToDelete.deleteOne();
  await course.save();

  return NextResponse.json({ success: true, deletedChapter: chapterToDelete });
}
export async function GET(request, { params }) {
  await ConnectDB();
  const { courseId, chapterId } = params;
  const cacheKey = `Course_${courseId}_chapter_${chapterId}`;

  // 1️⃣ Check cache first
  const cached = await Redis.get(cacheKey);
  if (cached) {
    const chapterToSearch = JSON.parse(cached);
    return NextResponse.json({ chapterToSearch });
  }

  // 2️⃣ Fetch course from DB if not cached
  const course = await Courses.findById(courseId).lean();
  if (!course) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

  // 3️⃣ Find the specific chapter
  const chapterToSearch = course.chapters.find(
    (chap) => chap._id.toString() === chapterId
  );

  if (!chapterToSearch) {
    return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
  }

  // 4️⃣ Cache the chapter in Redis (expire in 1 day)
  await Redis.set(cacheKey, JSON.stringify(chapterToSearch), { EX: 86400 });

  return NextResponse.json({ chapterToSearch });
}


export async function PUT(request, { params }) {
  await ConnectDB();
  const body = await request.json();
  const { courseId, chapterId } = params;

  const course = await Courses.findById(courseId);
  if (!course) {
    return NextResponse.json({ error: "Course not found" });
  }

  const chapterToUpdate = course.chapters.id(chapterId);
  if (!chapterToUpdate) {
    return NextResponse.json({ error: "Chapter not found" });
  }

  chapterToUpdate.title = body.title;
  chapterToUpdate.order = body.order;

  await course.save();

  return NextResponse.json({ updatedChapter: chapterToUpdate });
}
