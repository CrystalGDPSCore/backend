import { db } from "../utils/db";

import { CreateLevelSuggestInput } from "../schemas/service/suggestLevel";

export async function getSuggestLevelIds(offset: number) {
    const suggestLevels = await db.suggestLevel.findMany({
        take: 10,
        skip: offset,
        orderBy: {
            suggestDate: "desc"
        }
    });

    const suggestLevelIds = suggestLevels.map(level => level.levelId);

    return suggestLevelIds;
}

export async function createLevelSuggest(input: CreateLevelSuggestInput) {
    const suggestLevel = await db.suggestLevel.create({
        data: input
    });

    return suggestLevel;
}

export async function suggestLevelExists(levelId: number) {
    const suggestLevel = await db.suggestLevel.count({
        where: {
            levelId
        }
    });

    if (!suggestLevel) {
        return false;
    }

    return true;
}