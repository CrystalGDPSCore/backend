import { FastifyInstance } from "fastify";

import { getCustomContentURLHandler, getGJSongInfoHandler } from "../../controllers/gd/customContent";

export default async function gdCustomContentRoutes(fastify: FastifyInstance) {
    fastify.post("/getGJSongInfo.php", getGJSongInfoHandler);
    fastify.post("/getCustomContentURL.php", getCustomContentURLHandler);
}