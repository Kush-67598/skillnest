import { ConnectDB } from "@/Hooks/useConnectDB";
import Creator from "@/Models/Creator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request) {
  await ConnectDB();

  const { email, password } = await request.json();
  if (!email || !password) {
    return Response.json({
      success: false,
      message: "Email and password are required",
    });
  }

  const User = await Creator.findOne({ email });
  if (!User) {
    return Response.json({ creator: false, message: "User not found" });
  }

  const Userfound = bcrypt.compareSync(password, User.password);
  if (Userfound) {
    const safeUser = { email: User.email, _id: User._id };
    const token = jwt.sign(
      { creatorId: User._id, email: User.email }, 
      "jwtsecret"
    );
    return Response.json({ success: true, safeUser, token });
  } else {
    return Response.json({ success: false, message: "Invalid password" });
  }
}
