import { FastifyRequest, FastifyReply } from "fastify";

import { redis } from "../../../utils/db";

import { activateAccountInput } from "../../../schemas/account";

import { registerUser } from "../../../services/user";

import { decodeGjp2 } from "../../../utils/crypt";

export async function activateAccountHandler(request: FastifyRequest<{ Querystring: activateAccountInput }>, reply: FastifyReply) {
    const { code } = request.query;

    if (!code) {
        return reply.send("Account activation code not found!");
    }

    if (!await redis.exists(`${code}:activation`)) {
        return reply.send("That code doesn't exist!");
    }

    const userData = await redis.hgetall(`${code}:activation`);

    await registerUser({
        userName: userData["userName"],
        passHash: decodeGjp2(userData["password"]),
        email: userData["email"]
    });

    await redis.del(`${code}:activation`);

    return reply.send("Account successfully activated!");
}   