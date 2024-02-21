import { FastifyInstance } from "fastify";

import { activateAccountHandler } from "../../../controllers/other/web/account";

export default async function accountRoutes(fastify: FastifyInstance) {
    fastify.get("/activate", activateAccountHandler)
}