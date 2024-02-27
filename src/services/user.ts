import { MessageState, FriendState, CommentHistoryState } from "@prisma/client";

import { db } from "../utils/db";

import { registerUserInput } from "../schemas/user";

import { QueryMode } from "../helpers/enums";

export async function getUserById(id: number) {
    const user = await db.users.findUnique({
        where: {
            id
        },
        include: {
            stats: true
        }
    });

    return user;
}

export async function getUserByUserName(userName: string, mode: QueryMode) {
    const user = await db.users.findFirst({
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
    const user = await db.users.findFirst({
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

export async function registerUser(input: registerUserInput) {
    const user = await db.users.create({
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

    return user.id;
}

export async function updateUserAccess(userId: number, modRequested: boolean, commentColor: string) {
    await db.users.update({
        where: {
            id: userId
        },
        data: {
            modRequested,
            commentColor
        }
    });
}


export async function updateUserSettings(
    userId: number, 
    messageState: MessageState, 
    friendState: FriendState, 
    commentHistoryState: CommentHistoryState,
    youtube: string,
    twitter: string,
    twitch: string
) {
    await db.users.update({
        where: {
            id: userId
        },
        data: {
            messageState,
            friendState,
            commentHistoryState,
            youtube,
            twitter,
            twitch
        }
    });
}

export function getShownIcon(iconType: number) {
    switch (iconType) {
        case 1:
            return "Ship";
        case 2:
            return "Ball";
        case 3:
            return "Ufo";
        case 4:
            return "Wave";
        case 5:
            return "Robot";
        case 6:
            return "Spider";
        case 7:
            return "Swing";
        case 8:
            return "Jetpack"
        default:
            return "Cube";
    }
}