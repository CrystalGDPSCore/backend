import { FastifyRequest, FastifyReply } from "fastify";

import { BlockGJUserInput, UnblockGJUserInput } from "../../schemas/gd/block";

import { getUserById } from "../../services/user";
import { blockUser, unblockUser } from "../../services/blockList";

import { checkUserGjp2 } from "../../utils/crypt";

export async function blockGJUserController(request: FastifyRequest<{ Body: BlockGJUserInput }>, reply: FastifyReply) {
    const { accountID, gjp2, targetAccountID } = request.body;

    if (accountID == targetAccountID) {
        return reply.send(-1);
    }

    const userOwn = await getUserById(accountID);

    if (!userOwn || userOwn.isDisabled) {
        return reply.send(-1);
    }

    if (!checkUserGjp2(gjp2, userOwn.hashPassword)) {
        return reply.send(-1);
    }

    const userTarget = await getUserById(targetAccountID);

    if (!userTarget || userTarget.isDisabled) {
        return reply.send(-1);
    }

    await blockUser(accountID, targetAccountID);

    return reply.send(1);
}

export async function unblockGJUserController(request: FastifyRequest<{ Body: UnblockGJUserInput }>, reply: FastifyReply) {
    const { accountID, gjp2, targetAccountID } = request.body;

    if (accountID == targetAccountID) {
        return reply.send(-1);
    }

    const userOwn = await getUserById(accountID);

    if (!userOwn || userOwn.isDisabled) {
        return reply.send(-1);
    }

    if (!checkUserGjp2(gjp2, userOwn.hashPassword)) {
        return reply.send(-1);
    }

    const userTarget = await getUserById(targetAccountID);

    if (!userTarget || userTarget.isDisabled) {
        return reply.send(-1);
    }

    await unblockUser(accountID, targetAccountID);

    return reply.send(1);
}