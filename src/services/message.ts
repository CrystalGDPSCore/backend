import { db } from "../utils/db";

import { CreateMessageInput, GetMessagesInput, DeleteMessagesInput } from "../schemas/service/message";

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

export async function getMessage(messageId: number) {
    const message = await db.message.findFirst({
        where: {
            id: messageId
        }
    });

    return message;
}

export async function getMessages(userId: number, input: GetMessagesInput) {
    const userType = input.isSent ? "userId" : "recipientId";

    const messages = await db.message.findMany({
        where: {
            [userType]: userId
        },
        take: 10,
        skip: input.offset,
        orderBy: {
            id: "desc"
        }
    });

    return messages;
}

export async function updateMessage(recipientId: number, messageId: number) {
    const updatedMessage = await db.message.update({
        where: {
            id: messageId,
            recipientId
        },
        data: {
            isNew: false
        }
    });

    return updatedMessage;
}

export async function deleteMessages(userId: number, input: DeleteMessagesInput) {
    const userType = input.isSent ? "userId" : "recipientId";

    const { count: messagesCount } = await db.message.deleteMany({
        where: {
            id: {
                in: input.messageIds
            },
            [userType]: userId
        }
    });

    return messagesCount;
}