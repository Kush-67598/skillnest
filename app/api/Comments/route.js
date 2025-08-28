import { ConnectDB } from "@/Hooks/useConnectDB";
import Comments from "@/Models/Comments";

export async function POST(req) {
  await ConnectDB();
  const { text, author, parentId, courseId } = await req.json();

  const comment = new Comments({
    parentId: parentId || null,
    author,
    text,
    courseId, // make sure you're saving the courseId too
  });

  await comment.save();
  return Response.json({ success: true, comment });
}

export async function GET(req) {
  await ConnectDB();

  const { searchParams } = new URL(req.url);
  const courseId = searchParams.get("courseId");

  let comments = [];
  if (courseId) {
    comments = await Comments.find({ courseId }); // fetch ALL comments for that course
  } else {
    comments = await Comments.find(); // fallback: fetch all comments
  }

  return Response.json({ success: true, comments });
}
