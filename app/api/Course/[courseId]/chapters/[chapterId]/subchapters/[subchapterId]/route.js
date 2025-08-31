// REAd delete and update  a subchapter

import { ConnectDB } from "@/Hooks/useConnectDB";
import Courses from "@/Models/Courses";
import { NextResponse } from "next/server";

export async function GET({ params }) {
  await ConnectDB();
  const { courseId, chapterId, subchapterId } = params;

  const getCourse = await Courses.findById(courseId).lean();
  if (!getCourse) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

  const getChapter = getCourse.chapters.find(
    (chap) => chap._id.toString() === chapterId
  );
  if (!getChapter) {
    return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
  }

  const getSubchapter = getChapter.subChapters.find(
    (sub) => sub._id.toString() === subchapterId
  );
  if (!getSubchapter) {
    return NextResponse.json({ error: "Subchapter not found" }, { status: 404 });
  }

  return NextResponse.json({ getSubchapter });
}

export async function DELETE(request, { params }) {
  await ConnectDB();
  const { courseId, chapterId, subchapterId } = params;
  const getCourse = await Courses.findById(courseId);
  const getchapter = getCourse.chapters.id(chapterId);
  const getSubchapter = getchapter.subChapters.id(subchapterId);
  const subchapter_to_delete = getSubchapter.deleteOne();
  await getCourse.save();
  return NextResponse.json({ success: true, subchapter_to_delete });
}

export async function PUT(request, { params }) {
  await ConnectDB();
  const { courseId, chapterId, subchapterId } = params;

  const { title, order } = await request.json();
  const getCourse = await Courses.findById(courseId);
  const getchapter = getCourse.chapters.id(chapterId);
  const getSubchapter = getchapter.subChapters.id(subchapterId);

  if (title !== undefined) getSubchapter.title = title;
  if (order !== undefined) getSubchapter.order = order;

  await getCourse.save();
  return NextResponse.json({ updatedSubchapter: getCourse });
}
