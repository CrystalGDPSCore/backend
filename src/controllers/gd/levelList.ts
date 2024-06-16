import { Prisma } from "@prisma/client";

import { redis } from "../../utils/db";

import { FastifyRequest, FastifyReply } from "fastify";

import { UploadGJLevelListInput, GetGJLevelListsInput, DeleteGJLevelListInput } from "../../schemas/gd/levelList";

import { getUserById, getUsers } from "../../services/user";
import { createList, deleteList, getListById, getLists, getListsCount, listExists, updateList } from "../../services/levelList";
import { getFriendList } from "../../services/friendList";

import { base64Encode, checkUserGjp2, safeBase64Decode } from "../../utils/crypt";
import { gdObjToString } from "../../utils/gdForm";

import { ReturnListDifficulty } from "../../helpers/enums";

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

export async function getGJLevelListsController(request: FastifyRequest<{ Body: GetGJLevelListsInput }>, reply: FastifyReply) {
    const {
        accountID,
        gjp2,
        type,
        str,
        diff,
        demonFilter,
        star,
        followed,
        page
    } = request.body;

    const userOwn = await getUserById(accountID);

    if (!userOwn || userOwn.isDisabled) {
        return reply.send(-9);
    }

    if (!checkUserGjp2(gjp2, userOwn.hashPassword)) {
        return reply.send(-1);
    }

    const listArgsObj: Prisma.LevelListWhereInput = {
        visibility: "Listed"
    };

    const listOrderByObj: Array<Prisma.LevelListOrderByWithRelationInput> = [{}];

    if (str && typeof str == "number") {
        listArgsObj.id = str;
    } else {
        listOrderByObj[0].likes = "desc";

        if (star) {
            listArgsObj.reward = { gt: 0 };
        }

        if (diff != "NotSelected") {
            if (diff == "Demon") {
                listArgsObj.difficulty = demonFilter == "NotSelected" ? { in: ["EasyDemon", "MediumDemon", "HardDemon", "InsaneDemon", "ExtremeDemon"] } : demonFilter;
            } else {
                listArgsObj.difficulty = diff;
            }
        }
    }

    switch (type) {
        case "Search":
            if (str && typeof str == "string") {
                listArgsObj.name = { startsWith: str, mode: "insensitive" };
            } else {
                listArgsObj.visibility = { in: ["Listed", "Unlisted"] };
            }
            break;
        case "Downloads":
            delete listOrderByObj[0].likes;

            listOrderByObj[0].downloads = "desc";
            break;
        case "Recent":
            delete listOrderByObj[0].likes;

            listOrderByObj[0].createDate = "desc";
            break;
        case "Trending":
            listArgsObj.createDate = { gt: new Date(Date.now() - 7 * 24 * 60 * 60000) };
            break;
        case "UserLists":
            if (!(str && typeof str == "number")) {
                return reply.send(-1);
            }

            delete listArgsObj.id;
                
            listOrderByObj[0].createDate = "desc";
            
            if (accountID == str) {
                listArgsObj.visibility = { in: ["Listed", "FriendsOnly", "Unlisted"] };
            }

            listArgsObj.authorId = str;
            break;
        case "TopLists":
            delete listOrderByObj[0].likes;

            listOrderByObj[0].rateDate = "desc";
            listArgsObj.ratingType = "Featured";
            listArgsObj.reward = { gt: 0 };
            break;
        case "Magic":
            return reply.send(-1); // (mb level count, diff)
        case "Awarded":
            delete listOrderByObj[0].likes;

            listOrderByObj[0].rateDate = "desc";
            listArgsObj.reward = { gt: 0 };
            break;
        case "Followed":
            delete listOrderByObj[0].likes;

            listOrderByObj[0].createDate = "desc";
            listArgsObj.authorId = { in: followed };
            break;
        case "Friends":
            delete listOrderByObj[0].likes;

            const friendIds = (await getFriendList(accountID)).map(friend => friend.id);

            listOrderByObj[0].createDate = "desc";
            listArgsObj.visibility = { in: ["Listed", "FriendsOnly"] };
            listArgsObj.authorId = { in: friendIds };
            break;
        case "Sent":
            return reply.send(-1);
    }

    const lists = await getLists(listArgsObj, listOrderByObj, page * 10);
    const listsCount = await getListsCount(listArgsObj);

    if (!lists.length) {
        return reply.send(-1);
    }

    const users = await getUsers(lists.map(levelList => levelList.authorId));

    const levelLists = lists.map(levelList => {
        const userTarget = users.find(user => user.id == levelList.authorId)!;

        const levelListInfoObj = {
            1: levelList.id,
            2: levelList.name,
            3: base64Encode(levelList.description ?? ""),
            5: levelList.version,
            49: levelList.authorId,
            50: userTarget.userName,
            10: levelList.downloads,
            7: ReturnListDifficulty[levelList.difficulty],
            14: levelList.likes,
            19: levelList.ratingType == "Featured" ? 1 : 0,
            51: levelList.levelIds.join(","),
            55: levelList.reward,
            56: levelList.levelsToReward,
            28: Math.round(levelList.createDate.getTime() / 1000),
            29: Math.round(levelList.updateDate.getTime() / 1000)
        };

        return gdObjToString(levelListInfoObj);
    }).join("|");

    const userList = (await getUsers(lists.map(levelList => levelList.authorId))).map(user => {
        const userInfo = [
            user.id,
            user.userName,
            user.id
        ].join(":");

        return userInfo;
    }).join("|");

    const generalInfo = [
        levelLists,
        userList,
        [listsCount, page * 10, 10].join(":"),
        "crstl"
    ].join("#");

    return reply.send(generalInfo);
}

export async function deleteGJLevelListController(request: FastifyRequest<{ Body: DeleteGJLevelListInput }>, reply: FastifyReply) {
    const { accountID, gjp2, listID } = request.body;

    const user = await getUserById(accountID);

    if (!user || user.isDisabled) {
        return reply.send(-1);
    }

    if (!checkUserGjp2(gjp2, user.hashPassword)) {
        return reply.send(-1);
    }

    const levelList = await getListById(listID);

    if (!levelList || levelList.reward != 0) {
        return reply.send(-1);
    }

    if (accountID != levelList.authorId && ["None", "LeaderboardMod"].includes(user.modLevel)) {
        return reply.send(-1);
    }

    await deleteList(listID);

    return reply.send(1);
}