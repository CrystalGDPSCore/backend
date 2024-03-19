import { db } from "../utils/db";

import { CreateUserInput, UpdateUserAccessInput, UpdateUserSettingsInput, UpdateUserScoreInput } from "../schemas/service/user";

import { QueryMode } from "../helpers/enums";

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

export async function getUserByName(userName: string, mode: QueryMode) {
    const user = await db.user.findFirst({
        where: {
            userName: {
                equals: userName,
                mode: mode
            }
        },
        include: {
            stats: true
        }
    });

    return user;
}

export async function getUserByEmail(email: string, mode: QueryMode) {
    const user = await db.user.findFirst({
        where: {
            email: {
                equals: email,
                mode: mode
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
    const user = await db.userStats.update({
        where: {
            userId
        },
        data: input
    });

    return user;
}