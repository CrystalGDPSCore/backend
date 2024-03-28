import path from "path";
import { writeFileSync, readFileSync } from "fs";

import { FastifyRequest, FastifyReply } from "fastify";

import { redis } from "../../utils/db";

import {
    RegisterGJAccountInput,
    LoginGJAccountInput,
    UpdateGJAccSettingsInput,
    BackupGJAccountNewInput,
    SyncGJAccountNewInput
} from "../../schemas/gd/account";

import { getUserByName, getUserByEmail, createUser, updateUserSettings, getUserById } from "../../services/user";

import sendMail from "../../utils/sendMail";
import { checkUserGjp2, encodeGjp2, generateUuid } from "../../utils/crypt";
import { messageStateToEnum, friendRequestStateToEnum, commentHistoryStateToEnum } from "../../utils/prismaEnums";

import { database, server, timeLimits } from "../../config.json";

export async function registerGJAccountController(request: FastifyRequest<{ Body: RegisterGJAccountInput }>, reply: FastifyReply) {
    const { userName, password, email } = request.body;

    if (userName.length < 3 || userName.length > 15) {
        return reply.send(-4);
    }

    if (password.length < 6 || password.length > 20) {
        return reply.send(-5);
    }

    if (email.length < 5 || email.length > 32) {
        return reply.send(-6);
    }

    if (!Number.isNaN(parseInt(userName))) {
        return reply.send(-1);
    }

    if (await getUserByName(userName, "insensitive")) {
        return reply.send(-2);
    }

    if (server.onlyRealEmails) {
        if (await getUserByEmail(email, "insensitive")) {
            return reply.send(-3);
        }

        const uuid = generateUuid();

        await sendMail({
            title: `${server.name} | Account activation`,
            recipient: email,
            body: `Account activation link: ${server.domain}/account/activate?code=${uuid}`
        });

        await redis.hmset(`${uuid}:activation`, { userName, password, email });
        await redis.expire(`${uuid}:activation`, timeLimits.accountActivation);
    } else {
        await createUser({
            userName: userName,
            passHash: encodeGjp2(password),
            email: email
        });
    }

    return reply.send(1);
}

export async function loginGJAccountController(request: FastifyRequest<{ Body: LoginGJAccountInput }>, reply: FastifyReply) {
    const { userName, gjp2 } = request.body;

    const user = await getUserByName(userName, "default");

    if (!user) {
        return reply.send(-11);
    }

    if (user.isDisabled) {
        return reply.send(-12);
    }

    const loginAttempts = await redis.get(`${user.id}:login`);

    if (loginAttempts && parseInt(loginAttempts) == 5) {
        return reply.send(-12);
    }

    if (!checkUserGjp2(gjp2, user.passHash)) {
        if (!loginAttempts) {
            await redis.set(`${user.id}:login`, 1, "EX", timeLimits.loginAttempts);
        } else {
            await redis.incr(`${user.id}:login`);
        }

        return reply.send(-11);
    }

    await redis.del(`${user.id}:login`);

    return reply.send(`${user.id},${user.id}`);
}

export async function updateGJAccSettingsController(request: FastifyRequest<{ Body: UpdateGJAccSettingsInput }>, reply: FastifyReply) {
    const { accountID, gjp2, mS, frS, cS, yt, twitter, twitch } = request.body;

    const user = await getUserById(accountID);

    if (!user || user.isDisabled) {
        return reply.send(-1);
    }

    if (!checkUserGjp2(gjp2, user.passHash)) {
        return reply.send(-1);
    }

    await updateUserSettings(accountID, {
        messageState: messageStateToEnum(mS),
        friendState: friendRequestStateToEnum(frS),
        commentHistoryState: commentHistoryStateToEnum(cS),
        youtube: yt,
        twitter: twitter,
        twitch: twitch
    });

    return reply.send(1);
}

export async function backupGJAccountNewController(request: FastifyRequest<{ Body: BackupGJAccountNewInput }>, reply: FastifyReply) {
    const { accountID, gjp2, saveData, gameVersion, binaryVersion } = request.body;

    const isAccountBackedUp = Boolean(await redis.exists(`${accountID}:backup`));

    if (isAccountBackedUp) {
        return reply.send(-1);
    }

    const user = await getUserById(accountID);

    if (!user || user.isDisabled) {
        return reply.send(-1);
    }

    if (!checkUserGjp2(gjp2, user.passHash)) {
        return reply.send(-1);
    }

    writeFileSync(path.join(__dirname, "../../../", "data", "account", `${accountID}.acc`), `${saveData};${gameVersion};${binaryVersion};a;a`);

    await redis.set(`${accountID}:backup`, 1, "EX", timeLimits.accountBackup);

    return reply.send(1);
}

export async function syncGJAccountNewController(request: FastifyRequest<{ Body: SyncGJAccountNewInput }>, reply: FastifyReply) {
    const { accountID, gjp2 } = request.body;

    const isAccountSynced = Boolean(await redis.exists(`${accountID}:sync`));

    if (isAccountSynced) {
        return reply.send(-1);
    }

    const user = await getUserById(accountID);

    if (!user || user.isDisabled) {
        return reply.send(-1);
    }

    if (!checkUserGjp2(gjp2, user.passHash)) {
        return reply.send(-1);
    }

    try {
        const saveData = readFileSync(path.join(__dirname, "../../../", "data", "account", `${accountID}.acc`), "utf-8");

        await redis.set(`${accountID}:sync`, 1, "EX", timeLimits.accountSync);

        return reply.send(saveData);
    } catch {
        return reply.send(-1);
    }
}

export async function getAccountUrlController(request: FastifyRequest, reply: FastifyReply) {
    return reply.send(`${server.domain}/${database.path}`);
}