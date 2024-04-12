import { FastifyRequest, FastifyReply } from "fastify";

import { redis } from "../../utils/db";

import { UploadGJMessageInput } from "../../schemas/gd/message";

import { getUserById } from "../../services/user";
import { blockedExists } from "../../services/blockList";
import { friendExists } from "../../services/friendList";
import { createMessage } from "../../services/message";

import { checkUserGjp2, safeBase64Decode, base64Decode, xor } from "../../utils/crypt";

import { timeLimits } from "../../config.json";

export async function uploadGJMessageController(request: FastifyRequest<{ Body: UploadGJMessageInput }>, reply: FastifyReply) {
    const { accountID, gjp2, toAccountID, subject: base64Subject, body: base64Body } = request.body;

    if (accountID == toAccountID) {
        return reply.send(-1);
    }

    const isMessageUploaded = Boolean(await redis.exists(`${accountID}:uploadMessage`));

    if (isMessageUploaded) {
        return reply.send(-1);
    }

    const userOwn = await getUserById(accountID);

    if (!userOwn || userOwn.isDisabled) {
        return reply.send(-1);
    }

    if (!checkUserGjp2(gjp2, userOwn.hashedPassword)) {
        return reply.send(-1);
    }

    const userTarget = await getUserById(toAccountID);

    if (!userTarget || userTarget.isDisabled) {
        return reply.send(-1);
    }

    switch (userTarget.messageState) {
        case "All":
            if (await blockedExists(accountID, toAccountID) || await blockedExists(toAccountID, accountID)) {
                return reply.send(-1);
            }
            break;
        case "Friends":
            if (!await friendExists(accountID, toAccountID)) {
                return reply.send(-1);
            }
            break;
        case "None":
            return reply.send(-1);
    }

    const subject = safeBase64Decode(base64Subject);
    const body = xor(base64Decode(base64Body), 14251);

    if (!subject || subject.length > 35) {
        return reply.send(-1);
    }

    if (!body || body.length > 200) {
        return reply.send(-1);
    }

    await createMessage(accountID, {
        recipientId: toAccountID,
        subject,
        body
    });

    await redis.set(`${accountID}:uploadMessage`, 1, "EX", timeLimits.uploadMessage);

    return reply.send(1);
}