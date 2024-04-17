import { FastifyInstance } from "fastify";

import { ZodTypeProvider } from "fastify-type-provider-zod";

import { uploadGJMessageController, getGJMessagesController, downloadGJMessageController } from "../../controllers/gd/message";

import checkSecret from "../../middlewares/checkSecret";

import { uploadGJMessageSchema, getGJMessagesSchema, downloadGJMessageSchema } from "../../schemas/gd/message";

import { Secret } from "../../helpers/enums";

export default async function gdMessageRoutes(fastify: FastifyInstance) {
    fastify.withTypeProvider<ZodTypeProvider>().post("/uploadGJMessage20.php", {
        preHandler: checkSecret(Secret.Common),
        schema: {
            body: uploadGJMessageSchema
        }
    }, uploadGJMessageController);

    fastify.withTypeProvider<ZodTypeProvider>().post("/getGJMessages20.php", {
        preHandler: checkSecret(Secret.Common),
        schema: {
            body: getGJMessagesSchema
        }
    }, getGJMessagesController);

    fastify.withTypeProvider<ZodTypeProvider>().post("/downloadGJMessage20.php", {
        preHandler: checkSecret(Secret.Common),
        schema: {
            body: downloadGJMessageSchema
        }
    }, downloadGJMessageController);
}