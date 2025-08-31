import { NextResponse } from "next/server";
import User from "@/Models/User";
import Bookmarks from "@/Models/Bookmarks";
import { getAuthUser } from "@/app/utils/Auth_header";

// POST: Add a course to bookmarks
export async function POST(req) {
  try {
    // 1. Decode token
    const user = getAuthUser(req);
    console.log(user);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2. Verify user exists
    const legit_user = await User.findById(user.userId);
    if (!legit_user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // 3. Extract courseId from request body
    const body = await req.json();
    const { courseId } = body;
    if (!courseId) {
      return NextResponse.json(
        { success: false, error: "Course ID required" },
        { status: 400 }
      );
    }

    // 4. Find or create bookmark document
    let bookmarkDoc = await Bookmarks.findOne({ user: legit_user._id });
    if (!bookmarkDoc) {
      bookmarkDoc = new Bookmarks({
        user: legit_user._id,
        courses: [courseId],
      });
    } else {
      if (!bookmarkDoc.courses.includes(courseId)) {
        bookmarkDoc.courses.push(courseId);
      } else {
        bookmarkDoc.courses.pull(courseId);
      }
    }

    await bookmarkDoc.save();

    return NextResponse.json({
      success: true,
      message: "Bookmark updated",
      bookmark: bookmarkDoc,
    });
  } catch (err) {
    console.error("POST /api/bookmark error:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

// GET: Fetch all bookmarks of the user
export async function GET(req) {
  try {
    // 1. Decode token
    const user = getAuthUser(req);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2. Verify user exists
    const legit_user = await User.findById(user.user_id);
    if (!legit_user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // 3. Find bookmarks and populate courses
    const bookmarkDoc = await Bookmarks.findOne({
      user: legit_user._id,
    }).populate("courses");

    return NextResponse.json({
      success: true,
      bookmarks: bookmarkDoc ? bookmarkDoc.courses : [],
    });
  } catch (err) {
    console.error("GET /api/bookmark error:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
