import { db } from "../utils/db";

export async function userCommentExists(userCommentId: number) {
    const userComment = await db.userComment.findUnique({
        where: {
            id: userCommentId
        }
    });

    if (!userComment) {
        return false;
    }

    return true;
}

export async function createUserComment(userId: number, comment: string) {
    const userComment = await db.userComment.create({
        data: {
            userId,
            comment
        }
    });

    return userComment;
}

export async function getUserComments(userId: number, offset: number) {
    const userComments = await db.userComment.findMany({
        where: {
            userId
        },
        take: 10,
        skip: offset,
        orderBy: {
            id: "desc"
        }
    });

    return userComments;
}

export async function deleteUserComment(userId: number, commentId: number) {
    const userComment = await db.userComment.delete({
        where: {
            userId,
            id: commentId
        }
    });

    await db.like.deleteMany({
        where: {
            itemId: commentId,
            itemType: "UserComment"
        }
    });

    return userComment;
}

export async function getUserCommentsCount(userId: number) {
    const userCommentsCount = await db.userComment.count({
        where: {
            userId
        }
    });

    return userCommentsCount;
}