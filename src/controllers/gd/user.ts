import { FastifyRequest, FastifyReply } from "fastify";

import { GetGJUserInfoInput, GetGJUsersInput, RequestUserAccessInput } from "../../schemas/gd/user";

import { getUserById, getUserByName, updateUserAccess } from "../../services/user";
import { getNewMessagesCount } from "../../services/message";
import { getNewFriendRequestsCount, friendRequestExists, getFriendRequest } from "../../services/friendRequest";
import { getNewFriendsCount, friendExists } from "../../services/friendList";
import { blockedExists } from "../../services/blockList";

import { checkUserGjp2, safeBase64Encode } from "../../utils/crypt";
import { gdObjToString } from "../../utils/gdForm";
import { modLevelToInt, messageStateToInt, friendRequestStateToInt, commentHistoryStateToInt } from "../../utils/prismaEnums";
import { getRelativeTime } from "../../utils/relativeTime";

import { IconType } from "../../helpers/enums";

import { commentColors } from "../../config.json";

export async function getGJUserInfoController(request: FastifyRequest<{ Body: GetGJUserInfoInput }>, reply: FastifyReply) {
    const { targetAccountID, accountID, gjp2 } = request.body;

    const userOwn = await getUserById(accountID);

    if (!userOwn || userOwn.isDisabled) {
        return reply.send(-1);
    }

    if (!checkUserGjp2(gjp2, userOwn.hashedPassword)) {
        return reply.send(-1);
    }

    const userTarget = await getUserById(targetAccountID);

    if (!userTarget || !userTarget.stats || userTarget.isDisabled) {
        return reply.send(-1);
    }

    if (await blockedExists(accountID, targetAccountID) || await blockedExists(targetAccountID, accountID)) {
        return reply.send(-1);
    }

    let userInfoObj = {
        1: userTarget.userName,
        2: targetAccountID,
        16: targetAccountID,
        29: 1,
        3: userTarget.stats.stars,
        52: userTarget.stats.moons,
        46: userTarget.stats.diamonds,
        13: userTarget.stats.secretCoins,
        17: userTarget.stats.userCoins,
        4: userTarget.stats.demons,
        8: userTarget.stats.creatorPoints,
        10: userTarget.stats.primaryColor,
        11: userTarget.stats.secondaryColor,
        51: userTarget.stats.glowColor,
        18: messageStateToInt(userTarget.messageState),
        19: friendRequestStateToInt(userTarget.friendRequestState),
        50: commentHistoryStateToInt(userTarget.commentHistoryState),
        20: userTarget.youtube ?? "",
        44: userTarget.twitter ?? "",
        45: userTarget.twitch ?? "",
        21: userTarget.stats.iconCube,
        22: userTarget.stats.iconShip,
        23: userTarget.stats.iconBall,
        24: userTarget.stats.iconUfo,
        25: userTarget.stats.iconWave,
        26: userTarget.stats.iconRobot,
        43: userTarget.stats.iconSpider,
        53: userTarget.stats.iconSwing,
        54: userTarget.stats.iconJetpack,
        28: userTarget.stats.hasGlow ? 1 : 0,
        48: userTarget.stats.iconExplosion,
        49: userTarget.modRequested ? modLevelToInt(userTarget.modLevel)[0] : 0
    };

    if (accountID == targetAccountID) {
        userInfoObj = Object.assign(userInfoObj, {
            38: await getNewMessagesCount(targetAccountID),
            39: await getNewFriendRequestsCount(targetAccountID),
            40: await getNewFriendsCount(targetAccountID)
        });
    }

    if (accountID != targetAccountID) {
        let friendStateObj = {};

        switch (true) {
            case await friendExists(accountID, targetAccountID):
                friendStateObj = { 31: 1 };
                break;
            case await friendRequestExists(accountID, targetAccountID):
                friendStateObj = { 31: 4 };
                break;
            case await friendRequestExists(targetAccountID, accountID):
                const friendRequest = (await getFriendRequest(targetAccountID, accountID))!;

                friendStateObj = {
                    31: 3,
                    32: friendRequest.id,
                    35: safeBase64Encode(friendRequest.comment ?? ""),
                    37: getRelativeTime(friendRequest.sentDate)
                };
                break;
            default:
                friendStateObj = { 31: 0 };
                break;
        }

        userInfoObj = Object.assign(userInfoObj, friendStateObj);
    }

    return reply.send(gdObjToString(userInfoObj));
}

export async function getGJUsersController(request: FastifyRequest<{ Body: GetGJUsersInput }>, reply: FastifyReply) {
    const { accountID, gjp2, str } = request.body;
        
    const userOwn = await getUserById(accountID);

    if (!userOwn || userOwn.isDisabled) {
        return reply.send(-1);
    }

    if (!checkUserGjp2(gjp2, userOwn.hashedPassword)) {
        return reply.send(-1);
    }

    if (!str) {
        return reply.send(-1);
    }

    const userTarget = await getUserByName(str, "insensitive");

    if (!userTarget || !userTarget.stats || userTarget.isDisabled) {
        return reply.send(-1);
    }

    const shownIcon = Object.values(IconType)[userTarget.stats.iconType];

    const userInfoObj = {
        1: userTarget.userName,
        2: userTarget.id,
        16: userTarget.id,
        3: userTarget.stats.stars,
        52: userTarget.stats.moons,
        46: userTarget.stats.diamonds,
        13: userTarget.stats.secretCoins,
        17: userTarget.stats.userCoins,
        4: userTarget.stats.demons,
        8: userTarget.stats.creatorPoints,
        10: userTarget.stats.primaryColor,
        11: userTarget.stats.secondaryColor,
        15: userTarget.stats.hasGlow ? 2 : 0,
        9: userTarget.stats[`icon${shownIcon}`],
        14: userTarget.stats.iconType
    };

    return reply.send(`${gdObjToString(userInfoObj)}#1:0:10`);
}

export async function requestUserAccessController(request: FastifyRequest<{ Body: RequestUserAccessInput }>, reply: FastifyReply) {
    const { accountID, gjp2 } = request.body;

    const user = await getUserById(accountID);

    if (!user || user.isDisabled) {
        return reply.send(-1);
    }

    if (!checkUserGjp2(gjp2, user.hashedPassword)) {
        return reply.send(-1);
    }

    if (!modLevelToInt(user.modLevel)[0]) {
        await updateUserAccess(accountID, {
            modRequested: false,
            commentColor: commentColors[user.modLevel]
        });

        return reply.send(-1);
    }

    await updateUserAccess(accountID, {
        modRequested: true,
        commentColor: commentColors[user.modLevel]
    });

    return reply.send(modLevelToInt(user.modLevel)[1]);
}