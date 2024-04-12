import { FastifyInstance } from "fastify";

import { ZodTypeProvider } from "fastify-type-provider-zod";

import { uploadGJMessageController } from "../../controllers/gd/message";

import checkSecret from "../../middlewares/checkSecret";

import { uploadGJMessageSchema } from "../../schemas/gd/message";

import { Secret } from "../../helpers/enums";

export default async function gdMessageRoutes(fastify: FastifyInstance) {
    fastify.withTypeProvider<ZodTypeProvider>().post("/uploadGJMessage20.php", {
        preHandler: checkSecret(Secret.Common),
        schema: {
            body: uploadGJMessageSchema
        }
    }, uploadGJMessageController);
}