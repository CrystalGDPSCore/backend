import { db } from "../utils/db";

export async function getMapPacks(offset: number) {
    const mapPacks = await db.mapPack.findMany({
        take: 10,
        skip: offset,
        orderBy: {
            id: "asc"
        }
    });

    return mapPacks;
}

export async function getMapPacksCount() {
    const mapPacksCount = await db.mapPack.count();

    return mapPacksCount;
}