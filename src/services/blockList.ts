import { db } from "../utils/db";

export async function blockedExists(userId: number, blockedId: number) {
    const blockList = await db.blockList.findFirst({
        where: {
            userId
        },
        select: {
            blockIds: true
        }
    });

    if (!blockList) {
        return false;
    }

    return blockList.blockIds.includes(blockedId);
}