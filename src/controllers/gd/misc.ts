import { FastifyRequest, FastifyReply } from "fastify";

import { requestUserAccessInput } from "../../schemas/user";

import { getUserById, updateUserAccess } from "../../services/user";

import { checkSecret } from "../../utils/checks";
import { checkUserGjp2 } from "../../utils/crypt";
import { modLevelToInt } from "../../utils/prismaEnums";

import { Secret } from "../../helpers/enums";

import { commentColors } from "../../config.json";

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