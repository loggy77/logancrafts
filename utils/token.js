import jwt from "jsonwebtoken";

export default async function checkToken(token) {
  const isValid = await jwt.verify(token, process.env.KEY);
  return isValid;
}
