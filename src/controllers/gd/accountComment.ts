import { FastifyRequest, FastifyReply } from "fastify";

import { redis } from "../../utils/db";

import { UploadGJAccCommentInput, GetGJAccountCommentsInput, DeleteGJAccCommentInput } from "../../schemas/gd/accountComment";

import { getUserById } from "../../services/user";
import { createUserComment, getUserComments, deleteUserComment, getUserCommentsCount } from "../../services/userComment";

import { checkUserGjp2, safeBase64Decode, safeBase64Encode } from "../../utils/crypt";
import { gdObjToString } from "../../utils/gdForm";
import { getRelativeTime } from "../../utils/relativeTime";

import { timeLimits } from "../../config.json";

export async function uploadGJAccCommentController(request: FastifyRequest<{ Body: UploadGJAccCommentInput }>, reply: FastifyReply) {
    const { accountID, gjp2, comment: base64Comment } = request.body;

    const isUserCommentUploaded = Boolean(await redis.exists(`${accountID}:uploadAccountComment`));

    if (isUserCommentUploaded) {
        return reply.send(-1);
    }

    const user = await getUserById(accountID);

    if (!user || user.isDisabled) {
        return reply.send(-1);
    }

    if (!checkUserGjp2(gjp2, user.hashPassword)) {
        return reply.send(-1);
    }

    const comment = safeBase64Decode(base64Comment);

    if (!comment || comment.length > 140) {
        return reply.send(-1);
    }

    await createUserComment(accountID, comment);

    await redis.set(`${accountID}:uploadAccountComment`, 1, "EX", timeLimits.uploadUserComment);

    return reply.send(1);
}

export async function getGJAccountCommentsController(request: FastifyRequest<{ Body: GetGJAccountCommentsInput }>, reply: FastifyReply) {
    const { accountID, gjp2, page } = request.body;

    const userOwn = await getUserById(accountID[0]);

    if (!userOwn || userOwn.isDisabled) {
        return reply.send(-1);
    }

    if (!checkUserGjp2(gjp2, userOwn.hashPassword)) {
        return reply.send(-1);
    }

    const userTarget = await getUserById(accountID[1]);

    if (!userTarget || userTarget.isDisabled) {
        return reply.send(-1);
    }

    const comments = await getUserComments(accountID[1], page * 10);

    if (!comments.length) {
        return reply.send("#0:0:0");
    }

    const commentList = comments.map(comment => {
        const commentInfoObj = {
            2: safeBase64Encode(comment.comment),
            4: comment.likes,
            6: comment.id,
            7: comment.isSpam ? 1 : 0,
            9: getRelativeTime(comment.postDate)
        };

        return gdObjToString(commentInfoObj, "~");
    }).join("|");

    const generalInfo = [
        commentList,
        [await getUserCommentsCount(accountID[1]), page * 10, 10].join(":")
    ].join("#");

    return reply.send(generalInfo);
}

export async function deleteGJAccCommentController(request: FastifyRequest<{ Body: DeleteGJAccCommentInput }>, reply: FastifyReply) {
    const { accountID, gjp2, commentID } = request.body;

    const user = await getUserById(accountID);

    if (!user || user.isDisabled) {
        return reply.send(-1);
    }

    if (!checkUserGjp2(gjp2, user.hashPassword)) {
        return reply.send(-1);
    }

    await deleteUserComment(accountID, commentID);

    return reply.send(1);
}