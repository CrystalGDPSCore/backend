import { FastifyInstance } from "fastify";

import { getSfxFileHandler, getMp3Handler } from "../../../controllers/other/web/customContent";

export default async function customContentRoutes(fastify: FastifyInstance) {
    fastify.get("/sfx/:file", getSfxFileHandler);
    fastify.get("/mp3", getMp3Handler);
}