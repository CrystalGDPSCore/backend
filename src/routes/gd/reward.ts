import { FastifyInstance } from "fastify";

import { ZodTypeProvider } from "fastify-type-provider-zod";

import { getGJChallengesController, getGJRewardsController } from "../../controllers/gd/reward";

import checkSecret from "../../middlewares/checkSecret";

import { getGJChallengesSchema, getGJRewardsSchema } from "../../schemas/gd/reward";

import { Secret } from "../../helpers/enums";

export default async function gdRewardRoutes(fastify: FastifyInstance) {
    fastify.withTypeProvider<ZodTypeProvider>().post("/getGJChallenges.php", {
        preHandler: checkSecret(Secret.Common),
        schema: {
            body: getGJChallengesSchema
        }
    }, getGJChallengesController);

    fastify.withTypeProvider<ZodTypeProvider>().post("/getGJRewards.php", {
        preHandler: checkSecret(Secret.Common),
        schema: {
            body: getGJRewardsSchema
        }
    }, getGJRewardsController);
}