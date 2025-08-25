import jwt from "jsonwebtoken";

export function getAuthUser(req) {
  try {
    const authHeader = req.headers.get("authorization"); // "Bearer <token>"
    if (!authHeader) return null;

    const token = authHeader.split(" ")[1]; // take the token part
    if (!token) return null;

    const decoded = jwt.verify(token, "jwtsecret");

    return decoded; // contains email, id, etc. from when you signed the JWT
  } catch (err) {
    console.error("Auth error:", err.message);
    return null;
  }
}
