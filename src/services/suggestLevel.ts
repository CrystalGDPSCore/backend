import { db } from "../utils/db";

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