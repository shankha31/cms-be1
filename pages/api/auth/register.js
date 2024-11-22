// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();
export default async function handler(req, res) {
  if (req.method === "POST") {
    const { firstName, lastName, email, password, role, description, expertise } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role,
        description,
        expertise
      },
    });

    return res.status(201).json({ message: "Registration Successful" });
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
