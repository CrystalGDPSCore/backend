import { FastifyRequest, FastifyReply } from "fastify";

import { UpdateGJUserScoreInput } from "../../schemas/gd/score";

import { getUserById, updateUserScore } from "../../services/user";

import { checkUserGjp2 } from "../../utils/crypt";

export async function updateGJUserScoreController(request: FastifyRequest<{ Body: UpdateGJUserScoreInput }>, reply: FastifyReply) {
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
        accJetpack
    } = request.body;

    const user = await getUserById(accountID);

    if (!user || user.isDisabled) {
        return reply.send(-1);
    }

    if (!checkUserGjp2(gjp2, user.passHash)) {
        return reply.send(-1);
    }

    await updateUserScore(accountID, {
        stars: stars,
        moons: moons,
        secretCoins: coins,
        userCoins: userCoins,
        demons: demons,
        diamonds: diamonds,
        iconType: iconType,
        iconCube: accIcon,
        iconShip: accShip,
        iconBall: accBall,
        iconUfo: accBird,
        iconWave: accDart,
        iconRobot: accRobot,
        iconSpider: accSpider,
        iconSwing: accSwing,
        iconJetpack: accJetpack,
        iconExplosion: accExplosion,
        primaryColor: color1,
        secondaryColor: color2,
        glowColor: color3,
        hasGlow: Boolean(accGlow)
    });

    return reply.send(accountID);
}