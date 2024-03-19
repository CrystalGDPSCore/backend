import { QuestType } from "@prisma/client";

import { db } from "../utils/db";

import { QuestInfo } from "../schemas/service/quest";

export async function getRandomQuests() {
    let randomQuests: QuestInfo[] = [];

    for (const type of ["Orbs", "Coins", "Stars"]) {
        const quests = await db.quest.findMany({
            where: {
                type: type as QuestType
            }
        });

        randomQuests.push(quests[Math.floor(Math.random() * quests.length)]);
    }

    return randomQuests;
}