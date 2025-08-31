import User from "@/Models/User";
import { ConnectDB } from "@/Hooks/useConnectDB";
import { NextResponse } from "next/server";
export async function POST(req) {
  await ConnectDB();
  const { email, image } = await req.json();
  const user = await User.findOneAndUpdate(
    { email },
    { profileImg: image },
    { new: true }
  );
  if (!user) {
    return NextResponse.json(
      { success: false, message: "User not found" },
      { status: 404 }
    );
  }
  return NextResponse.json({
    user,
    success: true,
    message: "Profile Uploaded Successfully",
  });
}
