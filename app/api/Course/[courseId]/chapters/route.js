import { ConnectDB } from "@/Hooks/useConnectDB";
import Courses from "@/Models/Courses";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  await ConnectDB();
  const { courseId } = params;
  
  const getCourse = await Courses.findById(courseId).lean();
  if (!getCourse) {
    return NextResponse.json({ error: "Course not found" });
  }
  const GetAllChapters = getCourse.chapters;
  return NextResponse.json({ ALLCHAPTERS: GetAllChapters });
}

export async function POST(request, { params }) {
  await ConnectDB();
  const { courseId } = params;
  const body = await request.json();
  const { title, order } = body;

  const updateCourse = await Courses.findById(courseId);
  if (!updateCourse) {
    return NextResponse.json({ error: "Course not found" });
  }

  const newChapter = {
    title: title,
    order: order,
    subChapters: [],
  };
  const exists = updateCourse.chapters.some((i) => i.title == body.title);
  if (exists) {
    return NextResponse.json({ duplicateError: "Same Chapter Already Found" });
  }

  updateCourse.chapters.push(newChapter);
  await updateCourse.save();
  return NextResponse.json({
    success: true,
    "Updated Course is": updateCourse,
  });
}
