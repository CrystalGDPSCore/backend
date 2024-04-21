import { db } from "../utils/db";

import { CreateLevelInput, UpdateLevelInput } from "../schemas/service/level";

export async function levelExists(levelId: number) {
    const level = await db.level.findUnique({
        where: {
            id: levelId
        }
    });

    if (!level) {
        return false;
    }

    return true;
}

export async function createLevel(input: CreateLevelInput) {
    const level = await db.level.create({
        data: input
    });

    return level;
}

export async function updateLevel(levelId: number, input: UpdateLevelInput) {
    const level = await db.level.update({
        where: {
            id: levelId
        },
        data: input
    });

    return level;
}