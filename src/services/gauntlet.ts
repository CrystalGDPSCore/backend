import { db } from "../utils/db";

export async function getGauntlets() {
    const gauntlets = await db.gauntlet.findMany({
        orderBy: {
            id: "asc"
        }
    });

    return gauntlets;
}

export async function getGauntletLevels(gauntletId: number) {
    const gauntlet = await db.gauntlet.findUnique({
        where: {
            id: gauntletId
        }
    });

    if (!gauntlet || gauntlet.levelIds.length != 5) {
        return [];
    }

    const levels = await db.level.findMany({
        where: {
            id: {
                in: gauntlet.levelIds
            }
        },
        orderBy: {
            difficulty: "asc"
        }
    });

    return levels;
}