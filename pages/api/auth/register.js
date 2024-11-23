import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import NextCors from "nextjs-cors";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  // Enable CORS
  await NextCors(req, res, {
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: '*', // Replace '*' with specific origins in production for better security
    optionsSuccessStatus: 200, // Legacy browsers support
  });

  if (req.method === "POST") {
    try {
      const {
        firstName,
        lastName,
        email,
        password,
        role,
        description,
        expertise
      } = req.body;
      // console.log(req)
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user in the database
      const user = await prisma.user.create({
        data: {
          firstName,
          lastName,
          email,
          password: hashedPassword,
          role,
          description
        },
      });
      // Add expertise (if provided)


      // Map user to expertise
      await prisma.userExpertise.createMany({
        data: expertise.map((exp) => ({
          userId: user.userId,
          expertiseId: exp,
        })),
      });
      return res.status(201).json({ message: "Registration Successful", user });
    } catch (error) {
      console.error("Error during registration:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
