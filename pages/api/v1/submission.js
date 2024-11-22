
import NextCors from 'nextjs-cors';
import formidable from 'formidable';
import path from "path";
import fs from 'fs';
import { getUserIdFromToken } from "../../../utils/services/auth";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { sendMail } from "../../../utils/sendEmail"

export const config = {
  api: {
    bodyParser: false, // Disables Next.js' default body parsing
  },
};

export default async (req, res) => {
  await NextCors(req, res, {
    // Options
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: '*',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  });

  if (req.method === 'POST') {
    const { userId } = await getUserIdFromToken(req);

    const uploadDir = path.join(process.cwd(), '/uploads');
    var submissionId;


    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    const form = formidable({ uploadDir });



    const [fields, files] = await form.parse(req);
    console.log(`${fields} ${files}`)
    const { paperTitle, abstract, eventId } = fields;
    const paperUpload = files.paperUpload;
    const newItem = await prisma.submission.create({
      data: {
        eventId: parseInt(eventId[0]),
        userId: userId,
        title: paperTitle[0],
        abstract: abstract[0],
        submissionDate: new Date().toISOString()
      }
    });
    submissionId = newItem.submissionId;

    var newFilename = files?.paperUpload[0].newFilename
    var originalFilename = files?.paperUpload[0].originalFilename
    const fileExtension = originalFilename.split('.').pop();
    originalFilename = originalFilename.split('.')[originalFilename.split('.').length - 1]
    try {
      fs.renameSync(path.join(uploadDir, newFilename),
        path.join(uploadDir, `${submissionId}.${fileExtension}`));
      console.log('File renamed successfully to:', newFilename);
    } catch (renameErr) {
      console.error('Error renaming file:', renameErr);
      return res.status(500).json({ error: 'Error renaming file' });
    }
    const user = await prisma.user.findUnique({
      where: {
        userId: userId, // Replace with the actual ID
      },
    });
    var user_name = user.firstName + " " + user.lastName;
    var user_email = user.email;
    console.log(user_email, user_name, user);
    var eventName = prisma.event.findUnique({
      where: { eventId: parseInt(eventId[0]) },
    }).eventName;
    var msg = `Dear ${user_name},
We are excited to inform you that your submission has been successfully received! 

Below are the details of your submission:
    Submission Title: ${paperTitle[0]}
    Abstract:
    ${abstract[0]}
    Event: ${eventName}

Our team will review your submission thoroughly and share updates with you soon.

Thank you for your valuable contribution to ${eventName}!

Best regards,
Web CMS`;
    await sendMail(
      user_email,
      'Submission Update',
      msg
    );
    return res.status(200).json({ fields, files });
  } else {
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
};


