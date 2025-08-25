import { ConnectDB } from "@/Hooks/useConnectDB";
import Creator from "@/Models/Creator";
import bcrypt from "bcryptjs";
export async function POST(request) {
  await ConnectDB();
  const { name, email, password } = await request.json();

  if (!name || !email || !password) {
    return Response.json({ success: false, message: "All fields are required" });
  }

  const existingUser = await Creator.findOne({ email });
  if (existingUser) {
    return Response.json({ exists:true, message: "User already exists" });
  }

  const hash = bcrypt.hashSync(password, 10);

  const u = new Creator({
    creatorName: name,
    email: email,
    password: hash,
  });

  await u.save();

  return Response.json({ CreatorUser: u, success: true });
}
