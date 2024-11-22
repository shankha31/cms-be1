import NextCors from 'nextjs-cors';
import { listItem } from "../../../utils/crud";
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

async function handler(req, res) {
  const tableName = "enrollment";
  const method = req.method;
  await NextCors(req, res, {
    // Options
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: '*',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  });

  if (method === 'POST') {
    // Extract eventId and userToken from the request body
    const { eventId } = req.body;
    const userToken = req.headers.authorization?.split(" ")[1];

    if (!eventId || !userToken) {
      return res.status(400).json({ error: 'Event ID and Participant Token are required' });
    }

    try {
      const decoded = jwt.verify(userToken, process.env.JWT_SECRET_KEY);


      const email = decoded.email;


      const user = await prisma.user.findUnique({
        where: {
          email: email,
        }
      });
      // console.log(user)

      if (!user) {
        return res.status(404).json({ error: "Participant not found" });
      }
      const userId = user.userId;


      const enrollments = await prisma.enrollment.findMany({
        where: {
          userId: userId,
        },
      });

      const isAlreadyEnrolled = enrollments.some((enrollment) => enrollment.eventId === eventId);

      if (isAlreadyEnrolled) {
        return res.status(400).json({ error: 'Participant already enrolled in this event' });
      }

      const newEnrollment = await prisma.enrollment.create({
        data: {
          userId: userId,
          eventId,
          registrationDate: new Date(),
          ticketType: 'regular', //a default ticket type or pass as needed
        },
      });

      return res.status(201).json({ message: 'Registration successful', enrollment: newEnrollment });

    } catch (error) {
      console.error(error);
      return res.status(401).json({ error: 'Invalid user token or authentication failed' });
    }
  }




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

      const enrollments = await prisma.enrollment.findMany({
        where: {
          userId: userId,
        }
      });

      return res.status(200).json(enrollments);
    } catch (error) {
      console.error(error);
      return res.status(401).json({ error: 'Invalid user token or authentication failed' });
    }
  }
  return res.status(405).end(`Method ${method} Not Allowed`);
}
export default handler;



