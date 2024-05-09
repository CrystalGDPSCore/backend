import { FastifyRequest, FastifyReply } from "fastify";

import {
    UploadFriendRequestInput,
    GetGJFriendRequestsInput,
    ReadGJFriendRequestInput,
    AcceptGJFriendRequestInput,
    DeleteGJFriendRequestsInput
} from "../../schemas/gd/friendRequest";

import {
    friendRequestExists,
    createFriendRequest,
    getFriendRequests,
    readFriendRequest,
    addFriendFromRequest,
    deleteFriendRequests,
    getFriendRequestsCount
} from "../../services/friendRequest";
import { getUserById, getUsers } from "../../services/user";
import { friendExists, getTotalFriendsCount } from "../../services/friendList";
import { blockedExists } from "../../services/blockList";

import { checkUserGjp2, safeBase64Encode, safeBase64Decode } from "../../utils/crypt";
import { getRelativeTime } from "../../utils/relativeTime";
import { gdObjToString } from "../../utils/gdForm";

import { IconType } from "../../helpers/enums";

export async function uploadFriendRequestController(request: FastifyRequest<{ Body: UploadFriendRequestInput }>, reply: FastifyReply) {
    const { accountID, gjp2, toAccountID, comment: base64Comment } = request.body;

    if (accountID == toAccountID) {
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

    if (userTarget.friendRequestState == "None") {
        return reply.send(-1);
    }

    if (await friendRequestExists(accountID, toAccountID) || await friendRequestExists(toAccountID, accountID)) {
        return reply.send(-1);
    }

    if (await friendExists(accountID, toAccountID)) {
        return reply.send(-1);
    }

    if (await blockedExists(accountID, toAccountID) || await blockedExists(toAccountID, accountID)) {
        return reply.send(-1);
    }

    const comment = safeBase64Decode(base64Comment);

    if (comment.length > 140) {
        return reply.send(-1);
    }

    await createFriendRequest(accountID, {
        recipientId: toAccountID,
        comment
    });

    return reply.send(1);
}

export async function getGJFriendRequestsController(request: FastifyRequest<{ Body: GetGJFriendRequestsInput }>, reply: FastifyReply) {
    const { accountID, gjp2, page, getSent } = request.body;

    const userOwn = await getUserById(accountID);

    if (!userOwn || userOwn.isDisabled) {
        return reply.send(-1);
    }

    if (!checkUserGjp2(gjp2, userOwn.hashPassword)) {
        return reply.send(-1);
    }

    const userType = getSent ? "recipientId" : "userId";

    const friendRequests = await getFriendRequests(accountID, {
        offset: page * 10,
        isSent: getSent
    });

    if (!friendRequests.length) {
        return reply.send(-2);
    }

    const users = await getUsers(friendRequests.map(friendRequest => friendRequest[userType]));

    const friendRequestList = friendRequests.map(friendRequest => {
        const userTarget = users.find(user => user.id == friendRequest[userType])!;

        const shownIcon = Object.values(IconType)[userTarget.stats!.iconType];

        const friendRequestInfoObj = {
            1: userTarget.userName,
            2: userTarget.id,
            16: userTarget.id,
            9: userTarget.stats![`icon${shownIcon}`],
            14: userTarget.stats!.iconType,
            10: userTarget.stats!.primaryColor,
            11: userTarget.stats!.secondaryColor,
            15: userTarget.stats!.hasGlow ? 2 : 0,
            32: friendRequest.id,
            35: safeBase64Encode(friendRequest.comment ?? ""),
            37: getRelativeTime(friendRequest.sendDate),
            41: friendRequest.isNew ? 1 : 0
        };

        return gdObjToString(friendRequestInfoObj);
    }).join("|");

    const generalInfo = [
        friendRequestList,
        [await getFriendRequestsCount(accountID, getSent), page * 10, 10].join(":")
    ].join("#");

    return reply.send(generalInfo);
}

export async function readGJFriendRequestController(request: FastifyRequest<{ Body: ReadGJFriendRequestInput }>, reply: FastifyReply) {
    const { accountID, gjp2, requestID } = request.body;

    const user = await getUserById(accountID);

    if (!user || user.isDisabled) {
        return reply.send(-1);
    }

    if (!checkUserGjp2(gjp2, user.hashPassword)) {
        return reply.send(-1);
    }

    await readFriendRequest(accountID, requestID);

    return reply.send(1);
}

export async function acceptGJFriendRequestController(request: FastifyRequest<{ Body: AcceptGJFriendRequestInput }>, reply: FastifyReply) {
    const { accountID, gjp2, targetAccountID, requestID } = request.body;

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

    if (await getTotalFriendsCount(accountID) == 100) {
        return reply.send(-1);
    }

    await addFriendFromRequest({
        userId: targetAccountID,
        recipientId: accountID,
        requestId: requestID
    });

    return reply.send(1);
}

export async function deleteGJFriendRequestsController(request: FastifyRequest<{ Body: DeleteGJFriendRequestsInput }>, reply: FastifyReply) {
    const { accountID, gjp2, targetAccountID, isSender, accounts } = request.body;

    if (accountID == targetAccountID) {
        return reply.send(-1);
    }

    const user = await getUserById(accountID);

    if (!user || user.isDisabled) {
        return reply.send(-1);
    }

    if (!checkUserGjp2(gjp2, user.hashPassword)) {
        return reply.send(-1);
    }

    const userList = accounts.length ? accounts : [targetAccountID];

    const userIds = isSender ? [accountID] : userList;
    const recipientId = isSender ? targetAccountID : accountID;

    await deleteFriendRequests(userIds, recipientId);

    return reply.send(1);
}