import { ConnectDB } from "@/Hooks/useConnectDB";
import User from "@/Models/User";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function GET(req) {
  await ConnectDB();
  const authtoken = req.headers.get("authorization")?.split(" ")[1];
  const user_email = jwt.verify(authtoken, "jwtsecret").email;
  const u = await User.findOne({ email: user_email });
  if (!u) {
    return NextResponse.json({ message: "User Not Found" });
  }

  return NextResponse.json({
    username: u.username,
    bio: u.bio,
    name: u.name,
    email: u.email,
    profileImg: u.profileImg || "",
    POTD: u.POTD,
    success: true,
  });
}

export async function POST(req) {
  await ConnectDB();
  const authtoken = req.headers.get("authorization")?.split(" ")[1];
  const user_email = jwt.verify(authtoken, "jwtsecret").email;
  const u = await User.findOne({ email: user_email });
}
