import { FastifyRequest, FastifyReply } from "fastify";

import { GetGJUserListInput, RemoveGJFriendInput } from "../../schemas/gd/relationship";

import { getUserById, getUsers } from "../../services/user";
import { getFriendList, updateFriendList, deleteFriend } from "../../services/friendList";
import { getBlockList } from "../../services/blockList";

import { checkUserGjp2 } from "../../utils/crypt";
import { gdObjToString } from "../../utils/gdForm";

import { IconType } from "../../helpers/enums";

export async function getGJUserListController(request: FastifyRequest<{ Body: GetGJUserListInput }>, reply: FastifyReply) {
    const { accountID, gjp2, type } = request.body;

    const userOwn = await getUserById(accountID);

    if (!userOwn || userOwn.isDisabled) {
        return reply.send(-1);
    }

    if (!checkUserGjp2(gjp2, userOwn.hashPassword)) {
        return reply.send(-1);
    }

    let users: Array<{ id: number, isNew: boolean }> = [];

    switch (type) {
        case "friendList":
            const friendList = await getFriendList(accountID);

            if (!friendList.length) {
                return reply.send(-2);
            }

            await updateFriendList(accountID);

            users = friendList;
            break;
        case "blockList":
            const blockList = (await getBlockList(accountID)).map(blockedId => {
                const blockedInfoObj = {
                    id: blockedId,
                    isNew: false
                };

                return blockedInfoObj;
            });

            if (!blockList.length) {
                return reply.send(-2);
            }

            users = blockList;
            break;
    }

    const usersInfo = await getUsers(users.reverse().map(user => user.id));

    const userList = users.map(user => {
        const userTarget = usersInfo.find(userInfo => userInfo.id == user.id)!;

        const shownIcon = Object.values(IconType)[userTarget.stats!.iconType];

        const userInfoObj = {
            1: userTarget.userName,
            2: userTarget.id,
            16: userTarget.id,
            9: userTarget.stats![`icon${shownIcon}`],
            14: userTarget.stats!.iconType,
            10: userTarget.stats!.primaryColor,
            11: userTarget.stats!.secondaryColor,
            15: userTarget.stats!.hasGlow ? 2 : 0,
            41: user.isNew ? 1 : 0
        };

        return gdObjToString(userInfoObj);
    }).join("|");

    return reply.send(userList);
}

export async function removeGJFriendController(request: FastifyRequest<{ Body: RemoveGJFriendInput }>, reply: FastifyReply) {
    const { accountID, gjp2, targetAccountID } = request.body;

    if (accountID == targetAccountID) {
        return reply.send(-1);
    }

    const userOwn = await getUserById(accountID);

    if (!userOwn || userOwn.isDisabled) {
        return reply.send(-1);
    }

    if (!checkUserGjp2(gjp2, userOwn.hashPassword)) {
        return reply.send(-1);
    }

    const userTarget = await getUserById(targetAccountID);

    if (!userTarget || userTarget.isDisabled) {
        return reply.send(-1);
    }

    await deleteFriend(accountID, targetAccountID);

    return reply.send(1);
}