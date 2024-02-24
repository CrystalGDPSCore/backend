import { db } from "../utils/db";

export async function getNewMessagesCountByRecipientId(recipientId: number) {
    const messagesCount = await db.messages.count({
        where: {
            recipientId,
            isNew: true
        }
    });

    return messagesCount;
}