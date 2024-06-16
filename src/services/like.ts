import { ItemType } from "@prisma/client";

import { db } from "../utils/db";

import { CreateLikeInput } from "../schemas/service/like";

export async function likeExists(userId: number, itemId: number, itemType: keyof typeof ItemType) {
    const like = await db.like.findFirst({
        where: {
            userId,
            itemId,
            itemType
        }
    });

    if (!like) {
        return false;
    }

    return true;
}

export async function createLike(input: CreateLikeInput) {
    const likeOperation = input.likeType == "Like" ? "increment" : "decrement";

    const like = await db.like.create({
        data: input
    });

    switch (input.itemType) {
        case "Level":
            await db.level.update({
                where: {
                    id: input.itemId
                },
                data: {
                    likes: {
                        [likeOperation]: 1
                    }
                }
            });
            break;
        case "Comment":
            await db.comment.update({
                where: {
                    id: input.itemId
                },
                data: {
                    likes: {
                        [likeOperation]: 1
                    }
                }
            });
            break;
        case "UserComment":
            await db.userComment.update({
                where: {
                    id: input.itemId
                },
                data: {
                    likes: {
                        [likeOperation]: 1
                    }
                }
            });
            break;
        case "LevelList":
            await db.levelList.update({
                where: {
                    id: input.itemId
                },
                data: {
                    likes: {
                        [likeOperation]: 1
                    }
                }
            });
            break;
    }

    return like;
}