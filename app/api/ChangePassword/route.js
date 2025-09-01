import { ConnectDB } from "@/Hooks/useConnectDB";
import bcrypt from "bcryptjs";
import User from "@/Models/User";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(request) {
  await ConnectDB();

  try {
    const { currentPassword, newPassword } = await request.json();
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, "jwtsecret");

    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" });
    }

    const validPassword = bcrypt.compareSync(currentPassword, user.password);
    if (!validPassword) {
      return NextResponse.json({ success: false, message: "Current password is incorrect" });
    }

    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return NextResponse.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    console.error("Error changing password:", err);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
