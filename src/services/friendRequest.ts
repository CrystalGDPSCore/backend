import { db } from "../utils/db";

import { CreateFriendRequestInput, GetFriendRequestsInput, AddFriendFromRequestInput } from "../schemas/service/friendRequest";

export async function getNewFriendRequestsCount(recipientId: number) {
    const newFriendRequestsCount = await db.friendRequest.count({
        where: {
            recipientId,
            isNew: true
        }
    });

    return newFriendRequestsCount;
}

export async function friendRequestExists(userId: number, recipientId: number) {
    const friendRequest = await db.friendRequest.count({
        where: {
            userId,
            recipientId
        }
    });

    if (!friendRequest) {
        return false;
    }

    return true;
}

export async function createFriendRequest(userId: number, input: CreateFriendRequestInput) {
    const friendRequest = await db.friendRequest.create({
        data: {
            userId,
            ...input
        }
    });

    return friendRequest;
}

export async function getFriendRequests(userId: number, input: GetFriendRequestsInput) {
    const userType = input.isSent ? "userId" : "recipientId";

    const friendRequests = await db.friendRequest.findMany({
        where: {
            [userType]: userId
        },
        take: 10,
        skip: input.offset,
        orderBy: {
            id: "desc"
        }
    });

    return friendRequests;
}

export async function getFriendRequest(userId: number, recipientId: number) {
    const friendRequest = await db.friendRequest.findFirst({
        where: {
            userId,
            recipientId
        }
    });

    return friendRequest;
}

export async function readFriendRequest(recipientId: number, requestId: number) {
    const friendRequest = await db.friendRequest.update({
        where: {
            id: requestId,
            recipientId
        },
        data: {
            isNew: false
        }
    });

    return friendRequest;
}

export async function addFriendFromRequest(input: AddFriendFromRequestInput) {
    const pairs = [
        [input.userId, input.recipientId],
        [input.recipientId, input.userId]
    ];

    await db.friendRequest.delete({
        where: {
            id: input.requestId,
            userId: input.userId,
            recipientId: input.recipientId
        }
    });

    pairs.map(async ([userId, friendId]) => {
        await db.friendList.upsert({
            where: {
                userId
            },
            create: {
                userId,
                friends: [
                    {
                        id: friendId,
                        isNew: true
                    }
                ]
            },
            update: {
                userId,
                friends: {
                    push: {
                        id: friendId,
                        isNew: true
                    }
                }
            }
        });
    });
}

export async function deleteFriendRequests(userIds: number[], recipientId: number) {
    const { count: friendRequestsCount } = await db.friendRequest.deleteMany({
        where: {
            userId: {
                in: userIds
            },
            recipientId
        }
    });

    return friendRequestsCount;
}