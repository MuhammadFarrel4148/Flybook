import "dotenv/config";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export function generateToken(id: string, email: string) {
  const token = jwt.sign({ id: id, email: email }, JWT_SECRET!, {
    expiresIn: "1d",
  });

  return token;
}
