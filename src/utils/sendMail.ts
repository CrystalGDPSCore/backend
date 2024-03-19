import "dotenv/config";

import { createTransport } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

const options: SMTPTransport.Options = {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT as string),
    auth: {
        user: process.env.SMTP_AUTH_USER,
        pass: process.env.SMTP_AUTH_PASS
    }
};

const transporter = createTransport(options);

export default async function sendMail(mail: { title: string, recipient: string, body: string }) {
    await transporter.sendMail({
        subject: mail.title,
        to: mail.recipient,
        text: mail.body
    });
}