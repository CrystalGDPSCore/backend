import { db } from "../utils/db";

export async function getFriendRequestsCountByRecipientId(recipientId: number) {
    const friendRequestsCount = await db.friendRequests.count({
        where: {
            recipientId
        }
    });

    return friendRequestsCount;
}

export async function friendRequestExists(userId: number, recipientId: number) {
    if (!await db.friendRequests.count({ where: { userId, recipientId } })) {
        return false;
    }

    return true;
}