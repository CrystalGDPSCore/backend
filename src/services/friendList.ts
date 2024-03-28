import { db } from "../utils/db";

export async function getNewFriendsCount(userId: number) {
    const newFriendsCount = await db.friendList.count({
        where: {
            userId,
            isNew: true
        }
    });

    return newFriendsCount;
}

export async function friendExists(userId: number, friendId: number) {
    if (!await db.friendList.count({ where: { userId, friendId } })) {
        return false;
    }

    return true;
}