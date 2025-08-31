import { ConnectDB } from "@/Hooks/useConnectDB";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@/Models/User";
import { NextResponse } from "next/server";

export async function POST(request) {
  await ConnectDB();

  const { email, password } = await request.json();
  if (!email || !password) {
    return NextResponse.json({
      success: false,
      message: "Email and password are required",
    });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ user: false, message: "User not found" });
  }

  const userfound = bcrypt.compareSync(password, user.password);
  if (userfound) {
    const safeUser = { email: user.email, name: user.name, _id: user._id };
    const token = jwt.sign(
      { userId: user._id, email: user.email }, // typo fixed from emai → email
      "jwtsecret"
    );
    return NextResponse.json({ success: true, safeUser, token });
  } else {
    return NextResponse.json({ success: false, message: "Invalid password" });
  }
}
