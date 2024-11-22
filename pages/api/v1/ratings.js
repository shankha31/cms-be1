
import NextCors from 'nextjs-cors';

import fs from 'fs';
import { getUserIdFromToken } from "../../../utils/services/auth";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async (req, res) => {
    await NextCors(req, res, {
        // Options
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
        origin: '*',
        optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    });
    const { comment, rating, submissionId } = req.body;

    if (req.method === 'POST') {
        const { userId } = await getUserIdFromToken(req);
        const newItem = await prisma.feedback.create({
            data: {
                submissionId: submissionId,
                evaluatorId: userId,
                comments: comment,
                rating: rating
            }
        });

        return res.status(200).json({ success: true, data: newItem });
    } else {
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
};


