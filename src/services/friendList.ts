import { db } from "../utils/db";

export async function getNewFriendsCount(userId: number) {
    const friendList = await db.friendList.findFirst({
        where: {
            userId
        },
        select: {
            friends: true
        }
    });

    if (!friendList) {
        return 0;
    }

    const newFriendsCount = friendList.friends.filter(friend => friend.isNew == true).length;

    return newFriendsCount;
}

export async function getTotalFriendsCount(userId: number) {
    const friendList = await db.friendList.findFirst({
        where: {
            userId
        },
        select: {
            friends: true
        }
    });

    if (!friendList) {
        return 0;
    }

    return friendList.friends.length;
}

export async function friendExists(userId: number, friendId: number) {
    const friendList = await db.friendList.findFirst({
        where: {
            userId
        },
        select: {
            friends: true
        }
    });

    if (!friendList) {
        return false;
    }

    const friend = friendList.friends.filter(friend => friend.id == friendId);

    if (!friend.length) {
        return false;
    }

    return true;
}