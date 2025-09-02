import { NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import User from "@/Models/User";
import Creator from "@/Models/Creator";
import jwt from "jsonwebtoken";

const client = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

export async function POST(req) {
  try {
    const body = await req.text();
    const params = new URLSearchParams(body);
    const credential = params.get("credential");
    const type = params.get("type") || "user"; // "user" or "creator"

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    let model, token;

    if (type === "creator") {
      model = await Creator.findOne({ email: payload.email });

      if (!model) {
        const createCreator = new Creator({
          name: payload.name,
          username: `@${payload.name.split(" ")[0]}${Math.floor(
            Math.random() * 54000
          )}`,
          email: payload.email,
          googleId: payload.sub,
          profileImg: payload.picture || "",
          bio: "",
        });
        await createCreator.save();
        token = jwt.sign(
          { user_id: createCreator._id, name: payload.name, email: payload.email },
          "jwtsecret"
        );
        return NextResponse.json({
          success: true,
          message: "CREATOR CREATED AND LOGGED IN SUCCESSFULLY",
          payload,
          token,
        });
      } else {
        token = jwt.sign(
          { user_id: model._id, name: payload.name, email: payload.email },
          "jwtsecret"
        );
        return NextResponse.json({
          success: true,
          message: "CREATOR LOGGED IN SUCCESSFULLY",
          payload,
          token,
        });
      }
    } else {
      // Normal User
      model = await User.findOne({ email: payload.email });

      if (!model) {
        const createUser = new User({
          name: payload.name,
          username: `@${payload.name.split(" ")[0]}${Math.floor(
            Math.random() * 54000
          )}`,
          email: payload.email,
          googleId: payload.sub,
          profileImg: payload.picture || "",
          bio: "",
        });
        await createUser.save();
        token = jwt.sign(
          { user_id: createUser._id, name: payload.name, email: payload.email },
          "jwtsecret"
        );
        return NextResponse.json({
          success: true,
          message: "USER CREATED AND LOGGED IN SUCCESSFULLY",
          payload,
          token,
        });
      } else {
        token = jwt.sign(
          { user_id: model._id, name: payload.name, email: payload.email },
          "jwtsecret"
        );
        return NextResponse.json({
          success: true,
          message: "USER LOGGED IN SUCCESSFULLY",
          payload,
          token,
        });
      }
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: err.message });
  }
}
