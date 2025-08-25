import { ConnectDB } from "@/Hooks/useConnectDB";
import User from "@/Models/User";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    await ConnectDB();

    const { email, finalPass } = await request.json();

    if (!email || !finalPass) {
      return Response.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    let user = await User.findOne({ email });
    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Hash new password with bcrypt
    const hashedPassword = bcrypt.hashSync(finalPass, 10);
    user.password = hashedPassword;
    await user.save();

    return Response.json(
      { success: true, message: "Password updated successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return Response.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
