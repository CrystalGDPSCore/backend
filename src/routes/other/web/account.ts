import { FastifyInstance } from "fastify";

import { activateAccountHandler, registerAccountHandler } from "../../../controllers/other/web/account";

export default async function accountRoutes(fastify: FastifyInstance) {
    fastify.get("/activate", activateAccountHandler);
    fastify.get("/register", registerAccountHandler);
}