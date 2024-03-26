import { FastifyRequest, FastifyReply } from "fastify";

import { redis } from "../../utils/db";

import { UploadGJAccCommentInput } from "../../schemas/gd/accountComment";

import { getUserById } from "../../services/user";
import { createUserComment } from "../../services/userComment";

import { checkUserGjp2, safeBase64Decode } from "../../utils/crypt";

import { timeLimits } from "../../config.json";

export async function uploadGJAccCommentController(request: FastifyRequest<{ Body: UploadGJAccCommentInput }>, reply: FastifyReply) {
    const { accountID, gjp2, comment: base64Comment } = request.body;

    const isUserCommentUploaded = Boolean(await redis.exists(`${accountID}:uploadAccountComment`));

    if (isUserCommentUploaded) {
        return reply.send(-1);
    }

    const user = await getUserById(accountID);

    if (!user) {
        return reply.send(-1);
    }

    if (!checkUserGjp2(gjp2, user.passHash)) {
        return reply.send(-1);
    }

    const comment = safeBase64Decode(base64Comment);

    if (!comment.length || comment.length > 140) {
        return reply.send(-1);
    }

    await createUserComment(accountID, comment);

    await redis.set(`${accountID}:uploadAccountComment`, 1, "EX", timeLimits.uploadUserComment);

    return reply.send(1);
}