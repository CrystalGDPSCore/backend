import { FastifyInstance } from "fastify";

import { ZodTypeProvider } from "fastify-type-provider-zod";

import { uploadGJLevelListController } from "../../controllers/gd/levelList";

import checkSecret from "../../middlewares/checkSecret";

import { uploadGJLevelListSchema } from "../../schemas/gd/levelList";

import { Secret } from "../../helpers/enums";

export default async function gdLevelListRoutes(fastify: FastifyInstance) {
    fastify.withTypeProvider<ZodTypeProvider>().post("/uploadGJLevelList.php", {
        preHandler: checkSecret(Secret.Common, -100),
        schema: {
            body: uploadGJLevelListSchema
        }
    }, uploadGJLevelListController);
}