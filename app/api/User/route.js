import { getAuthUser } from "@/app/utils/Auth_header";
import { ConnectDB } from "@/Hooks/useConnectDB";
import User from "@/Models/User";
import jwt from "jsonwebtoken";

import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await ConnectDB();

    const verified_user = await getAuthUser(req);

    // Auth failed or token missing
    if (!verified_user || !verified_user.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const u = await User.findOne({ email: verified_user.email }).lean();

    // User not found ≠ server crash
    if (!u) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      username: u.username,
      bio: u.bio,
      name: u.name,
      email: u.email,
      profileImg: u.profileImg || "",
      POTD: u.POTD,
      googleId: u.googleId,
      pro: u.pro,
      premiumCourseID: u.premiumCourseID,
    });
  } catch (err) {
    console.error("GET /user error:", err);

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

// For Demo The Above Code is Commented
// export async function GET(req) {
//   await ConnectDB();
//   const verified_user = getAuthUser(req);

//   const u = await User.findOne({ email: verified_user.email });
//   if (!u) {
//     return NextResponse.json({ message: "User Not Found" });
//   }

//   return NextResponse.json({
//     username: u.username,
//     bio: u.bio,
//     name: u.name,
//     email: u.email,
//     profileImg: u.profileImg || "",
//     POTD: u.POTD,
//     googleId: u.googleId,
//     pro: u.pro,
//     premiumCourseID: u.premiumCourseID,
//     success: true,
//   });
// }

export async function POST(req) {
  await ConnectDB();
  const authtoken = req.headers.get("authorization")?.split(" ")[1];
  if (!authtoken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const verified_user = getAuthUser(req);
    const u = await User.findOne({ email: verified_user.email });
    if (!u) {
      return NextResponse.json({ message: "User Not Found" }, { status: 404 });
    }

    u.pro = true;
    u.proClaimedAt = new Date();
    await u.save();

    return NextResponse.json({
      message: "Pro activated successfully!",
      pro: true,
      success: true,
    });
  } catch (err) {
    console.error("Error in claim-pro:", err);
    return NextResponse.json({ message: "Invalid token" }, { status: 400 });
  }
}
