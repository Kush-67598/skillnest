import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import TrackCourse from "@/Models/TrackCourse";
import User from "@/Models/User";
import { ConnectDB } from "@/Hooks/useConnectDB";

export async function POST(req) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return Response.json(
        { success: false, message: "No token" },
        { status: 401 }
      );
    }

    const { courseId, chapterId, subchapterId, lessonId } = await req.json();
    const email = jwt.verify(token, "jwtsecret").email;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return Response.json(
        { success: false, message: "Invalid courseId" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Update the existing track doc for this user + course
    const updateFields = {
      chapterId: chapterId || undefined,
      subchapterId: subchapterId || undefined,
      lessonId: lessonId || undefined,
    
    };
    if (chapterId) {
      updateFields.subchapterId = null;
      updateFields.lessonId = null;
    }

    if (subchapterId && !chapterId) {
      updateFields.lessonId = null; // reset lessonId when subchapter changes
    }
    

    const updated = await TrackCourse.findOneAndUpdate(
      { user: user._id, courseId },
      { $set: updateFields },
      { new: true } //“Return the updated document after making the change.”
    );

    if (!updated) {
      return Response.json(
        { success: false, message: "Tracking record not found" },
        { status: 404 }
      );
    }

    return Response.json({ success: true, track: updated });
  } catch (err) {
    console.error(err);
    return Response.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    await ConnectDB();
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return Response.json({ success: false, message: "No token" }, { status: 401 });
    }

    const email = jwt.verify(token, "jwtsecret").email;
    const user = await User.findOne({ email });

    if (!user) {
      return Response.json({ success: false, message: "User not found" }, { status: 404 });
    }

    const getTracked = await TrackCourse.find({ user: user._id });
    return Response.json({ success: true, getTracked });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
