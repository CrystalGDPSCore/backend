import { FastifyRequest, FastifyReply } from "fastify";

import { redis } from "../../utils/db";

import { registerGJAccountInput, loginGJAccountInput, updateGJAccSettingsInput } from "../../schemas/account";

import { getUserByUserName, getUserByEmail, registerUser, updateUserSettings, getUserById } from "../../services/user";

import sendMail from "../../utils/sendMail";
import { checkSecret } from "../../utils/checks";
import { checkUserGjp2, decodeGjp2, generateUuid } from "../../utils/crypt";
import { messageStateToEnum, friendStateToEnum, commentHistoryStateToEnum } from "../../utils/prismaEnums";

import { Secret, QueryMode } from "../../helpers/enums";

import { server, timeLimits } from "../../config.json";

export async function registerGJAccountHandler(request: FastifyRequest<{ Body: registerGJAccountInput }>, reply: FastifyReply) {
    const { userName, password, email, secret } = request.body;

    if (!checkSecret(secret, Secret.User)) {
        return reply.send(-1);
    }

    if (userName.length < 3 || userName.length > 15) {
        return reply.send(-4);
    }

    if (password.length < 6 || password.length > 20) {
        return reply.send(-5);
    }

    if (email.length < 5 || email.length > 32) {
        return reply.send(-6);
    }

    if (!Number.isNaN(Number(userName))) {
        return reply.send(-1);
    }

    if (await getUserByUserName(userName, QueryMode.Insensitive)) {
        return reply.send(-2);
    }

    if (server.onlyRealEmails) {
        if (await getUserByEmail(email, QueryMode.Insensitive)) {
            return reply.send(-3);
        }

        const uuid = generateUuid();

        await sendMail(
            `${server.name} | Account activation`,
            email,
            `Account activation link: ${server.domain}/account/activate?code=${uuid}`
        );

        await redis.hmset(`${uuid}:activation`, { userName, password, email });
        await redis.expire(`${uuid}:activation`, timeLimits.accountActivation);
    } else {
        await registerUser({
            userName: userName,
            passHash: decodeGjp2(password),
            email: email
        });
    }

    return reply.send(1);
}

export async function loginGJAccountHandler(request: FastifyRequest<{ Body: loginGJAccountInput }>, reply: FastifyReply) {
    const { userName, gjp2, secret } = request.body;
    const loginAttempts = await redis.get(`${request.ip}:login`);

    if (!checkSecret(secret, Secret.User)) {
        return reply.send(-1);
    }

    if (loginAttempts && Number(loginAttempts) == 5) {
        return reply.send(-12);
    }

    const user = await getUserByUserName(userName, QueryMode.Default);

    if (!user) {
        return reply.send(-11);
    }

    if (!checkUserGjp2(gjp2, user.passHash)) {
        if (!loginAttempts) {
            await redis.set(`${request.ip}:login`, 1, "EX", timeLimits.loginAttempts);
        } else {
            await redis.incr(`${request.ip}:login`);
        }

        return reply.send(-11);
    }

    if (user.isDisabled) {
        return reply.send(-12);
    }

    await redis.del(`${request.ip}:login`);

    return reply.send(`${user.id},${user.id}`);
}

export async function updateGJAccSettingsHandler(request: FastifyRequest<{ Body: updateGJAccSettingsInput }>, reply: FastifyReply) {
    const { accountID, gjp2, mS, frS, cS, yt, twitter, twitch, secret } = request.body;

    if (!checkSecret(secret, Secret.User)) {
        return reply.send(-1);
    }

    const user = await getUserById(Number(accountID));

    if (!user) {
        return reply.send(-1);
    }

    if (!checkUserGjp2(gjp2, user.passHash)) {
        return reply.send(-1);
    }

    await updateUserSettings(
        Number(accountID),
        messageStateToEnum(Number(mS)),
        friendStateToEnum(Number(frS)),
        commentHistoryStateToEnum(Number(cS)),
        yt,
        twitter,
        twitch
    )

    return reply.send(1);
}

export async function getAccountUrlHandler(request: FastifyRequest, reply: FastifyReply) {
    return reply.send(server.domain);
}