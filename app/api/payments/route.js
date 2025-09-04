import { ConnectDB } from "@/Hooks/useConnectDB";
import User from "@/Models/User";
import { NextResponse } from "next/server";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils";

export async function POST(req) {
  await ConnectDB();
  const {
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
    email,
    courseId,
  } = await req.json();
  console.log(
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
    email,
    courseId
  );

  const validate = validatePaymentVerification(
    { order_id: razorpay_order_id, payment_id: razorpay_payment_id },
    razorpay_signature,
    process.env.KEY_SECRET
  );
  if (!validate) {
    return NextResponse.json(
      { success: false, message: "Payment Verification Failed" },
      { status: 400 }
    );
  }
  const verifiedUser = await User.findOne({ email: email });
  console.log(verifiedUser);
  verifiedUser.premiumCourseID.push(courseId);
  await verifiedUser.save();

  return NextResponse.json({
    success: true,
    message: "Payment verified successfully",
    data: {
      order_id: razorpay_order_id,
      payment_id: razorpay_payment_id,
    },
  });
}
