import { FastifyInstance } from "fastify";

import { ZodTypeProvider } from "fastify-type-provider-zod";

import { getSfxFileController, getMp3FileController } from "../../controllers/other/customContent";

import { getSfxFileSchema, getMp3FileSchema } from "../../schemas/other/customContent";

export default async function customContentRoutes(fastify: FastifyInstance) {
    fastify.withTypeProvider<ZodTypeProvider>().get("/sfx/:file", {
        schema: {
            params: getSfxFileSchema
        }
    }, getSfxFileController);

    fastify.withTypeProvider<ZodTypeProvider>().get("/mp3/:songId", {
        schema: {
            params: getMp3FileSchema
        }
    }, getMp3FileController);
}