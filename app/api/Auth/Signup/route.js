import { ConnectDB } from "@/Hooks/useConnectDB";
import bcrypt from "bcryptjs";
import User from "@/Models/User";

export async function POST(request) {
  await ConnectDB();
  const { name, email, password } = await request.json();

  if (!name || !email || !password) {
    return Response.json({
      success: false,
      message: "All fields are required",
    });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return Response.json({ exists: true, message: "User already exists" });
  }

  const hash = bcrypt.hashSync(password, 10);

  const u = new User({
    name: name,
    email: email,
    password: hash,
    profileImg: "",
  });

  await u.save();

  return Response.json({ user: u, success: true });
}
