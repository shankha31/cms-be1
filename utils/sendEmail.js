import nodemailer from 'nodemailer';

export async function sendMail(to, subject, text) {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            secure: 'true',
            port: 465,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            text,
        };

        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
}