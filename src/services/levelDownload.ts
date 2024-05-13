import { db } from "../utils/db";

export async function levelDownloadExists(userId: number, levelId: number) {
    const levelDownload = await db.levelDownload.count({
        where: {
            userId,
            levelId
        }
    });

    if (!levelDownload) {
        return false;
    }

    return true;
}

export async function createLevelDownload(userId: number, levelId: number) {
    const levelDownload = await db.levelDownload.create({
        data: {
            userId,
            levelId
        }
    });

    await db.level.update({
        where: {
            id: levelId
        },
        data: {
            downloads: {
                increment: 1
            }
        }
    });

    return levelDownload;
}