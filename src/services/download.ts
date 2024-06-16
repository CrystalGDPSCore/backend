import { db } from "../utils/db";

export async function downloadExists(userId: number, itemId: number, isList: boolean) {
    const download = await db.download.count({
        where: {
            userId,
            itemId,
            isList
        }
    });

    if (!download) {
        return false;
    }

    return true;
}

export async function createDownload(userId: number, itemId: number, isList: boolean) {
    const download = await db.download.create({
        data: {
            userId,
            itemId,
            isList
        }
    });

    if (isList) {
        await db.levelList.update({
            where: {
                id: itemId
            },
            data: {
                downloads: {
                    increment: 1
                }
            }
        });
    } else {
        await db.level.update({
            where: {
                id: itemId
            },
            data: {
                downloads: {
                    increment: 1
                }
            }
        });
    }

    return download;
}