import { FastifyInstance } from "fastify";

import { getGJUserInfoHandler, getGJUsersHandler } from "../../controllers/gd/user";

export default async function gdUserRoutes(fastify: FastifyInstance) {
    fastify.post("/getGJUserInfo20.php", getGJUserInfoHandler);
    fastify.post("/getGJUsers20.php", getGJUsersHandler);
}