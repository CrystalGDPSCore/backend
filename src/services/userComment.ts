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