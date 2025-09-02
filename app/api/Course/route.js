import { ConnectDB } from "@/Hooks/useConnectDB";
import Courses from "@/Models/Courses";
import Creator from "@/Models/Creator";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(request) {
  await ConnectDB();
  const body = await request.json();
  const { slug, title, price, category, description, thumbnailurl } =
    body.formdata;

  const token = request.headers.get("authorization").split(" ")[1];
  const verified_creator_Email = jwt.verify(token, "jwtsecret").email;
  const Creator_Data = await Creator.findOne({ email: verified_creator_Email });
  const c = new Courses({
    slug: slug,
    title: title,
    price: price,
    category: category,
    creator: Creator_Data._id,
    description: description,
    thumbnailURL: thumbnailurl,
  });
  await c.save(); // save the new Course
  Creator_Data.courses.push(c);

  await Creator_Data.save();
  return NextResponse.json({
    CreatorData: Creator_Data,
    success: true,
    AddedCourse: c,
    token: token,
  });
}

export async function GET(req) {
  // const value = await Redis.get("foo");
  // console.log("value iS:",value);
  await ConnectDB();
  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get("page") || "0");
  const limit = 4;
  const skip = page * limit;

  const allCourses = await Courses.find()
    .populate("creator", "creatorName")
    .skip(skip)
    .limit(limit)
    .lean(); // only return name and email

  if (!allCourses) return NextResponse.json({ error: "No Courses Found" });
  return NextResponse.json({ allCourses: allCourses });
}
