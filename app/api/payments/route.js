import User from "@/Models/User";
import { NextResponse } from "next/server";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils";

export async function POST(req) {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature, email } =
    await req.json();

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

  return NextResponse.json({
    success: true,
    message: "Payment verified successfully",
    data: {
      order_id: razorpay_order_id,
      payment_id: razorpay_payment_id,
    },
  });
}
