import { FastifyInstance } from "fastify";

import { ZodTypeProvider } from "fastify-type-provider-zod";

import { blockGJUserController, unblockGJUserController } from "../../controllers/gd/block";

import checkSecret from "../../middlewares/checkSecret";

import { blockGJUserSchema, unblockGJUserSchema } from "../../schemas/gd/block";

import { Secret } from "../../helpers/enums";

export default async function gdBlockRoutes(fastify: FastifyInstance) {
    fastify.withTypeProvider<ZodTypeProvider>().post("/blockGJUser20.php", {
        preHandler: checkSecret(Secret.Common),
        schema: {
            body: blockGJUserSchema
        }
    }, blockGJUserController);

    fastify.withTypeProvider<ZodTypeProvider>().post("/unblockGJUser20.php", {
        preHandler: checkSecret(Secret.Common),
        schema: {
            body: unblockGJUserSchema
        }
    }, unblockGJUserController);
}