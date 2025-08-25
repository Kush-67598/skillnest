// import TrackCourse from "@/Models/TrackCourse";
// import { ConnectDB } from "@/Hooks/useConnectDB";
// import User from "@/Models/User";
// import jwt from "jsonwebtoken";

// export async function POST(req) {
//   await ConnectDB();

//   const { courseId, chapterId, subchapterId, lessonId } = await req.json();
//   const token = req.headers.get("authorization")?.split(" ")[1];

//   if (!token) {
//     return Response.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   const { email } = jwt.verify(token, "jwtsecret");

//   const user = await User.findOne({ email }).populate("courses");
//   if (!user) {
//     return Response.json({ error: "User not found" }, { status: 404 });
//   }

//   // Find or create progress
//   let progress = await TrackCourse.findOne({ user: user._id, courseId });
//   if (!progress) {
//     progress = new TrackCourse({
//       user: user._id,
//       courseId,
//       completedChapters: [],
//       completedSubChapters: [],
//       completedLessons: [],
//     });
//   }

//   // Initialize arrays if missing
//   progress.completedChapters ||= [];
//   progress.completedSubChapters ||= [];
//   progress.completedLessons ||= [];

//   let responseData = { success: true };

//   // Update completed items
//   if (chapterId && !progress.completedChapters.includes(chapterId)) {
//     progress.completedChapters.push(chapterId);
//     responseData.chapterSuccess = true;
//   }
//   if (subchapterId && !progress.completedSubChapters.includes(subchapterId)) {
//     progress.completedSubChapters.push(subchapterId);
//     responseData.subchapterSuccess = true;
//   }
//   if (lessonId && !progress.completedLessons.includes(lessonId)) {
//     progress.completedLessons.push(lessonId);
//     responseData.lessonSuccess = true;
//   }

//   await progress.save();

//   // Count completed items using loops
//   const course = user.courses.find((c) => c._id.toString() === courseId);
//   if (!course) {
//     return Response.json({ error: "Course not found for this user" }, { status: 404 });
//   }

//   let chaptercount = 0;
//   let subchaptercount = 0;
//   let lessoncount = 0;

//   for (const chapter of course.chapters) {
//     if (progress.completedChapters.includes(chapter._id.toString())) {
//       chaptercount++;
//     }

//     for (const subch of chapter.subChapters) {
//       if (progress.completedSubChapters.includes(subch._id.toString())) {
//         subchaptercount++;
//       }

//       for (const lesson of subch.lessons) {
//         if (progress.completedLessons.includes(lesson._id.toString())) {
//           lessoncount++;
//         }
//       }
//     }
//   }

//   responseData.chaptercount = chaptercount;
//   responseData.subchaptercount = subchaptercount;
//   responseData.lessoncount = lessoncount;

//   return Response.json(responseData);
// }

// export async function GET(req) {
//   await ConnectDB();
//   const { searchParams } = new URL(req.url);
//   const courseId = searchParams.get("courseId");

//   const token = req.headers.get("authorization")?.split(" ")[1];
//   if (!token) {
//     return Response.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   const { email } = jwt.verify(token, "jwtsecret");
//   const user = await User.findOne({ email });

//   if (!user) {
//     return Response.json({ error: "User not found" }, { status: 404 });
//   }

//   const progress = await TrackCourse.findOne({ user: user._id, courseId });

//   return Response.json({ progress });
// }

import TrackCourse from "@/Models/TrackCourse";
import { ConnectDB } from "@/Hooks/useConnectDB";
import User from "@/Models/User";
import jwt from "jsonwebtoken";

export async function POST(req) {
  await ConnectDB();

  const { courseId, chapterId, subchapterId, lessonId } = await req.json();
  const token = req.headers.get("authorization")?.split(" ")[1];

  if (!token) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { email } = jwt.verify(token, "jwtsecret");

  const user = await User.findOne({ email }).populate("courses");
  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  // Find or create progress
  let progress = await TrackCourse.findOne({ user: user._id, courseId });
  if (!progress) {
    progress = new TrackCourse({
      user: user._id,
      courseId,
      completedChapters: [],
      completedSubChapters: [],
      completedLessons: [],
    });
  }

  // Ensure arrays exist
  progress.completedChapters = progress.completedChapters || [];
  progress.completedSubChapters = progress.completedSubChapters || [];
  progress.completedLessons = progress.completedLessons || [];

  let responseData = { success: true };

  // Update completed items
  if (chapterId && !progress.completedChapters.includes(chapterId)) {
    progress.completedChapters.push(chapterId);
    responseData.chapterSuccess = true;
  }

  if (subchapterId && !progress.completedSubChapters.includes(subchapterId)) {
    progress.completedSubChapters.push(subchapterId);
    responseData.subchapterSuccess = true;
  }

  if (lessonId && !progress.completedLessons.includes(lessonId)) {
    progress.completedLessons.push(lessonId);
    responseData.lessonSuccess = true;
  }

  await progress.save();

  // Calculate counts for frontend
  const course = user.courses.find((c) => c._id.toString() === courseId);
  if (!course) {
    return Response.json({ error: "Course not found for this user" }, { status: 404 });
  }

  let chapterCount = 0;
  let subchapterCount = 0;
  let lessonCount = 0;

  course.chapters.forEach((chapter) => {
    if (progress.completedChapters.includes(chapter._id.toString())) {
      chapterCount++;
    }

    chapter.subChapters.forEach((subch) => {
      if (progress.completedSubChapters.includes(subch._id.toString())) {
        subchapterCount++;
      }

      subch.lessons.forEach((lesson) => {
        if (progress.completedLessons.includes(lesson._id.toString())) {
          lessonCount++;
        }
      });
    });
  });

  responseData.chaptercount = chapterCount;
  responseData.subchaptercount = subchapterCount;
  responseData.lessoncount = lessonCount;

  return Response.json(responseData);
}

export async function GET(req) {
  await ConnectDB();
  const { searchParams } = new URL(req.url);
  const courseId = searchParams.get("courseId");

  const token = req.headers.get("authorization")?.split(" ")[1];
  if (!token) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { email } = jwt.verify(token, "jwtsecret");
  const user = await User.findOne({ email });

  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  const progress = await TrackCourse.findOne({ user: user._id, courseId });

  return Response.json({ progress });
}
