import { FastifyInstance } from "fastify";

import { ZodTypeProvider } from "fastify-type-provider-zod";

import {
    uploadFriendRequestController,
    getGJFriendRequestsController,
    readGJFriendRequestController,
    acceptGJFriendRequestController,
    deleteGJFriendRequestsController
} from "../../controllers/gd/friendRequest";

import checkSecret from "../../middlewares/checkSecret";

import {
    uploadFriendRequestSchema,
    getGJFriendRequestsSchema,
    readGJFriendRequestSchema,
    acceptGJFriendRequestSchema,
    deleteGJFriendRequestsSchema
} from "../../schemas/gd/friendRequest";

import { Secret } from "../../helpers/enums";

export default async function gdFriendRequestRoutes(fastify: FastifyInstance) {
    fastify.withTypeProvider<ZodTypeProvider>().post("/uploadFriendRequest20.php", {
        preHandler: checkSecret(Secret.Common),
        schema: {
            body: uploadFriendRequestSchema
        }
    }, uploadFriendRequestController);

    fastify.withTypeProvider<ZodTypeProvider>().post("/getGJFriendRequests20.php", {
        preHandler: checkSecret(Secret.Common),
        schema: {
            body: getGJFriendRequestsSchema
        }
    }, getGJFriendRequestsController);

    fastify.withTypeProvider<ZodTypeProvider>().post("/readGJFriendRequest20.php", {
        preHandler: checkSecret(Secret.Common),
        schema: {
            body: readGJFriendRequestSchema
        }
    }, readGJFriendRequestController);

    fastify.withTypeProvider<ZodTypeProvider>().post("/acceptGJFriendRequest20.php", {
        preHandler: checkSecret(Secret.Common),
        schema: {
            body: acceptGJFriendRequestSchema
        }
    }, acceptGJFriendRequestController);

    fastify.withTypeProvider<ZodTypeProvider>().post("/deleteGJFriendRequests20.php", {
        preHandler: checkSecret(Secret.Common),
        schema: {
            body: deleteGJFriendRequestsSchema
        }
    }, deleteGJFriendRequestsController);
}