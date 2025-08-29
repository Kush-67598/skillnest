import { NextResponse } from "next/server";
import { ConnectDB } from "@/Hooks/useConnectDB";
import Feedback from "@/Models/Feedback";
export async function POST(req) {
  try {
    await ConnectDB();

    const body = await req.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Save feedback to DB
    const newFeedback = await Feedback.create({ name, email, message });

    return NextResponse.json(
      {
        success: true,
        message: "Feedback submitted successfully!",
        feedback: newFeedback,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Feedback API Error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
