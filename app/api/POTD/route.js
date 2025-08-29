import { ConnectDB } from "@/Hooks/useConnectDB";
import User from "@/Models/User";
import { getAuthUser } from "@/app/utils/Auth_header";
export async function POST(req) {
  await ConnectDB();
  const authUser = getAuthUser(req);
  const { Question, Answer, Difficulty } = await req.json();
  const Verified_User = await User.findOne({ email: authUser.email });
//   console.log(Verified_User);
  const POTD_Data = {
    Question: Question,
    Answer: Answer,
    Difficulty: Difficulty,
  };
//   console.log("POTD_DataSERVER",POTD_Data);
  const exists = Verified_User.POTD.length !== 0;
  if (!exists) {
    Verified_User.POTD.push(POTD_Data);
  } else {
    return Response.json({ Message: "Problem Already Assigned" });
  }

  await Verified_User.save();
  return Response.json({
    success: true,
    message: " Question Successfully Added To Your POTD",
  });
}
