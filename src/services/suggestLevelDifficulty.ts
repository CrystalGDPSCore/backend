import { db } from "../utils/db";

import { CreateDifficultySuggestInput } from "../schemas/service/suggestLevelDifficulty";

import { getDifficultyFromStars } from "../utils/gdForm";

export async function createDifficultySuggest(input: CreateDifficultySuggestInput) {
    const suggestLevelDifficulty = await db.suggestLevelDifficulty.create({
        data: input
    });

    const suggestLevelDifficultiesCount = await db.suggestLevelDifficulty.count({
        where: {
            levelId: input.levelId
        }
    });

    if (suggestLevelDifficultiesCount >= 3) {
        const suggestLevelDifficulties = await db.suggestLevelDifficulty.findMany({
            where: {
                levelId: input.levelId
            }
        });

        let totalStars = 0;

        suggestLevelDifficulties.map(suggest => totalStars += suggest.stars);

        let starsDifficulty = Math.round(totalStars / suggestLevelDifficultiesCount);

        if (starsDifficulty == 10) {
            starsDifficulty = 9;
        }

        const levelDifficulty = getDifficultyFromStars(starsDifficulty) as "Easy" | "Normal" | "Hard" | "Harder" | "Insane" | "Auto";

        await db.level.update({
            where: {
                id: input.levelId
            },
            data: {
                difficulty: levelDifficulty
            }
        });
    }

    return suggestLevelDifficulty;
}