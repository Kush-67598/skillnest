import { ConnectDB } from "@/Hooks/useConnectDB";
import Creator from "@/Models/Creator";
import Courses from "@/Models/Courses";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function GET(req) {
  await ConnectDB();
  const authtoken = req.headers.get("authorization")?.split(" ")[1];
  const creator_email = jwt.verify(authtoken, "jwtsecret").email;
  const creatorCourses = await Creator.findOne({
    email: creator_email,
  }).populate("courses");

  return NextResponse.json({
    Creator_courses: creatorCourses,
  });
}
