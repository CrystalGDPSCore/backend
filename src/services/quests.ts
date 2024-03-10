import { db } from "../utils/db";

export async function getRandomQuests() {
    const orbsQuests = await db.quests.findMany({
        where: {
            type: "Orbs"
        }
    });

    const coinsQuests = await db.quests.findMany({
        where: {
            type: "Coins"
        }
    });

    const starsQuests = await db.quests.findMany({
        where: {
            type: "Stars"
        }
    });

    return [
        orbsQuests[Math.floor(Math.random() * orbsQuests.length)],
        coinsQuests[Math.floor(Math.random() * coinsQuests.length)],
        starsQuests[Math.floor(Math.random() * starsQuests.length)]
    ];
}