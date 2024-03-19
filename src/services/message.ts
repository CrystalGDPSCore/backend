import { db } from "../utils/db";

export async function getNewMessagesByRecipientId(recipientId: number) {
    const messagesCount = await db.message.count({
        where: {
            recipientId,
            isNew: true
        }
    });

    return messagesCount;
}