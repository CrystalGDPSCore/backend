import { db } from "../utils/db";

import { CreateUserInput, UpdateUserAccessInput, UpdateUserSettingsInput, UpdateUserScoreInput } from "../schemas/service/user";

import { QueryMode, ChestType } from "../helpers/enums";

import { chests } from "../config.json";

export async function getUserById(id: number) {
    const user = await db.user.findUnique({
        where: {
            id
        },
        include: {
            stats: true
        }
    });

    return user;
}

export async function getUserByName(userName: string, mode: keyof typeof QueryMode) {
    const user = await db.user.findFirst({
        where: {
            userName: {
                equals: userName,
                mode
            }
        },
        include: {
            stats: true
        }
    });

    return user;
}

export async function getUserByEmail(email: string, mode: keyof typeof QueryMode) {
    const user = await db.user.findFirst({
        where: {
            email: {
                equals: email,
                mode
            }
        },
        include: {
            stats: true
        }
    });

    return user;
}

export async function createUser(input: CreateUserInput) {
    const user = await db.user.create({
        data: {
            ...input,
            stats: {
                create: {}
            }
        },
        include: {
            stats: true
        }
    });

    return user;
}

export async function updateUserAccess(userId: number, input: UpdateUserAccessInput) {
    const user = await db.user.update({
        where: {
            id: userId
        },
        data: input
    });

    return user;
}


export async function updateUserSettings(userId: number, input: UpdateUserSettingsInput) {
    const user = await db.user.update({
        where: {
            id: userId
        },
        data: input
    });

    return user;
}

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