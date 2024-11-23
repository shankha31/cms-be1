import NextCors from 'nextjs-cors';
import { listItem } from "../../../utils/crud";
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

async function handler(req, res) {
  await NextCors(req, res, {
    // Options
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: '*',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  });
  const method = req.method;
  const tableName = "submission";
  if (req.method === "GET") {
    // const { userToken } = req.headers;
    const userToken = req.headers.authorization?.split(" ")[1];

    if (!userToken) {
      return res.status(400).json({ error: 'Participant token is required in authorization header' });
    }

    try {
      const decoded = jwt.verify(userToken, process.env.JWT_SECRET_KEY);

      const email = decoded.email;
      console.log(decoded)

      const user = await prisma.user.findUnique({
        where: { email },
        include: { userExpertise: { select: { expertiseId: true } } },
      });
      if (!user) {
        return res.status(404).json({ error: "Participant not found" });
      }
      const userExpertiseIds = user.userExpertise.map((ue) => ue.expertiseId);
      const userId = user.userId;
      console.log(userId)
      const submission = await prisma.submission.findMany({
        where: {
          AND: [
            { userId: { not: userId } }, // Exclude submissions by the user
            {
              submissionExpertise: {
                some: {
                  expertiseId: {
                    in: userExpertiseIds, // Match expertise
                  },
                },
              },
            },
          ],
        },
        include: {
          submissionExpertise: { include: { expertise: true } }, // Include expertise details
          user: true, // Include user details for context
        },
      });

      return res.status(200).json(submission);
    } catch (error) {
      console.error(error);
      return res.status(401).json({ error: 'Invalid user token or authentication failed' });
    }
  }

  return res.status(405).end(`Method ${method} Not Allowed`);
}

export default handler;

//peer review fetch all the submission papers except the user paper user will be ftched via token from the frontend
