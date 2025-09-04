import { ConnectDB } from "@/Hooks/useConnectDB";
import Transaction from "@/Models/Transaction";
import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(req) {
  await ConnectDB();

  const txn_id = `txn-${Math.floor(Math.random() * 90000)}`;

  const { name, email, amount, phone, c_id } = await req.json();

  let CreateTransaction = new Transaction({
    name: name,
    txn_id: txn_id,
    email: email,
    status: "pending",
    amount: amount,
    phone: phone ||0,
    course: c_id,
  });
  await CreateTransaction.save();

  let instance = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_KEY_ID,
    key_secret: process.env.KEY_SECRET,
  });

  const order = await instance.orders.create({
    amount: amount * 100,
    currency: "INR",
    receipt: txn_id,
    notes: {
      name,
      email,
      phone,
      course: c_id,
    },
  });

  return NextResponse.json({
    model: CreateTransaction,
    razor: order,
  });
}
