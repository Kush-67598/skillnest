import { getAuthUser } from "@/app/utils/Auth_header";
import { ConnectDB } from "@/Hooks/useConnectDB";
import User from "@/Models/User";
import { NextResponse } from "next/server";

export async function POST(req) {
  await ConnectDB();
  const { correct, difficulty } = await req.json();
  const verifieduser = getAuthUser(req);
  

  const user = await User.findOne({ email: verifieduser.email });
  if (!user)
    return NextResponse.json({ success: false, message: "User not found" });

  if (!correct) {
    return NextResponse.json({ success: false, message: "Incorrect answer" });
  }

  const today = new Date();
  const todayStr = today.toISOString().split("T")[0]; // YYYY-MM-DD only
  const lastSolved = user.POTD[0].lastSolvedDate
    ? user.POTD[0].lastSolvedDate.toISOString().split("T")[0]
    : null;

  if (lastSolved === todayStr) {
    // already solved today, don’t increase streak
    return NextResponse.json({
      success: true,
      message: "Already solved today",
    });
  }

  // Check streak logic
  let streak = user.POTD[0].POTDStreak;
  if (lastSolved) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    if (lastSolved === yesterdayStr) {
      streak += 1; // consecutive day
    } else {
      streak = 1; // reset streak
    }
  } else {
    streak = 1; // first solve ever
  }
  let base = difficulty === "Easy" ? 10 : difficulty === "Medium" ? 20 : 30;

  let dailyScore = base + 2 * streak;
  // Update user
  user.POTD[0].POTDStreak = streak;
  user.POTD[0].lastSolvedDate = today;
  user.POTD[0].TotalSolved += 1;
  user.POTD[0].OverallCodingScore += dailyScore;

  await user.save();

  return NextResponse.json({
    success: true,
    message: "Data Updated",
    streak,
    overallScore: user.POTD[0].OverallCodingScore,
  });
}
