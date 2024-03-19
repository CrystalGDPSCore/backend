import { db } from "../utils/db";

export async function getFriendRequestsByRecipientId(recipientId: number) {
    const friendRequestsCount = await db.friendRequest.count({
        where: {
            recipientId
        }
    });

    return friendRequestsCount;
}

export async function friendRequestExists(userId: number, recipientId: number) {
    if (!await db.friendRequest.count({ where: { userId, recipientId } })) {
        return false;
    }

    return true;
}