import { FastifyInstance } from "fastify";

import { requestUserAccessHandler } from "../../controllers/gd/misc";

export default async function gdMiscRoutes(fastify: FastifyInstance) {
    fastify.post("/requestUserAccess.php", requestUserAccessHandler);
}