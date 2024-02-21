import { FastifyRequest, FastifyReply } from "fastify";

import { getGJUserInfoInput, requestUserAccessInput } from "../../schemas/user";

import { getUserById, updateUserAccess } from "../../services/user";

import { checkSecret } from "../../utils/checks";
import { checkUserGjp2 } from "../../utils/crypt";
import { gdObjToString } from "../../utils/gdform";
import { modLevelToInt } from "../../utils/prismaEnums";

import { Secret } from "../../helpers/enums";

import { commentColors } from "../../config.json";

export async function getGJUserInfoHandler(request: FastifyRequest<{ Body: getGJUserInfoInput }>, reply: FastifyReply) {
    const { targetAccountID, accountID, gjp2, secret } = request.body;

    if (!checkSecret(secret, Secret.Common)) {
        return reply.send(-1);
    }

    const userTarget = await getUserById(Number(targetAccountID));

    if (!userTarget) {
        return reply.send(-1);
    }

    const userOwn = await getUserById(Number(accountID));

    if (!userOwn) {
        return reply.send(-1);
    }

    let userInfoObj = {
        1: userTarget.userName,
        2: targetAccountID,
        16: targetAccountID,
        29: 1,
        3: userTarget.stats?.stars,
        52: userTarget.stats?.moons,
        46: userTarget.stats?.diamonds,
        13: userTarget.stats?.secretCoins,
        17: userTarget.stats?.userCoins,
        4: userTarget.stats?.demons,
        8: userTarget.stats?.creatorPoints,
        10: userTarget.stats?.firstColor,
        11: userTarget.stats?.secondColor,
        51: userTarget.stats?.thirdColor,
        18: userTarget.messageState,
        19: userTarget.friendState,
        50: userTarget.commentHistoryState,
        20: userTarget.youtube,
        44: userTarget.twitter,
        45: userTarget.twitch,
        21: userTarget.stats?.iconCube,
        22: userTarget.stats?.iconShip,
        23: userTarget.stats?.iconBall,
        24: userTarget.stats?.iconUfo,
        25: userTarget.stats?.iconWave,
        26: userTarget.stats?.iconRobot,
        43: userTarget.stats?.iconSpider,
        53: userTarget.stats?.iconSwing,
        54: userTarget.stats?.iconJetpack,
        28: userTarget.stats?.iconGlow,
        48: userTarget.stats?.iconExplosion,
        49: userTarget.modRequested ? modLevelToInt(userTarget.modLevel)[0] : 0
    };

    if (checkUserGjp2(gjp2, userOwn.passHash) && accountID == targetAccountID) {
        userInfoObj = Object.assign(userInfoObj, {
            38: 0, // new messages
            39: 0, // new friend requests
            40: 0 // new friends
        });
    } else {
        userInfoObj = Object.assign(userInfoObj, {
            31: 1 // friend state
        });
    }

    return reply.send(gdObjToString(userInfoObj));
}

export async function requestUserAccessHandler(request: FastifyRequest<{ Body: requestUserAccessInput }>, reply: FastifyReply) {
    const { accountID, gjp2, secret } = request.body;

    if (!checkSecret(secret, Secret.Common)) {
        return reply.send(-1)
    }

    const user = await getUserById(Number(accountID));

    if (!user) {
        return reply.send(-1);
    }

    if (!checkUserGjp2(gjp2, user.passHash)) {
        return reply.send(-1);
    }

    if (modLevelToInt(user.modLevel)[0] == 0) {
        await updateUserAccess(Number(accountID), false, commentColors[user.modLevel]);

        return reply.send(-1);
    }

    await updateUserAccess(Number(accountID), true, commentColors[user.modLevel]);

    return reply.send(modLevelToInt(user.modLevel)[1]);
}