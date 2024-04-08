import { db } from "../utils/db";

import { UpdateUserScoreInput } from "../schemas/service/user";

import { ChestType } from "../helpers/enums";

import { chests } from "../config.json";

export async function updateUserScore(userId: number, input: UpdateUserScoreInput) {
    const userStats = await db.userStats.update({
        where: {
            userId
        },
        data: input
    });

    return userStats;
}

export async function updateUserChestCount(userId: number, chestType: keyof typeof ChestType) {
    const totalUserChests = chestType == "Small" ? "totalSmallChests" : "totalBigChests";
    const lastUserChest = chestType == "Small" ? "lastSmallChest" : "lastBigChest";

    const userStats = await db.userStats.update({
        where: {
            userId
        },
        data: {
            [totalUserChests]: {
                increment: 1
            },
            [lastUserChest]: new Date()
        }
    });

    return userStats;
}

export async function getUserChestRemaining(userId: number, chestType: keyof typeof ChestType) {
    const userStats = await db.userStats.findUniqueOrThrow({
        where: {
            userId
        },
        select: {
            lastSmallChest: true,
            lastBigChest: true
        }
    });

    const chest = chestType == "Small" ? chests.small : chests.big;
    const lastUserChest = chestType == "Small" ? userStats.lastSmallChest : userStats.lastBigChest;

    return lastUserChest ? Math.max(0, chest.waitTime - Math.round((Date.now() - lastUserChest.getTime()) / 1000)) : 0;
}