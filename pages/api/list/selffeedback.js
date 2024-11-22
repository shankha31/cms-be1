import { PrismaClient } from '@prisma/client';
import NextCors from 'nextjs-cors';

const prisma = new PrismaClient();


export default async (req, res) => {
    // Enable CORS for the API
    await NextCors(req, res, {
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
        origin: '*',
        optionsSuccessStatus: 200,
    });

    // Handle GET requests to fetch feedbacks
    if (req.method === 'POST') {
        try {

            const submissionId = req.body["submissionId"]; // Extract submissionId from query parameters
            console.log(submissionId);

            if (!submissionId) {
                return res.status(400).json({ error: 'Submission ID is required' });
            }

            // Fetch feedbacks for the given submissionId and include evaluator (User) data
            const feedbacks = await prisma.feedback.findMany({
                where: {
                    submissionId: parseInt(submissionId), // Convert to integer
                },
                include: {
                    evaluator: true, // Include the evaluator (User) details
                },
            });

            // Return the feedbacks as JSON
            return res.status(200).json({ feedbacks });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error fetching feedbacks' });
        }
    } else {
        // Handle unsupported methods (only GET is allowed)
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
};
