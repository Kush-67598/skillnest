import { getAuthUser } from "@/app/utils/Auth_header";
import { ConnectDB } from "@/Hooks/useConnectDB";
import User from "@/Models/User";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await ConnectDB();

    const authUser = getAuthUser(req);
    if (!authUser || !authUser.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { bio, name,username } = await req.json();

    const updatedUser = await User.findOneAndUpdate(
      { email: authUser.email },
      { bio, name,username },
      { new: true } // return updated doc
    );

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        name: updatedUser.name,
        email: updatedUser.email,
        bio: updatedUser.bio,
      },
    });
  } catch (err) {
    console.error("Error updating profile:", err);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
