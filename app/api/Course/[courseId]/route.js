import { ConnectDB } from "@/Hooks/useConnectDB";
import Courses from "@/Models/Courses";
import { NextResponse } from "next/server";
import { Redis } from "../../../utils/Redis";

export async function GET(request, { params }) {
  await ConnectDB();
  const { courseId } = params;

  try {
    const cacheKey = `Course_${courseId}`;
    const cached = await Redis.get(cacheKey);
    if (cached) {
      console.log("suing cahce")
      return NextResponse.json({ reqCourse: JSON.parse(cached) });
    }
    const course = await Courses.findById(courseId).lean();
    if (!course) {
      return new NextResponse(JSON.stringify({ error: "Course not found" }), {
        status: 404,
      });
    }
    await Redis.set(cacheKey, JSON.stringify(course), { EX: 60000 });
    return new NextResponse(JSON.stringify({ reqCourse: course }), {
      status: 200,
    });
  } catch (err) {
    return new NextResponse(JSON.stringify({ error: "Invalid ID" }), {
      status: 400,
    });
  }
}

export async function DELETE(request, { params }) {
  await ConnectDB();
  const { courseId } = params;

  const course = await Courses.findByIdAndDelete(courseId);
  if (!course) return NextResponse.json({ error: "Course not found" });
  return NextResponse.json({
    success: true,
    deletedCourse: course,
  });
}

export async function PUT(request, { params }) {
  await ConnectDB();
  const { courseId } = params;
  const body = await request.json();

  const course = await Courses.findById(courseId);
  if (!course) return NextResponse.json({ error: "Course not found" });

  // Update fields (only if provided)
  if (body.slug !== undefined) course.slug = body.slug;
  if (body.title !== undefined) course.title = body.title;
  if (body.price !== undefined) course.price = body.price;
  if (body.category !== undefined) course.category = body.category;
  if (body.creatorName !== undefined) course.creatorName = body.creatorName;
  if (body.description !== undefined) course.description = body.description;
  if (body.thumbnailURL !== undefined) course.thumbnailURL = body.thumbnailURL;

  await course.save();

  return NextResponse.json({
    message: "Course updated successfully",
    updatedCourse: course,
  });
}
