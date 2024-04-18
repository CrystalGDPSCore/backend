import { db } from "../utils/db";

import { CreateUserInput, UpdateUserAccessInput, UpdateUserSettingsInput } from "../schemas/service/user";

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

export async function getUsers(userIds: Array<number>) {
    const users = await db.user.findMany({
        where: {
            id: {
                in: userIds
            }
        },
        include: {
            stats: true
        }
    });

    return users;
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

export async function getUserRank(starsCount: number) {
    const userRank = await db.user.count({
        where: {
            isDisabled: false,
            stats: {
                stars: {
                    gt: starsCount
                }
            }
        }
    });

    return userRank + 1;
}