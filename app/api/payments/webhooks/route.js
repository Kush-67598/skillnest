import { validateWebhookSignature } from "razorpay/dist/utils/razorpay-utils";
import { ConnectDB } from "@/Hooks/useConnectDB";
import Transaction from "@/Models/Transaction";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await ConnectDB();

    const webhookSecret = process.env.WEBHOOK_SECRET;
    const webhookBody = await req.text();
    const webhookSignature = req.headers.get("X-Razorpay-Signature");

    const validate = validateWebhookSignature(
      webhookBody,
      webhookSignature,
      webhookSecret
    );
    console.log("Webhook validation:", validate);

    if (!validate) {
      return NextResponse.json({
        success: false,
        message: "Invalid signature",
      });
    }

    const payload = JSON.parse(webhookBody);
    const entity = payload.payload.payment.entity;

    // Use receipt or notes as fallback if email is missing
    const email = entity.email || entity.notes?.email;
    const txnId = entity.receipt;

    const txn = await Transaction.findOneAndUpdate(
      email ? { email } : { txn_id: txnId },
      { status: "completed" },
      { new: true }
    );

    console.log("Updated transaction:", txn);
    console.log("Webhook payload:", payload);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ success: false, error: err.message });
  }
}
