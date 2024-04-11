import { FastifyInstance } from "fastify";

import { ZodTypeProvider } from "fastify-type-provider-zod";

import { getGJUserListController } from "../../controllers/gd/relationship";

import checkSecret from "../../middlewares/checkSecret";

import { getGJUserListSchema } from "../../schemas/gd/relationship";

import { Secret } from "../../helpers/enums";

export default async function gdRelationshipRoutes(fastify: FastifyInstance) {
    fastify.withTypeProvider<ZodTypeProvider>().post("/getGJUserList20.php", {
        preHandler: checkSecret(Secret.Common),
        schema: {
            body: getGJUserListSchema
        }
    }, getGJUserListController);
}