import { FastifyInstance } from "fastify";

import { ZodTypeProvider } from "fastify-type-provider-zod";

import { apiAddSongController } from "../../controllers/api/song";

import auth from "../../middlewares/auth";

import { apiAddSongSchema, apiAddSongResponseSchema } from "../../schemas/api/song";
import { songErrorResponseSchema } from "../../schemas/api/error";

export default async function apiSongRoutes(fastify: FastifyInstance) {
    fastify.withTypeProvider<ZodTypeProvider>().post("/song/add", {
        onRequest: auth,
        schema: {
            body: apiAddSongSchema,
            response: {
                200: apiAddSongResponseSchema,
                202: songErrorResponseSchema,
                400: songErrorResponseSchema
            }
        }
    }, apiAddSongController);
}