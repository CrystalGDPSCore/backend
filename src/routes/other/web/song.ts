import { FastifyInstance } from "fastify";

import { addSongHandler } from "../../../controllers/other/web/song";

export default async function songRoutes(fastify: FastifyInstance) {
    fastify.get("/add", addSongHandler);
}