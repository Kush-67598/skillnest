import User from "@/Models/User";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import TrackCourse from "@/Models/TrackCourse";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    const email = jwt.verify(token, "jwtsecret").email;

    const { courseId } = await req.json();

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return NextResponse.json(
        { success: false, message: "Invalid courseId" },
        { status: 400 }
      );
    }

    const u = await User.findOne({ email });
    if (!u) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const alreadyEnrolled = u.courses.some((i) => i.equals(courseId));
    if (!alreadyEnrolled) {
      u.courses.push(courseId);
      await u.save();
    }

    // Ensure track course record exists
    const existingTrack = await TrackCourse.findOne({ user: u._id, courseId });
    if (!existingTrack) {
      await TrackCourse.create({
        user: u._id,
        courseId,
        chapterId: null,
        subchapterId: null,
        lessonId: null,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    const email = jwt.verify(token, "jwtsecret").email;

    const u = await User.findOne({ email }).populate("courses"); // populate to get course details

    if (!u)
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );

    return NextResponse.json({ success: true, courses: u.courses });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
