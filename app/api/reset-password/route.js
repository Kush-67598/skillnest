import { ConnectDB } from "@/Hooks/useConnectDB";
import User from "@/Models/User";
import Otp from "@/Models/Otp";
import transporter from "@/app/utils/transporter";
export async function POST(request) {
  try {
    await ConnectDB();

    const { email } = await request.json();

    const req_user = await User.findOne({ email });

    if (!req_user) {
      return Response.json({ found: false }, { status: 400 });
    }

    // Generate 6-digit OTP
    const Otp_arr = [];
    for (let i = 0; i < 6; i++) {
      let rand = Math.floor(Math.random() * 10);
      Otp_arr.push(rand);
    }
    const Joined_str = Otp_arr.join("");

    try {
      await transporter.sendMail({
        from: `SteamUnlocked <${process.env.SMTP_USER}>`,
        to: email,
        subject: "Reset Password for the SteamUnlocked Account",
        text: `Hello,
You requested to reset your password.
Here is your One-Time Password (OTP): ${Joined_str}
This OTP is valid for the next 10 minutes. Please do not share it with anyone.
If you did not request this, you can ignore this email.
– Team SteamUnlocked`,
        html: `<b>Your One Time Password</b> for resetting the password for Account:${email} is: <b>${Joined_str}</b>`,
      });

      // Save OTP in DB (expires in 10 mins if you use schema with TTL index)
      const otp_user = new Otp({
        email: email,
        otp: Joined_str,
      });
      await otp_user.save();

      return Response.json({ success: true }, { status: 200 });
    } catch (err) {
      console.error("Error while sending mail", err);
      return Response.json(
        { success: false, message: "Error sending email" },
        { status: 500 }
      );
    }
  } catch (err) {
    console.error(err);
    return Response.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
