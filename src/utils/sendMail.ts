import "dotenv/config";

import { createTransport } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

import { mailInfoObj } from "../schemas/util/sendMail";

const options: SMTPTransport.Options = {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT!),
    auth: {
        user: process.env.SMTP_AUTH_USER,
        pass: process.env.SMTP_AUTH_PASS
    }
};

const transporter = createTransport(options);

export default async function sendMail(mail: mailInfoObj) {
    await transporter.sendMail({
        subject: mail.title,
        to: mail.recipient,
        text: mail.body
    });
}