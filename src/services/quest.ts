import { QuestType, $Enums } from "@prisma/client";

import { db } from "../utils/db";

export async function getRandomQuests() {
    const randomQuests = Promise.all(["Orbs", "Coins", "Stars"].map(async type => {
        const quests = await db.quest.findMany({
            where: {
                type: type as QuestType
            }
        });

        return quests[Math.floor(Math.random() * quests.length)];
    }));

    return randomQuests;
}