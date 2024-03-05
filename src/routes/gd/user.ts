import { FastifyInstance } from "fastify";

import { getGJUserInfoHandler, getGJUsersHandler, requestUserAccessHandler } from "../../controllers/gd/user";

export default async function gdUserRoutes(fastify: FastifyInstance) {
    fastify.post("/getGJUserInfo20.php", getGJUserInfoHandler);
    fastify.post("/getGJUsers20.php", getGJUsersHandler);
    fastify.post("/requestUserAccess.php", requestUserAccessHandler);
}