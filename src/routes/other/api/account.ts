import { FastifyInstance } from "fastify";

import { apiRegisterAccountHandler } from "../../../controllers/other/api/account";

import { $accountRef } from "../../../schemas/account";

export default async function apiAccountRoutes(fastify: FastifyInstance) {
    fastify.post("/account/register", {
        schema: {
            body: $accountRef("apiRegisterAccountSchema"),
            response: {
                200: $accountRef("registerSuccessSchema")
            }
        }
    }, apiRegisterAccountHandler);
}