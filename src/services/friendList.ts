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

    return friendList.friends.some(friend => friend.id == friendId);
}

export async function getFriendList(userId: number) {
    const friendList = await db.friendList.findUnique({
        where: {
            userId
        },
        select: {
            friends: true
        }
    });

    if (!friendList) {
        return []; 
    }

    return friendList.friends;
}

export async function updateFriendList(userId: number) {
    const friendList = await db.friendList.findUnique({
        where: {
            userId
        },
        select: {
            friends: true
        }
    });

    const updatedFriendList = await db.friendList.update({
        where: {
            userId
        },
        data: {
            friends: {
                set: friendList!.friends.map(friend => {
                    const friendInfoObj = {
                        id: friend.id,
                        isNew: false
                    };

                    return friendInfoObj;
                })
            }
        }
    });

    return updatedFriendList;
}