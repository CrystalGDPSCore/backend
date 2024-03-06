import { FastifyRequest, FastifyReply } from "fastify";

import { updateGJUserScoreInput } from "../../schemas/score";

import { getUserById, updateUserScore } from "../../services/user";

import { checkSecret } from "../../utils/checks";
import { checkUserGjp2 } from "../../utils/crypt";

import { Secret } from "../../helpers/enums";

export async function updateGJUserScoreHandler(request: FastifyRequest<{ Body: updateGJUserScoreInput }>, reply: FastifyReply) {
    const {
        accountID,
        gjp2,
        stars,
        moons,
        demons,
        diamonds,
        color1,
        color2,
        color3,
        iconType,
        coins,
        userCoins,
        accIcon,
        accShip,
        accBall,
        accBird,
        accDart,
        accRobot,
        accGlow,
        accSpider,
        accExplosion,
        accSwing,
        accJetpack,
        secret
    } = request.body;

    if (!checkSecret(secret, Secret.Common)) {
        return reply.send(-1);
    }

    if (!accountID && !gjp2) {
        return reply.send(-1);
    }

    const user = await getUserById(Number(accountID));

    if (!user) {
        return reply.send(-1);
    }

    if (!checkUserGjp2(gjp2, user.passHash)) {
        return reply.send(-1);
    }

    await updateUserScore(Number(accountID), {
        stars: Number(stars),
        moons: Number(moons),
        secretCoins: Number(coins),
        userCoins: Number(userCoins),
        demons: Number(demons),
        diamonds: Number(diamonds),
        iconType: Number(iconType),
        iconCube: Number(accIcon),
        iconShip: Number(accShip),
        iconBall: Number(accBall),
        iconUfo: Number(accBird),
        iconWave: Number(accDart),
        iconRobot: Number(accRobot),
        iconSpider: Number(accSpider),
        iconSwing: Number(accSwing),
        iconJetpack: Number(accJetpack),
        iconExplosion: Number(accExplosion),
        primaryColor: Number(color1),
        secondaryColor: Number(color2),
        glowColor: Number(color3),
        hasGlow: Number(accGlow) == 1 ? true : false
    });

    return reply.send(accountID);
}