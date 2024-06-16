import { FastifyRequest, FastifyReply } from "fastify";

import { LikeGJItemInput } from "../../schemas/gd/misc";

import { getUserById } from "../../services/user";
import { likeExists, createLike } from "../../services/like";
import { levelExists } from "../../services/level";
import { commentExists } from "../../services/comment";
import { userCommentExists } from "../../services/userComment";
import { listExists } from "../../services/levelList";

import { checkUserGjp2 } from "../../utils/crypt";

export async function likeGJItemController(request: FastifyRequest<{ Body: LikeGJItemInput }>, reply: FastifyReply) {
    const { accountID, gjp2, itemID, like, type } = request.body;

    const user = await getUserById(accountID);

    if (!user || user.isDisabled) {
        return reply.send(-1);
    }

    if (!checkUserGjp2(gjp2, user.hashPassword)) {
        return reply.send(-1);
    }

    if (await likeExists(accountID, itemID, type)) {
        return reply.send(-1);
    }

    switch (type) {
        case "Level":
            if (!levelExists(itemID)) {
                return reply.send(-1);
            }
            break;
        case "Comment":
            if (!commentExists(itemID)) {
                return reply.send(-1);
            }
            break;
        case "UserComment":
            if (!userCommentExists(itemID)) {
                return reply.send(-1);
            }
            break;
        case "LevelList":
            if (!listExists(itemID)) {
                return reply.send(-1);
            }
            break;
    }

    await createLike({
        userId: accountID,
        itemId: itemID,
        itemType: type,
        likeType: like
    });

    return reply.send(1);
}