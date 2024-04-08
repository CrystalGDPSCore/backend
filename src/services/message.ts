import { db } from "../utils/db";

export async function getNewMessagesCount(recipientId: number) {
    const newMessagesCount = await db.message.count({
        where: {
            recipientId,
            isNew: true
        }
    });

    return newMessagesCount;
}