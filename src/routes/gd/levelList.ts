import { FastifyInstance } from "fastify";

import { ZodTypeProvider } from "fastify-type-provider-zod";

import { deleteGJLevelListController, getGJLevelListsController, uploadGJLevelListController } from "../../controllers/gd/levelList";

import checkSecret from "../../middlewares/checkSecret";

import { deleteGJLevelListSchema, getGJLevelListsSchema, uploadGJLevelListSchema } from "../../schemas/gd/levelList";

import { Secret } from "../../helpers/enums";

export default async function gdLevelListRoutes(fastify: FastifyInstance) {
    fastify.withTypeProvider<ZodTypeProvider>().post("/uploadGJLevelList.php", {
        preHandler: checkSecret(Secret.Common, -100),
        schema: {
            body: uploadGJLevelListSchema
        }
    }, uploadGJLevelListController);

    fastify.withTypeProvider<ZodTypeProvider>().post("/getGJLevelLists.php", {
        preHandler: checkSecret(Secret.Common, -100),
        schema: {
            body: getGJLevelListsSchema
        }
    }, getGJLevelListsController);

    fastify.withTypeProvider<ZodTypeProvider>().post("/deleteGJLevelList.php", {
        preHandler: checkSecret(Secret.Level),
        schema: {
            body: deleteGJLevelListSchema
        }
    }, deleteGJLevelListController);
}