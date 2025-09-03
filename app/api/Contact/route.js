import { ConnectDB } from "@/Hooks/useConnectDB";
import { NextResponse } from "next/server";
import Contact from "@/Models/Contact";
export async function POST(req) {
  try {
    await ConnectDB();

    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    // Save contact to MongoDB
    const newContact = await Contact.create({ name, email, message });

    return NextResponse.json({
      success: true,
      message: "Message received",
      data: newContact,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();

    const contacts = await Contact.find().sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: contacts });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
