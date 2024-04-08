import { db } from "../utils/db";

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

    return userComment;
}