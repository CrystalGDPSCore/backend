import { db } from "../utils/db";

export async function blockedExists(userId: number, blockedId: number) {
    const blockList = await db.blockList.findFirst({
        where: {
            userId
        },
        select: {
            blockIds: true
        }
    });

    if (!blockList) {
        return false;
    }

    return blockList.blockIds.includes(blockedId);
}

export async function blockUser(userId: number, blockedId: number) {
    const pairs = [
        [userId, blockedId],
        [blockedId, userId]
    ];

    pairs.forEach(async ([firstId, secondId]) => {
        await db.friendRequest.deleteMany({
            where: {
                userId: firstId,
                recipientId: secondId
            }
        });

        const friendList = await db.friendList.findFirst({
            where: {
                userId: firstId
            },
            select: {
                friends: true
            }
        });
    
        if (friendList && friendList.friends.some(friend => friend.id == secondId)) {
            await db.friendList.update({
                where: {
                    userId: firstId
                },
                data: {
                    friends: {
                        set: friendList.friends.filter(friend => friend.id != secondId)
                    }
                }
            });
        }
    });

    await db.blockList.upsert({
        where: {
            userId
        },
        create: {
            userId,
            blockIds: [blockedId]
        },
        update: {
            userId,
            blockIds: {
                push: blockedId
            }
        }
    });
}

export async function unblockUser(userId: number, blockedId: number) {
    const blockList = await db.blockList.findFirst({
        where: {
            userId
        },
        select: {
            blockIds: true
        }
    });

    if (blockList && blockList.blockIds.includes(blockedId)) {
        await db.blockList.update({
            where: {
                userId
            },
            data: {
                blockIds: {
                    set: blockList.blockIds.filter(blocked => blocked != blockedId)
                }
            }
        });
    }
}

export async function getBlockList(userId: number) {
    const blockList = await db.blockList.findUnique({
        where: {
            userId
        },
        select: {
            blockIds: true
        }
    });

    if (!blockList) {
        return [];
    }

    return blockList.blockIds;
}