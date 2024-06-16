import { db } from "../utils/db";

import { CreateCommentInput, GetCommentsInput, GetUserCommentHistoryInput } from "../schemas/service/comment";

export async function commentExists(commentId: number) {
    const comment = await db.comment.findUnique({
        where: {
            id: commentId
        }
    });

    if (!comment) {
        return false;
    }

    return true;
}

export async function createComment(input: CreateCommentInput) {
    const comment = await db.comment.create({
        data: input
    });

    return comment;
}

export async function getComments(input: GetCommentsInput) {
    const comments = await db.comment.findMany({
        where: {
            itemId: input.itemId,
            isList: input.isList
        },
        take: input.count,
        skip: input.offset,
        orderBy: {
            [input.mode == "Recent" ? "postDate" : "likes"]: "desc"
        }
    });

    return comments;
}

export async function getCommentsCount(itemId: number, isList: boolean) {
    const commentsCount = await db.comment.count({
        where: {
            itemId,
            isList
        }
    });

    return commentsCount;
}

export async function getUserCommentHistory(input: GetUserCommentHistoryInput) {
    const comments = await db.comment.findMany({
        where: {
            userId: input.userId
        },
        take: input.count,
        skip: input.offset,
        orderBy: {
            [input.mode == "Recent" ? "postDate" : "likes"]: "desc"
        }
    });

    return comments;
}

export async function getUserCommentHistoryCount(userId: number) {
    const commentsCount = await db.comment.count({
        where: {
            userId
        }
    });

    return commentsCount;
}

export async function getCommentById(commentId: number) {
    const comment = await db.comment.findUnique({
        where: {
            id: commentId
        }
    });

    return comment;
}

export async function deleteComment(commentId: number, isList: boolean) {
    const comment = await db.comment.delete({
        where: {
            id: commentId,
            isList
        }
    });

    await db.like.deleteMany({
        where: {
            itemId: commentId,
            itemType: "Comment"
        }
    });

    return comment;
}