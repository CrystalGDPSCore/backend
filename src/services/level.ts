import { Prisma } from "@prisma/client";

import { db } from "../utils/db";

import { CreateLevelInput, UpdateLevelInput, RateLevelInput } from "../schemas/service/level";

import { SelectDemonDifficulty } from "../helpers/enums";

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

export async function updateLevelDescription(levelId: number, description: string) {
    const level = await db.level.update({
        where: {
            id: levelId
        },
        data: {
            description: description
        }
    });

    return level;
}

export async function rateLevel(levelId: number, input: RateLevelInput) {
    const level = await db.level.findUnique({
        where: {
            id: levelId
        }
    });

    await db.suggestLevel.deleteMany({
        where: {
            levelId
        }
    });

    await db.suggestLevelDifficulty.deleteMany({
        where: {
            levelId
        }
    });

    if (level!.coins > 0) {
        input = Object.assign(input, { isCoinsVerified: true });
    }

    if (level!.rateDate == null) {
        input = Object.assign(input, { rateDate: new Date() });
    }

    const updatedLevel = await db.level.update({
        where: {
            id: levelId
        },
        data: input
    });

    return updatedLevel;
}

export async function rateLevelDemon(levelId: number, difficulty: keyof typeof SelectDemonDifficulty) {
    const updatedLevel = await db.level.update({
        where: {
            id: levelId
        },
        data: {
            difficulty
        }
    });

    return updatedLevel;
}