import { FastifyInstance } from "fastify";

import { getGJUserInfoHandler, requestUserAccessHandler } from "../../controllers/gd/user";

export default async function gdUserRoutes(fastify: FastifyInstance) {
    fastify.post("/getGJUserInfo20.php", getGJUserInfoHandler);
    fastify.post("/requestUserAccess.php", requestUserAccessHandler);
}