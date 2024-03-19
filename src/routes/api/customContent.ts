import { FastifyInstance } from "fastify";

import { ZodTypeProvider } from "fastify-type-provider-zod";

import { apiAddSongController } from "../../controllers/api/customContent";

import { apiAddSongSchema, apiAddSongResponseSchema } from "../../schemas/api/customContent";
import { songErrorResponseSchema } from "../../schemas/api/error";

export default async function apiCustomContentRoutes(fastify: FastifyInstance) {
    fastify.withTypeProvider<ZodTypeProvider>().post("/song/add", {
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