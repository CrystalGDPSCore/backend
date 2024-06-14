import { db } from "../utils/db";

import { CreateLevelListInput, UpdateLevelListInput } from "../schemas/service/levelList";

export async function listExists(listId: number) {
    const levelList = await db.levelList.findUnique({
        where: {
            id: listId
        }
    });

    if (!levelList) {
        return false;
    }

    return true;
}

export async function createList(input: CreateLevelListInput) {
    const levelList = await db.levelList.create({
        data: {
            ...input,
            version: 1
        }
    });

    return levelList;
}

export async function updateList(listId: number, input: UpdateLevelListInput) {
    const levelList = await db.levelList.update({
        where: {
            id: listId
        },
        data: {
            ...input,
            version: {
                increment: 1
            },
            updateDate: new Date()
        }
    });

    return levelList;
}