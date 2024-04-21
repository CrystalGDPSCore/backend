import { FastifyInstance } from "fastify";

import { ZodTypeProvider } from "fastify-type-provider-zod";

import { uploadGJLevelController } from "../../controllers/gd/level";

import checkSecret from "../../middlewares/checkSecret";

import { uploadGJLevelSchema } from "../../schemas/gd/level";

import { Secret } from "../../helpers/enums";

export default async function gdLevelRoutes(fastify: FastifyInstance) {
    fastify.withTypeProvider<ZodTypeProvider>().post("/uploadGJLevel21.php", {
        preHandler: checkSecret(Secret.Common),
        schema: {
            body: uploadGJLevelSchema
        }
    }, uploadGJLevelController);
}