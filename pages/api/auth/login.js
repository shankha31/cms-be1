import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { generateToken } from "../../../utils/services/auth";
import NextCors from 'nextjs-cors';
const prisma = new PrismaClient();


async function handler(req, res) {
  await NextCors(req, res, {
    // Options
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: '*',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  });


  if (req.method === "POST") {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const item = await prisma.user.findUnique({
      where: { email },
    });
    if (!item) {
      return res.status(404).json({ message: "Invalid credentials" });
    }
    const passwordMatches = await bcrypt.compare(password, item.password);
    if (passwordMatches) {
      const token = generateToken(email);
      return res
        .status(200)
        .json({ status: "Success", message: "Login successful", role: item.role, userId: item.userId, token: token });
    } else {
      return res.status(404).json({ message: "Invalid credentials" });
    }


  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}

export default handler;
