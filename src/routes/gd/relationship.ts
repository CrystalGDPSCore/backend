import { FastifyInstance } from "fastify";

import { ZodTypeProvider } from "fastify-type-provider-zod";

import { getGJUserListController, removeGJFriendController } from "../../controllers/gd/relationship";

import checkSecret from "../../middlewares/checkSecret";

import { getGJUserListSchema, removeGJFriendSchema } from "../../schemas/gd/relationship";

import { Secret } from "../../helpers/enums";

export default async function gdRelationshipRoutes(fastify: FastifyInstance) {
    fastify.withTypeProvider<ZodTypeProvider>().post("/getGJUserList20.php", {
        preHandler: checkSecret(Secret.Common),
        schema: {
            body: getGJUserListSchema
        }
    }, getGJUserListController);

    fastify.withTypeProvider<ZodTypeProvider>().post("/removeGJFriend20.php", {
        preHandler: checkSecret(Secret.Common),
        schema: {
            body: removeGJFriendSchema
        }
    }, removeGJFriendController);
}