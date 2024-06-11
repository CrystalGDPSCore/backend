import { FastifyRequest, FastifyReply } from "fastify";

import { redis } from "../../utils/db";

import { DeleteGJCommentInput, GetGJCommentHistoryInput, GetGJCommentsInput, UploadGJCommentInput } from "../../schemas/gd/comment";

import { getUserById, getUsers } from "../../services/user";
import { getLevelById } from "../../services/level";
import { friendExists } from "../../services/friendList";
import {
    createComment,
    getComments,
    getCommentsCount,
    getCommentById,
    deleteComment,
    getUserCommentHistory,
    getUserCommentHistoryCount
} from "../../services/comment";

import { checkUserGjp2, safeBase64Decode, safeBase64Encode } from "../../utils/crypt";
import { getRelativeTime } from "../../utils/relativeTime";
import { modLevelToInt } from "../../utils/prismaEnums";
import { hexToRgb } from "../../utils/color";
import { gdObjToString } from "../../utils/gdForm";

import { IconType } from "../../helpers/enums";

import { timeLimits } from "../../config.json";

export async function uploadGJCommentController(request: FastifyRequest<{ Body: UploadGJCommentInput }>, reply: FastifyReply) {
    const { accountID, gjp2, levelID, percent, comment: base64Comment } = request.body;

    const isCommentUploaded = Boolean(await redis.exists(`${accountID}:uploadComment`));

    if (isCommentUploaded) {
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

    if (!comment || comment.length > 100) {
        return reply.send(-1);
    }

    if (percent < 0 || percent > 100) {
        return reply.send(-1);
    }

    const isList = levelID < 0 ? true : false;

    switch (isList) {
        case true:
            // todo: check if list exists
            break;
        case false:
            const level = await getLevelById(levelID);

            if (!level) {
                return reply.send(-1);
            }

            if (level.visibility == "FriendsOnly" && accountID != level.authorId && !await friendExists(accountID, level.authorId)) {
                return reply.send(-1);
            }
            break;
    }

    await createComment({
        userId: accountID,
        itemId: Math.abs(levelID),
        comment,
        percent: percent || null,
        isList
    });

    await redis.set(`${accountID}:uploadComment`, 1, "EX", timeLimits.uploadComment);

    return reply.send(1);
}

export async function getGJCommentsController(request: FastifyRequest<{ Body: GetGJCommentsInput }>, reply: FastifyReply) {
    const { accountID, gjp2, levelID, page, mode, count } = request.body;

    const userOwn = await getUserById(accountID);

    if (!userOwn || userOwn.isDisabled) {
        return reply.send(-1);
    }

    if (!checkUserGjp2(gjp2, userOwn.hashPassword)) {
        return reply.send(-1);
    }

    const isList = levelID < 0 ? true : false;

    const comments = await getComments({
        itemId: Math.abs(levelID),
        isList,
        mode,
        offset: page * count,
        count
    });

    if (!comments.length) {
        return reply.send(-2); // any error code
    }

    const users = await getUsers(comments.map(comment => comment.userId));

    const commentList = comments.map(comment => {
        const userTarget = users.find(user => user.id == comment.userId)!;

        const commentInfoObj = {
            2: safeBase64Encode(comment.comment),
            3: comment.userId,
            4: comment.likes,
            6: comment.id,
            7: comment.isSpam ? 1 : 0,
            8: comment.userId,
            9: getRelativeTime(comment.postDate),
            10: comment.percent ?? 0,
            11: modLevelToInt(userTarget.modLevel)[0],
            12: hexToRgb(`#${userTarget.commentColor || "ffffff"}`).join(",")
        };

        const shownIcon = Object.values(IconType)[userTarget.stats!.iconType];

        const userInfoObj = {
            1: userTarget.userName,
            9: userTarget.stats![`icon${shownIcon}`],
            10: userTarget.stats!.primaryColor,
            11: userTarget.stats!.secondaryColor,
            14: userTarget.stats!.iconType,
            15: userTarget.stats!.hasGlow ? 2 : 0,
            16: comment.userId
        };

        const generalInfo = [
            gdObjToString(commentInfoObj, "~"),
            gdObjToString(userInfoObj, "~")
        ].join(":");

        return generalInfo;
    }).join("|");

    const generalInfo = [
        commentList,
        [await getCommentsCount(Math.abs(levelID), isList), page * count, count].join(":")
    ].join("#");

    return reply.send(generalInfo);
}

export async function deleteGJCommentController(request: FastifyRequest<{ Body: DeleteGJCommentInput }>, reply: FastifyReply) {
    const { accountID, gjp2, levelID, commentID } = request.body;

    const user = await getUserById(accountID);

    if (!user || user.isDisabled) {
        return reply.send(-1);
    }

    if (!checkUserGjp2(gjp2, user.hashPassword)) {
        return reply.send(-1);
    }

    const isList = levelID < 0 ? true : false;

    const comment = await getCommentById(commentID);

    if (!comment) {
        return reply.send(-1);
    }

    if (accountID != comment.userId && ["None", "LeaderboardMod"].includes(user.modLevel)) {
        return reply.send(-1);
    }

    await deleteComment(commentID, isList);

    return reply.send(1);
}

export async function getGJCommentHistoryController(request: FastifyRequest<{ Body: GetGJCommentHistoryInput }>, reply: FastifyReply) {
    const { accountID, gjp2, userID, page, mode, count } = request.body;

    const userOwn = await getUserById(accountID);

    if (!userOwn || userOwn.isDisabled) {
        return reply.send(-1);
    }

    if (!checkUserGjp2(gjp2, userOwn.hashPassword)) {
        return reply.send(-1);
    }

    const userTarget = await getUserById(userID);

    if (!userTarget || !userTarget.stats || userTarget.isDisabled) {
        return reply.send(-1);
    }

    const shownIcon = Object.values(IconType)[userTarget.stats.iconType];

    const comments = await getUserCommentHistory({
        userId: userID,
        mode,
        offset: page * count,
        count
    });

    if (!comments.length) {
        return reply.send(-2); // same any error code
    }

    const commentList = comments.map(comment => {
        const commentInfoObj = {
            1: comment.isList ? comment.itemId * -1 : comment.itemId,
            2: safeBase64Encode(comment.comment),
            3: comment.userId,
            4: comment.likes,
            6: comment.id,
            7: comment.isSpam ? 1 : 0,
            8: comment.userId,
            9: getRelativeTime(comment.postDate),
            10: comment.percent ?? 0,
            11: modLevelToInt(userTarget.modLevel)[0],
            12: hexToRgb(`#${userTarget.commentColor || "ffffff"}`).join(",")
        };

        const userInfoObj = {
            1: userTarget.userName,
            9: userTarget.stats![`icon${shownIcon}`],
            10: userTarget.stats!.primaryColor,
            11: userTarget.stats!.secondaryColor,
            14: userTarget.stats!.iconType,
            15: userTarget.stats!.hasGlow ? 2 : 0,
            16: comment.userId
        };

        const generalInfo = [
            gdObjToString(commentInfoObj, "~"),
            gdObjToString(userInfoObj, "~")
        ].join(":");

        return generalInfo;
    }).join("|");

    const generalInfo = [
        commentList,
        [await getUserCommentHistoryCount(userID), page * count, count].join(":")
    ].join("#");

    return reply.send(generalInfo);
}