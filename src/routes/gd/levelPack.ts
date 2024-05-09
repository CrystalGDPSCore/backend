import { FastifyInstance } from "fastify";

import { ZodTypeProvider } from "fastify-type-provider-zod";

import { getGJGauntletsController, getGJMapPacksController } from "../../controllers/gd/levelPack";

import checkSecret from "../../middlewares/checkSecret";

import { getGJGauntletsSchema, getGJMapPacksSchema } from "../../schemas/gd/levelPack";

import { Secret } from "../../helpers/enums";

export default async function gdLevelPackRoutes(fastify: FastifyInstance) {
    fastify.withTypeProvider<ZodTypeProvider>().post("/getGJGauntlets21.php", {
        preHandler: checkSecret(Secret.Common),
        schema: {
            body: getGJGauntletsSchema
        }
    }, getGJGauntletsController);

    fastify.withTypeProvider<ZodTypeProvider>().post("/getGJMapPacks21.php", {
        preHandler: checkSecret(Secret.Common),
        schema: {
            body: getGJMapPacksSchema
        }
    }, getGJMapPacksController);
}