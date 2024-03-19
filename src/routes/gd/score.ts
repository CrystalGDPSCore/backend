import { FastifyInstance } from "fastify";

import { ZodTypeProvider } from "fastify-type-provider-zod";

import { updateGJUserScoreController } from "../../controllers/gd/score";

import checkSecret from "../../middlewares/checkSecret";

import { updateGJUserScoreSchema } from "../../schemas/gd/score";

import { Secret } from "../../helpers/enums";

export default async function gdScoreRoutes(fastify: FastifyInstance) {
    fastify.withTypeProvider<ZodTypeProvider>().post("/updateGJUserScore22.php", {
        preHandler: checkSecret(Secret.Common),
        schema: {
            body: updateGJUserScoreSchema
        }
    }, updateGJUserScoreController);
}