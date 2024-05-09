import { Prisma } from "@prisma/client";

import { db } from "../utils/db";

import { CreateLevelInput, UpdateLevelInput } from "../schemas/service/level";

export async function levelExists(levelId: number) {
    const level = await db.level.findUnique({
        where: {
            id: levelId
        }
    });

    if (!level) {
        return false;
    }

    return true;
}

export async function createLevel(input: CreateLevelInput) {
    const level = await db.level.create({
        data: input
    });

    return level;
}

export async function updateLevel(levelId: number, input: UpdateLevelInput) {
    const level = await db.level.update({
        where: {
            id: levelId
        },
        data: input
    });

    return level;
}

export async function getLevelById(levelId: number) {
    const level = await db.level.findUnique({
        where: {
            id: levelId
        }
    });

    return level;
}

export async function getLevels(args: Prisma.LevelWhereInput, orderBy: Array<Prisma.LevelOrderByWithRelationInput>, offset: number) {
    const levels = await db.level.findMany({
        where: args,
        take: 10,
        skip: offset,
        orderBy
    });

    return levels;
}

export async function getLevelsCount(args: Prisma.LevelWhereInput) {
    const levelsCount = await db.level.count({
        where: args
    });

    return levelsCount;
}

export async function deleteLevel(levelId: number) { 
    const level = await db.level.delete({
        where: {
            id: levelId
        }
    });

    return level;
}