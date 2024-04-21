import { FastifyRequest, FastifyReply } from "fastify";

import { GetGJChallengesInput, GetGJRewardsInput } from "../../schemas/gd/reward";

import { getUserById } from "../../services/user";
import { getUserChestRemaining, updateUserChestCount } from "../../services/userStats";
import { getRandomQuests } from "../../services/quest";

import { getChestStuff } from "../../utils/chests";
import { questTypeToInt } from "../../utils/prismaEnums";
import { xor, safeBase64Encode, base64Decode, hashGdObj, checkUserGjp2 } from "../../utils/crypt";

import { Salt } from "../../helpers/enums";

export async function getGJChallengesController(request: FastifyRequest<{ Body: GetGJChallengesInput }>, reply: FastifyReply) {
    const { accountID, gjp2, udid, chk } = request.body;

    const user = await getUserById(accountID);

    if (!user || user.isDisabled) {
        return reply.send(-1);
    }

    if (!checkUserGjp2(gjp2, user.hashPassword)) {
        return reply.send(-1);
    }

    const randomQuests = await getRandomQuests();

    if (randomQuests.some(quest => !quest)) {
        return reply.send(-1);
    }

    const quests = randomQuests.map(quest => {
        const questInfo = [
            Date.now() + quest.id,
            questTypeToInt(quest.type),
            quest.amount,
            quest.reward,
            quest.name
        ].join(",");

        return questInfo;
    });

    const result = safeBase64Encode(
        xor(
            [
                "Crystal",
                accountID,
                xor(base64Decode(chk.slice(5)), 19847),
                udid,
                accountID,
                Math.round((new Date().setHours(0, 0, 0, 0) + 24 * 60 * 60000 - Date.now()) / 1000),
                ...quests
            ].join(":"),
            19847
        )
    );

    const resultHash = hashGdObj(result, Salt.Challenge);

    return reply.send(`crstl${result}|${resultHash}`);
}

export async function getGJRewardsController(request: FastifyRequest<{ Body: GetGJRewardsInput }>, reply: FastifyReply) {
    const { accountID, gjp2, udid, chk, rewardType } = request.body;

    const user = await getUserById(accountID);

    if (!user || !user.stats || user.isDisabled) {
        return reply.send(-1);
    }

    if (!checkUserGjp2(gjp2, user.hashPassword)) {
        return reply.send(-1);
    }

    let totalSmallChests = user.stats.totalSmallChests;
    let totalBigChests = user.stats.totalBigChests;

    let gdRewardType = 0;

    switch (rewardType) {
        case "Small":
            if (await getUserChestRemaining(accountID, "Small")) {
                return reply.send(-1);
            }

            totalSmallChests++;
            gdRewardType = 1;

            await updateUserChestCount(accountID, "Small");
            break;
        case "Big":
            if (await getUserChestRemaining(accountID, "Big")) {
                return reply.send(-1);
            }

            totalBigChests++;
            gdRewardType = 2;

            await updateUserChestCount(accountID, "Big");
            break;
    }

    const result = safeBase64Encode(
        xor(
            [
                "Crystal",
                accountID,
                xor(base64Decode(chk.slice(5)), 59182),
                udid,
                accountID,
                await getUserChestRemaining(accountID, "Small"),
                getChestStuff("Small"),
                totalSmallChests,
                await getUserChestRemaining(accountID, "Big"),
                getChestStuff("Big"),
                totalBigChests,
                gdRewardType
            ].join(":"),
            59182
        )
    );

    const resultHash = hashGdObj(result, Salt.Reward);

    return reply.send(`crstl${result}|${resultHash}`);
}