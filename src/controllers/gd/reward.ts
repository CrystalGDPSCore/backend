import { FastifyRequest, FastifyReply } from "fastify";

import { GetGJChallengesInput, GetGJRewardsInput } from "../../schemas/gd/reward";

import { getUserById, getUserChestRemaining, updateUserChestCount } from "../../services/user";
import { getRandomQuests } from "../../services/quest";

import { getChestStuff } from "../../utils/chests";
import { questTypeToInt } from "../../utils/prismaEnums";
import { xor, safeBase64Encode, base64Decode, hashGdObj, checkUserGjp2 } from "../../utils/crypt";

import { Salt, ChestType } from "../../helpers/enums";

export async function getGJChallengesController(request: FastifyRequest<{ Body: GetGJChallengesInput }>, reply: FastifyReply) {
    const { accountID, gjp2, udid, chk } = request.body;

    const startTime = new Date("2024-03-01T00:00:00.000Z").getTime();

    const user = await getUserById(accountID);

    if (!user) {
        return reply.send(-1);
    }

    if (!checkUserGjp2(gjp2, user.passHash)) {
        return reply.send(-1);
    }

    const randomQuests = await getRandomQuests();

    for (const quest of randomQuests) {
        if (!quest) {
            return reply.send(-1);
        }
    }

    const quests: string[] = [];

    randomQuests.forEach((quest, index) => {
        quests.push(
            [
                Date.now() - startTime + index,
                questTypeToInt(quest.type),
                quest.amount,
                quest.reward,
                quest.name
            ].join(",")
        );
    });

    const result = safeBase64Encode(
        xor(
            [
                "Crystal",
                user.id,
                xor(base64Decode(chk.slice(5)), 19847),
                udid,
                user.id,
                Math.round((new Date().setHours(0, 0, 0, 0) + 24 * 60 * 60000 - Date.now()) / 1000),
                ...quests
            ].join(":"),
            19847
        )
    );

    const resultHash = hashGdObj(result, Salt.Challenge);

    return reply.send(`CRsTl${result}|${resultHash}`);
}

export async function getGJRewardsController(request: FastifyRequest<{ Body: GetGJRewardsInput }>, reply: FastifyReply) {
    const { accountID, gjp2, udid, chk, rewardType } = request.body;

    const user = await getUserById(accountID);

    if (!user || !user.stats) {
        return reply.send(-1);
    }

    if (!checkUserGjp2(gjp2, user.passHash)) {
        return reply.send(-1);
    }

    let totalSmallChests = user.stats.totalSmallChests;
    let totalBigChests = user.stats.totalBigChests;

    switch (rewardType) {
        case ChestType.Small:
            if (await getUserChestRemaining(user.id, "Small") != 0) {
                return reply.send(-1);
            }

            totalSmallChests++;

            await updateUserChestCount(user.id, "Small");
            break;
        case ChestType.Big:
            if (await getUserChestRemaining(user.id, "Big") != 0) {
                return reply.send(-1);
            }

            totalBigChests++;

            await updateUserChestCount(user.id, "Big");
            break;
    }

    const result = safeBase64Encode(
        xor(
            [
                "Crystal",
                user.id,
                xor(base64Decode(chk.slice(5)), 59182),
                udid,
                user.id,
                await getUserChestRemaining(user.id, "Small"),
                getChestStuff("Small"),
                totalSmallChests,
                await getUserChestRemaining(user.id, "Big"),
                getChestStuff("Big"),
                totalBigChests,
                rewardType
            ].join(":"),
            59182
        )
    );

    const resultHash = hashGdObj(result, Salt.Reward);

    return reply.send(`CRsTl${result}|${resultHash}`);
}