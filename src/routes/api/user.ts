import { FastifyInstance } from "fastify";

import { ZodTypeProvider } from "fastify-type-provider-zod";

import { apiLoginUserController } from "../../controllers/api/user";

import { apiLoginUserSchema, apiLoginUserResponseSchema } from "../../schemas/api/user";
import { userErrorResponseSchema } from "../../schemas/api/error";

export default async function apiUserRoutes(fastify: FastifyInstance) {
    fastify.withTypeProvider<ZodTypeProvider>().post("/user/login", {
        schema: {
            body: apiLoginUserSchema,
            response: {
                200: apiLoginUserResponseSchema,
                500: userErrorResponseSchema
            }
        }
    }, apiLoginUserController);
}