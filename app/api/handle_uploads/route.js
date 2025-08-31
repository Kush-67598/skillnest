import crypto from "crypto";
import { NextResponse } from "next/server";
export async function POST() {
  const timestamp = Math.round(new Date().getTime() / 1000);

  const paramsToSign = `folder=SKILLNEST&timestamp=${timestamp}`;
  const signature = crypto
    .createHash("sha1")
    .update(paramsToSign + process.env.CLOUDINARY_API_SECRET)
    .digest("hex");
  return new NextResponse(
    JSON.stringify({
      signature,
      timestamp,
      apiKey: process.env.CLOUDINARY_API_KEY,
      folder: "SKILLNEST",
    })
  );
}
