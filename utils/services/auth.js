import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const jwt = require("jsonwebtoken");
require("dotenv").config();

const getUserIdFromToken = async (req) => {
  // 1. Extract token from Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader) throw new Error('Authorization header is missing');

  const token = authHeader.split(' ')[1]; // "Bearer <token>"
  if (!token) throw new Error('Token is missing');

  try {
    // 2. Verify and decode the token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // 3. Extract user ID from the token
    const email = decodedToken.email; // Adjust based on your token payload structure
    const userId = await prisma.user.findUnique({
      where: {
        email: email,
      }
    });
    if (!userId) throw new Error('User ID not found in token');

    return userId; // or return `user` if you need the user object
  } catch (error) {
    throw new Error(`Token validation failed: ${error.message}`);
  }
};


function generateToken(email) {
  const payload = { email };

  const secretKey = process.env.JWT_SECRET_KEY;

  const token = jwt.sign(payload, secretKey);

  return token;
}

function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log("Decoded Payload:", decoded);
    return decoded;
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return null;
  }
}

module.exports = { verifyToken, generateToken, getUserIdFromToken };
