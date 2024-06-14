import { redis } from "../../utils/db";

import { FastifyRequest, FastifyReply } from "fastify";

import { UploadGJLevelListInput } from "../../schemas/gd/levelList";

import { getUserById } from "../../services/user";
import { createList, listExists, updateList } from "../../services/levelList";

import { checkUserGjp2, safeBase64Decode } from "../../utils/crypt";

import { timeLimits } from "../../config.json";

export async function uploadGJLevelListController(request: FastifyRequest<{ Body: UploadGJLevelListInput }>, reply: FastifyReply) {
    const {
        accountID,
        gjp2,
        listID,
        listName,
        listDesc,
        listLevels,
        difficulty,
        original,
        unlisted
    } = request.body;

    const isLevelListUploaded = Boolean(await redis.exists(`${accountID}:uploadLevelList`));

    if (isLevelListUploaded) {
        return reply.send(-1);
    }

    const user = await getUserById(accountID);

    if (!user || user.isDisabled) {
        return reply.send(-9);
    }

    if (!checkUserGjp2(gjp2, user.hashPassword)) {
        return reply.send(-1);
    }

    if (!listName.length) {
        return reply.send(-5);
    }

    const description = safeBase64Decode(listDesc);

    if (description.length > 300) {
        return reply.send(-1);
    }

    if (isNaN(listLevels[0])) {
        return reply.send(-6);
    }

    const listInfoObj = {
        description,
        visibility: unlisted,
        difficulty,
        levelIds: listLevels
    };

    let listId = 0;

    if (listID) {
        if (!listExists(listID)) {
            return reply.send(-1);
        }

        const levelList = await updateList(listID, listInfoObj);

        listId = levelList.id;
    } else {
        const levelList = await createList({
           authorId: accountID,
           name: listName,
           originalListId: original,
           ...listInfoObj 
        });

        listId = levelList.id;
    }

    await redis.set(`${accountID}:uploadLevelList`, 1, "EX", timeLimits.uploadLevelList);

    return reply.send(listId);
}