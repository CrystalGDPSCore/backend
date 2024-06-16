import { FastifyInstance } from "fastify";

import { ZodTypeProvider } from "fastify-type-provider-zod";

import { likeGJItemController } from "../../controllers/gd/misc";

import checkSecret from "../../middlewares/checkSecret";

import { likeGJItemSchema } from "../../schemas/gd/misc";

import { Secret } from "../../helpers/enums";

export default async function gdMiscRoutes(fastify: FastifyInstance) {
    fastify.withTypeProvider<ZodTypeProvider>().post("/likeGJItem211.php", {
        preHandler: checkSecret(Secret.Common, 1),
        schema: {
            body: likeGJItemSchema
        }
    }, likeGJItemController);
}