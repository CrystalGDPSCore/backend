import { FastifyInstance } from "fastify";

import { ZodTypeProvider } from "fastify-type-provider-zod";

import { getGJChallengesController } from "../../controllers/gd/reward";

import checkSecret from "../../middlewares/checkSecret";

import { getGJChallengesSchema } from "../../schemas/gd/reward";

import { Secret } from "../../helpers/enums";

export default async function gdRewardRoutes(fastify: FastifyInstance) {
    fastify.withTypeProvider<ZodTypeProvider>().post("/getGJChallenges.php", {
        preHandler: checkSecret(Secret.Common),
        schema: {
            body: getGJChallengesSchema
        }
    }, getGJChallengesController);
}