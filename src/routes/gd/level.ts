import { FastifyInstance } from "fastify";

import { ZodTypeProvider } from "fastify-type-provider-zod";

import {
    uploadGJLevelController,
    getGJLevelsController,
    downloadGJLevelController,
    getGJDailyLevelController,
    deleteGJLevelUserController
} from "../../controllers/gd/level";

import checkSecret from "../../middlewares/checkSecret";

import {
    uploadGJLevelSchema,
    getGJLevelsSchema,
    downloadGJLevelSchema,
    getGJDailyLevelSchema,
    deleteGJLevelUserSchema
} from "../../schemas/gd/level";

import { Secret } from "../../helpers/enums";

export default async function gdLevelRoutes(fastify: FastifyInstance) {
    fastify.withTypeProvider<ZodTypeProvider>().post("/uploadGJLevel21.php", {
        preHandler: checkSecret(Secret.Common),
        schema: {
            body: uploadGJLevelSchema
        }
    }, uploadGJLevelController);

    fastify.withTypeProvider<ZodTypeProvider>().post("/getGJLevels21.php", {
        preHandler: checkSecret(Secret.Common),
        schema: {
            body: getGJLevelsSchema
        }
    }, getGJLevelsController);

    fastify.withTypeProvider<ZodTypeProvider>().post("/downloadGJLevel22.php", {
        preHandler: checkSecret(Secret.Common),
        schema: {
            body: downloadGJLevelSchema
        }
    }, downloadGJLevelController);

    fastify.withTypeProvider<ZodTypeProvider>().post("/getGJDailyLevel.php", {
        preHandler: checkSecret(Secret.Common),
        schema: {
            body: getGJDailyLevelSchema
        }
    }, getGJDailyLevelController);

    fastify.withTypeProvider<ZodTypeProvider>().post("/deleteGJLevelUser20.php", {
        preHandler: checkSecret(Secret.Level),
        schema: {
            body: deleteGJLevelUserSchema
        }
    }, deleteGJLevelUserController);
}