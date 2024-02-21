import { createTransport } from "nodemailer";

import { smtp } from "../config.json";

const transport = createTransport(smtp);

export default async function sendMail(title: string, recipient: string, body: string) {
    await transport.sendMail({
        subject: title,
        to: recipient,
        text: body
    });
}