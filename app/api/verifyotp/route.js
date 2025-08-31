import { ConnectDB } from "@/Hooks/useConnectDB";
import Otp from "@/Models/Otp";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await ConnectDB();

    const { otp: submittedOtp, email } = await request.json(); // rename here
    const user_email = await Otp.findOne({ email: email });

    if (user_email && user_email.otp === submittedOtp) {
      await Otp.deleteOne({ email });
      return NextResponse.json(
        { success: true, message: "OTP Verified successfully" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: false, message: "Wrong OTP Entered" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
