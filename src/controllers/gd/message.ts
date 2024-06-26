import { FastifyRequest, FastifyReply } from "fastify";

import { redis } from "../../utils/db";

import { UploadGJMessageInput, GetGJMessagesInput, DownloadGJMessageInput, DeleteGJMessagesInput } from "../../schemas/gd/message";

import { getUserById, getUsers } from "../../services/user";
import { blockedExists } from "../../services/blockList";
import { friendExists } from "../../services/friendList";
import { createMessage, getMessages, updateMessage, getMessage, deleteMessages, getMessagesCount } from "../../services/message";

import { checkUserGjp2, safeBase64Decode, safeBase64Encode, base64Decode, xor } from "../../utils/crypt";
import { getRelativeTime } from "../../utils/relativeTime";
import { gdObjToString } from "../../utils/gdForm";

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

    if (!checkUserGjp2(gjp2, userOwn.hashPassword)) {
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

export async function getGJMessagesController(request: FastifyRequest<{ Body: GetGJMessagesInput }>, reply: FastifyReply) {
    const { accountID, gjp2, page, getSent } = request.body;

    const userOwn = await getUserById(accountID);

    if (!userOwn || userOwn.isDisabled) {
        return reply.send(-1);
    }

    if (!checkUserGjp2(gjp2, userOwn.hashPassword)) {
        return reply.send(-1);
    }

    const userType = getSent ? "recipientId" : "userId";

    const messages = await getMessages(accountID, {
        offset: page * 10,
        isSent: getSent
    });

    if (!messages.length) {
        return reply.send(-2);
    }

    const users = await getUsers(messages.map(message => message[userType]));

    const messageList = messages.map(message => {
        const userTarget = users.find(user => user.id == message[userType])!;

        const messageInfoObj = {
            1: message.id,
            2: userTarget.id,
            3: userTarget.id,
            4: safeBase64Encode(message.subject),
            6: userTarget.userName,
            7: getRelativeTime(message.sendDate),
            8: message.isNew ? 0 : 1,
            9: getSent ? 1 : 0
        };

        return gdObjToString(messageInfoObj);
    }).join("|");

    const generalInfo = [
        messageList,
        [await getMessagesCount(accountID, getSent), page * 10, 10].join(":")
    ].join("#");

    return reply.send(generalInfo);
}

export async function downloadGJMessageController(request: FastifyRequest<{ Body: DownloadGJMessageInput }>, reply: FastifyReply) {
    const { accountID, gjp2, isSender, messageID } = request.body;

    const userOwn = await getUserById(accountID);

    if (!userOwn || userOwn.isDisabled) {
        return reply.send(-1);
    }

    if (!checkUserGjp2(gjp2, userOwn.hashPassword)) {
        return reply.send(-1);
    }

    const userType = isSender ? "recipientId" : "userId";

    const message = await getMessage(messageID);

    if (!message) {
        return reply.send(-1);
    }

    const userTarget = await getUserById(message[userType]);

    if (!userTarget || userTarget.isDisabled) {
        return reply.send(-1);
    }

    if (!isSender && message.isNew) {
        await updateMessage(message.recipientId, messageID);
    }

    const messageInfoObj = {
        1: message.id,
        2: userTarget.id,
        3: userTarget.id,
        4: safeBase64Encode(message.subject),
        5: safeBase64Encode(xor(message.body, 14251)),
        6: userTarget.userName,
        7: getRelativeTime(message.sendDate),
        8: message.isNew ? 0 : 1,
        9: isSender ? 1 : 0
    };

    return reply.send(gdObjToString(messageInfoObj));
}

export async function deleteGJMessagesController(request: FastifyRequest<{ Body: DeleteGJMessagesInput }>, reply: FastifyReply) {
    const { accountID, gjp2, isSender, messageID, messages } = request.body;

    const user = await getUserById(accountID);

    if (!user || user.isDisabled) {
        return reply.send(-1);
    }

    if (!checkUserGjp2(gjp2, user.hashPassword)) {
        return reply.send(-1);
    }

    const messageList = messages.length ? messages : [messageID];

    await deleteMessages(accountID, {
        messageIds: messageList,
        isSent: isSender
    });

    return reply.send(1);
}