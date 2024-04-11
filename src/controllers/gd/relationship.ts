import { FastifyRequest, FastifyReply } from "fastify";

import { GetGJUserListInput, RemoveGJFriendInput } from "../../schemas/gd/relationship";

import { getUserById, getUsers } from "../../services/user";
import { getFriendList, updateFriendList, deleteFriend } from "../../services/friendList";
import { getBlockList } from "../../services/blockList";

import { checkUserGjp2 } from "../../utils/crypt";
import { gdObjToString } from "../../utils/gdForm";

import { UserListType, IconType } from "../../helpers/enums";

export async function getGJUserListController(request: FastifyRequest<{ Body: GetGJUserListInput }>, reply: FastifyReply) {
    const { accountID, gjp2, type } = request.body;

    const userOwn = await getUserById(accountID);

    if (!userOwn || userOwn.isDisabled) {
        return reply.send(-1);
    }

    if (!checkUserGjp2(gjp2, userOwn.hashedPassword)) {
        return reply.send(-1);
    }

    let userList: Array<{ id: number, isNew: boolean }> = [];

    switch (type) {
        case UserListType.FriendList:
            const friendList = await getFriendList(accountID);

            if (!friendList.length) {
                return reply.send(-2);
            }

            await updateFriendList(accountID);

            userList = friendList;
            break;
        case UserListType.BlockedList:
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

            userList = blockList;
            break;
    }

    const users = await getUsers(userList.reverse().map(user => user.id));

    const list = userList.map(listUser => {
        const userTarget = users.find(user => user.id == listUser.id)!;

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
            41: listUser.isNew ? 1 : 0
        };

        return gdObjToString(userInfoObj);
    }).join("|");

    return reply.send(list);
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

    if (!checkUserGjp2(gjp2, userOwn.hashedPassword)) {
        return reply.send(-1);
    }

    const userTarget = await getUserById(targetAccountID);

    if (!userTarget || userTarget.isDisabled) {
        return reply.send(-1);
    }

    await deleteFriend(accountID, targetAccountID);

    return reply.send(1);
}