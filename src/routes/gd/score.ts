import { FastifyInstance } from "fastify";

import { updateGJUserScoreHandler } from "../../controllers/gd/score";

export default async function gdScoreRoutes(fastify: FastifyInstance) {
    fastify.post("/updateGJUserScore22.php", updateGJUserScoreHandler);
}