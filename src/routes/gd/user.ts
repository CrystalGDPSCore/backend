import { FastifyInstance } from "fastify";

import { getGJUserInfoHandler } from "../../controllers/gd/user";

export default async function gdUserRoutes(fastify: FastifyInstance) {
    fastify.post("/getGJUserInfo20.php", getGJUserInfoHandler);
}