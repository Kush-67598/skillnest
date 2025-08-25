import { ConnectDB } from "@/Hooks/useConnectDB";
import Creator from "@/Models/Creator";
import Courses from "@/Models/Courses";
import jwt from "jsonwebtoken";

export async function GET(req) {
  await ConnectDB();
  const authtoken = req.headers.get("authorization")?.split(" ")[1];
  const creator_email = jwt.verify(authtoken, "jwtsecret").email;
  const creatorCourses = await Creator.findOne({
    email: creator_email,
  }).populate("courses");

  return Response.json({
    Creator_courses: creatorCourses,
  });
}
