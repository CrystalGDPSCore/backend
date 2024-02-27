import { FastifyRequest, FastifyReply } from "fastify";

import { getGJUserInfoInput, getGJUsersInput } from "../../schemas/user";

import { getUserById, getUserByUserName, getShownIcon } from "../../services/user";
import { getNewMessagesCountByRecipientId } from "../../services/messages";
import { getFriendRequestsCountByRecipientId, friendRequestExists } from "../../services/friendRequests";
import { getNewFriendsCountByUserId, friendExists } from "../../services/friendList";

import { checkSecret } from "../../utils/checks";
import { checkUserGjp2 } from "../../utils/crypt";
import { gdObjToString } from "../../utils/gdform";
import { modLevelToInt } from "../../utils/prismaEnums";

import { QueryMode, Secret } from "../../helpers/enums";

export async function getGJUserInfoHandler(request: FastifyRequest<{ Body: getGJUserInfoInput }>, reply: FastifyReply) {
    const { targetAccountID, accountID, gjp2, secret } = request.body;

    if (!checkSecret(secret, Secret.Common)) {
        return reply.send(-1);
    }

    const userTarget = await getUserById(Number(targetAccountID));

    if (!userTarget || !userTarget.stats) {
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
        18: userTarget.messageState,
        19: userTarget.friendState,
        50: userTarget.commentHistoryState,
        20: userTarget.youtube,
        44: userTarget.twitter,
        45: userTarget.twitch,
        21: userTarget.stats.iconCube,
        22: userTarget.stats.iconShip,
        23: userTarget.stats.iconBall,
        24: userTarget.stats.iconUfo,
        25: userTarget.stats.iconWave,
        26: userTarget.stats.iconRobot,
        43: userTarget.stats.iconSpider,
        53: userTarget.stats.iconSwing,
        54: userTarget.stats.iconJetpack,
        28: Number(userTarget.stats.hasGlow),
        48: userTarget.stats.iconExplosion,
        49: userTarget.modRequested ? modLevelToInt(userTarget.modLevel)[0] : 0
    };

    if (accountID && gjp2) {
        const userOwn = await getUserById(Number(accountID));

        if (!userOwn) {
            return reply.send(-1);
        }

        let isAccountOwner = false;

        if (checkUserGjp2(gjp2, userOwn.passHash)) {
            isAccountOwner = true;
        }

        if (isAccountOwner && accountID == targetAccountID) {
            userInfoObj = Object.assign(userInfoObj, {
                38: await getNewMessagesCountByRecipientId(Number(targetAccountID)),
                39: await getFriendRequestsCountByRecipientId(Number(targetAccountID)),
                40: await getNewFriendsCountByUserId(Number(targetAccountID))
            });
        }

        if (isAccountOwner && accountID != targetAccountID) {
            let friendStateObj = {};

            switch (true) {
                case await friendExists(userOwn.id, userTarget.id):
                    friendStateObj = { 31: 1 };
                    break;
                case await friendRequestExists(userOwn.id, userTarget.id):
                    friendStateObj = { 31: 4 };
                    break;
                case await friendRequestExists(userTarget.id, userOwn.id):
                    friendStateObj = { 31: 3 };
                    break;
                default:
                    friendStateObj = { 31: 0 };
            }

            userInfoObj = Object.assign(userInfoObj, friendStateObj);
        }
    }

    return reply.send(gdObjToString(userInfoObj));
}

export async function getGJUsersHandler(request: FastifyRequest<{ Body: getGJUsersInput }>, reply: FastifyReply) {
    const { accountID, gjp2, str, secret } = request.body;

    if (!checkSecret(secret, Secret.Common)) {
        return reply.send(-1);
    }

    if (accountID && gjp2) {
        const user = await getUserById(Number(accountID));

        if (!user) {
            return reply.send(-1);
        }

        if (!checkUserGjp2(gjp2, user.passHash)) {
            return reply.send(-1);
        }
    }

    if (!str) {
        return reply.send(-1);
    }

    const user = await getUserByUserName(str, QueryMode.Insensitive);

    if (!user || !user.stats) {
        return reply.send(-1);
    }

    const userInfoObj = {
        1: user.userName,
        2: user.id,
        16: user.id,
        3: user.stats.stars,
        52: user.stats.moons,
        46: user.stats.diamonds,
        13: user.stats.secretCoins,
        17: user.stats.userCoins,
        4: user.stats.demons,
        8: user.stats.creatorPoints,
        10: user.stats.primaryColor,
        11: user.stats.secondaryColor,
        15: user.stats.hasGlow ? 2 : 0,
        9: user.stats[`icon${getShownIcon(user.stats.iconType)}`],
        14: user.stats.iconType
    };

    return reply.send(`${gdObjToString(userInfoObj)}#1:0:10`);
}