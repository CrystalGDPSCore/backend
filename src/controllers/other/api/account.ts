import { FastifyRequest, FastifyReply } from "fastify";

import { redis } from "../../../utils/db";

import { apiRegisterAccountInput } from "../../../schemas/account";

import { getUserByUserName, getUserByEmail, registerUser } from "../../../services/user";

import sendMail from "../../../utils/sendMail";
import { decodeGjp2, generateUuid } from "../../../utils/crypt";

import { ErrorCode, QueryMode } from "../../../helpers/enums";

import { server, timeLimits } from "../../../config.json";

export async function apiRegisterAccountHandler(request: FastifyRequest<{ Body: apiRegisterAccountInput }>, reply: FastifyReply) {
    const { name, password, email } = request.body;

    if (await getUserByUserName(name, QueryMode.Insensitive)) {
        return reply.code(500).send({
            code: ErrorCode.UserAlreadyRegistered,
            message: "That userName is already registered"
        });
    }

    if (server.onlyRealEmails) {
        if (await getUserByEmail(email, QueryMode.Insensitive)) {
            return reply.code(500).send({
                code: ErrorCode.UserAlreadyRegistered,
                message: "That email is already registered"
            });
        }

        const uuid = generateUuid();

        await sendMail(
            `${server.name} | Account activation`,
            email,
            `Account activation link: ${server.domain}/account/activate?code=${uuid}`
        );

        await redis.hmset(`${uuid}:activation`, { name, password, email });
        await redis.expire(`${uuid}:activation`, timeLimits.accountActivation);

        return reply.send({ message: "Check your email and activate your account" });
    }

    await registerUser({
        userName: name,
        passHash: decodeGjp2(password),
        email: email
    });

    return reply.send({ message: "Account successfully registered" });
}