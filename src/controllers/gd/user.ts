import { FastifyRequest, FastifyReply } from "fastify";

import { getGJUserInfoInput } from "../../schemas/user";

import { getUserById } from "../../services/user";
import { getNewMessagesCountByRecipientId } from "../../services/messages";
import { getFriendRequestsCountByRecipientId, friendRequestExists } from "../../services/friendRequests";
import { getNewFriendsByUserId, friendExists } from "../../services/friendList";

import { checkSecret } from "../../utils/checks";
import { checkUserGjp2 } from "../../utils/crypt";
import { gdObjToString } from "../../utils/gdform";
import { modLevelToInt } from "../../utils/prismaEnums";

import { Secret } from "../../helpers/enums";

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
            38: await getNewMessagesCountByRecipientId(Number(targetAccountID)),
            39: await getFriendRequestsCountByRecipientId(Number(targetAccountID)),
            40: await getNewFriendsByUserId(Number(targetAccountID))
        });
    } else {
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

    return reply.send(gdObjToString(userInfoObj));
}