import { ConnectDB } from "@/Hooks/useConnectDB";
import User from "@/Models/User";
import { getAuthUser } from "@/app/utils/Auth_header";

export async function POST(req) {
  await ConnectDB();
  const authUser = getAuthUser(req);
  const today = new Date();
  const { Question, Answer, Difficulty } = await req.json();

  const Verified_User = await User.findOne({ email: authUser.email });

  const POTD_Data = {
    Question,
    Answer,
    Difficulty,
    expiresAt: new Date(today.setHours(23, 59, 59, 999)), // always set expiry at EOD
  };

  const exists = Verified_User.POTD.length !== 0;

  if (!exists) {
    Verified_User.POTD.push(POTD_Data);
    await Verified_User.save();
    return Response.json({
      success: true,
      message: "Question successfully added to your POTD",
    });
  }

  if (Verified_User.POTD[0].expiresAt < today) {
    Verified_User.POTD[0] = POTD_Data;
    await Verified_User.save();
    return Response.json({
      success: true,
      message: "Previous POTD expired. New POTD assigned successfully.",
    });
  }

  // Still valid
  return Response.json({
    success: false,
    message: "Problem already assigned for today",
  });
}
