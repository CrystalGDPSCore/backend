import { FastifyInstance } from "fastify";

import { getGJChallengesHandler } from "../../controllers/gd/reward";

export default async function gdRewardRoutes(fastify: FastifyInstance) {
    fastify.post("/getGJChallenges.php", getGJChallengesHandler);
}