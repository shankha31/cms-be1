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
                where: {
                    email: email,
                }
            });
            if (!user) {
                return res.status(404).json({ error: "Participant not found" });
            }
            const userId = user.userId;
            console.log(userId)
            const submission = await prisma.submission.findMany({
                where: {
                    userId: userId,
                }
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
