import { Prisma } from "@prisma/client";

import { db } from "../utils/db";

import { CreateLevelListInput, UpdateLevelListInput } from "../schemas/service/levelList";

export async function listExists(listId: number) {
    const levelList = await db.levelList.findUnique({
        where: {
            id: listId
        }
    });

    if (!levelList) {
        return false;
    }

    return true;
}

export async function createList(input: CreateLevelListInput) {
    const levelList = await db.levelList.create({
        data: {
            ...input,
            version: 1
        }
    });

    return levelList;
}

export async function updateList(listId: number, input: UpdateLevelListInput) {
    const levelList = await db.levelList.update({
        where: {
            id: listId
        },
        data: {
            ...input,
            version: {
                increment: 1
            },
            updateDate: new Date()
        }
    });

    return levelList;
}

export async function getLists(args: Prisma.LevelListWhereInput, orderBy: Array<Prisma.LevelListOrderByWithRelationInput>, offset: number) {
    const levelLists = await db.levelList.findMany({
        where: args,
        take: 10,
        skip: offset,
        orderBy
    });

    return levelLists;
}

export async function getListsCount(args: Prisma.LevelListWhereInput) {
    const levelListsCount = await db.levelList.count({
        where: args
    });

    return levelListsCount;
}

export async function getListById(listId: number) {
    const levelList = await db.levelList.findUnique({
        where: {
            id: listId
        }
    });

    return levelList;
}

export async function deleteList(listId: number) {
    const levelList = await db.levelList.delete({
        where: {
            id: listId
        }
    });

    await db.comment.deleteMany({
        where: {
            itemId: listId,
            isList: true
        }
    });

    await db.download.deleteMany({
        where: {
            itemId: listId,
            isList: true
        }
    });

    await db.like.deleteMany({
        where: {
            itemId: listId,
            itemType: "LevelList"
        }
    });
    
    return levelList;
}