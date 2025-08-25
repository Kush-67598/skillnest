import { validateWebhookSignature } from "razorpay/dist/utils/razorpay-utils";
import Transaction from "@/Models/Transaction";
import User from "@/Models/User";
export async function POST(req) {
  const webhookSignature = req.headers.get("X-Razorpay-Signature");
  const webhookSecret = process.env.WEBHOOK_SECRET;
  const webhookBody = await req.text();
  const validate = validateWebhookSignature(
    webhookBody,
    webhookSignature,
    webhookSecret
  );
  if (!validate) {
    return Response.json({ success: false });
  }
  const payload = JSON.parse(webhookBody);
  const entity = payload.payload.payment.entity;
  const email = entity.email;
  const status = entity.status;
  if (status == "captured") {
    const txn = await Transaction.findOneAndUpdate(
      { email: email },
      { status: "completed" },
      { new: true }
    );
    // const premiumUser=await User.findOneAndUpdate({email:email},{premium:razor})
  }
  console.log("kushRes", webhookBody);

  return Response.json({ success: true, KUSHRES: webhookBody });
}
