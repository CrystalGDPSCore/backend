import { FastifyInstance } from "fastify";

import { apiAddSongHandler, apiGetSongInfoByIDHandler } from "../../../controllers/other/api/song";

import { $songRef } from "../../../schemas/song";

export default async function apiSongRoutes(fastify: FastifyInstance) {
    fastify.post("/song", {
        schema: {
            body: $songRef("songIDSchema"),
            response: {
                200: $songRef("getSongByIDResponseSchema")
            }
        }
    }, apiGetSongInfoByIDHandler);

    fastify.post("/song/add", {
        schema: {
            body: $songRef("apiAddSongSchema"),
            response: {
                200: $songRef("songIDSchema")
            }
        }
    }, apiAddSongHandler);
}