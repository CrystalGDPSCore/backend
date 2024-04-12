import { db } from "../utils/db";

import { CreateMessageInput } from "../schemas/service/message";

export async function getNewMessagesCount(recipientId: number) {
    const newMessagesCount = await db.message.count({
        where: {
            recipientId,
            isNew: true
        }
    });

    return newMessagesCount;
}

export async function createMessage(userId: number, input: CreateMessageInput) {
    const message = await db.message.create({
        data: {
            userId,
            recipientId: input.recipientId,
            subject: input.subject,
            body: input.body
        }
    });

    return message;
}